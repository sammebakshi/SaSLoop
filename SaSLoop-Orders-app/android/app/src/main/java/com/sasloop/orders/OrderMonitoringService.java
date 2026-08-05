package com.sasloop.orders;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.media.AudioAttributes;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.PowerManager;
import android.util.Log;
import androidx.core.app.NotificationCompat;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashSet;
import java.util.Set;

public class OrderMonitoringService extends Service {
    private static final String TAG = "OrderMonitorService";
    private static final String FOREGROUND_CHANNEL_ID = "sasloop_foreground_service_channel";
    private static final String ALERT_CHANNEL_ID = "sasloop_urgent_order_alert_v6";
    private static final int FOREGROUND_NOTIFICATION_ID = 9901;

    private Handler handler;
    private Runnable pollRunnable;
    private final Set<String> seenOrderIds = new HashSet<>();
    private final Set<String> seenReservationIds = new HashSet<>();
    private boolean isInitialCheck = true;
    private boolean isInitialResCheck = true;
    private MediaPlayer mediaPlayer;

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "OrderMonitoringService Created 🚀");

        SharedPreferences prefs = getSharedPreferences("SaSLoopOrders", Context.MODE_PRIVATE);
        String token = prefs.getString("auth_token", null);
        if (token == null || token.trim().isEmpty() || token.equalsIgnoreCase("null")) {
            Log.d(TAG, "🔒 OrderMonitoringService created without valid token. Self-stopping.");
            stopSelf();
            return;
        }

        createNotificationChannels();
        startForegroundServiceNotification();

        handler = new Handler(Looper.getMainLooper());
        pollRunnable = new Runnable() {
            @Override
            public void run() {
                checkNewOrders();
                checkNewTableReservations();
                handler.postDelayed(this, 5000); // Poll every 5 seconds
            }
        };
        handler.post(pollRunnable);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        SharedPreferences prefs = getSharedPreferences("SaSLoopOrders", Context.MODE_PRIVATE);
        String token = prefs.getString("auth_token", null);
        if (token == null || token.trim().isEmpty() || token.equalsIgnoreCase("null")) {
            Log.d(TAG, "🔒 Service started without valid auth token. Stopping background monitor service.");
            stopContinuousAlarm();
            stopSelf();
            return START_NOT_STICKY;
        }

        if (intent != null && "ACTION_STOP_ALARM".equals(intent.getAction())) {
            stopContinuousAlarm();
        }
        return START_STICKY;
    }

    @Override
    public void onTaskRemoved(Intent rootIntent) {
        Log.d(TAG, "App cleared from recent apps! Auto-restarting background monitoring service...");
        try {
            Intent restartServiceIntent = new Intent(getApplicationContext(), OrderMonitoringService.class);
            restartServiceIntent.setPackage(getPackageName());

            PendingIntent restartServicePendingIntent = PendingIntent.getService(
                    getApplicationContext(), 1, restartServiceIntent,
                    PendingIntent.FLAG_ONE_SHOT | PendingIntent.FLAG_IMMUTABLE
            );

            AlarmManager alarmService = (AlarmManager) getApplicationContext().getSystemService(Context.ALARM_SERVICE);
            if (alarmService != null) {
                alarmService.set(
                        AlarmManager.RTC_WAKEUP,
                        System.currentTimeMillis() + 1000,
                        restartServicePendingIntent
                );
            }
        } catch (Exception e) {
            Log.e(TAG, "Error in onTaskRemoved auto-restart: " + e.getMessage());
        }
        super.onTaskRemoved(rootIntent);
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        stopContinuousAlarm();
        if (handler != null && pollRunnable != null) {
            handler.removeCallbacks(pollRunnable);
        }
        super.onDestroy();
    }

    private synchronized void startContinuousAlarm() {
        try {
            // Check device ringer mode so silent/vibrate mode is respected
            AudioManager audioManager = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
            if (audioManager != null) {
                int ringerMode = audioManager.getRingerMode();
                if (ringerMode != AudioManager.RINGER_MODE_NORMAL) {
                    Log.d(TAG, "🔇 Phone is in Silent/Vibrate mode. Skipping audio chime playback.");
                    return;
                }
            }

            if (mediaPlayer == null) {
                mediaPlayer = MediaPlayer.create(this, R.raw.order_chime);
                if (mediaPlayer != null) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                        mediaPlayer.setAudioAttributes(
                                new AudioAttributes.Builder()
                                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                                        .setUsage(AudioAttributes.USAGE_NOTIFICATION_RINGTONE)
                                        .build()
                        );
                    }
                    mediaPlayer.setLooping(true);
                    mediaPlayer.start();
                    Log.d(TAG, "🔔 Continuous restaurant chime alert started!");
                }
            } else if (!mediaPlayer.isPlaying()) {
                mediaPlayer.start();
            }
        } catch (Exception e) {
            Log.e(TAG, "Error starting continuous alarm: " + e.getMessage());
        }
    }

    private synchronized void stopContinuousAlarm() {
        try {
            if (mediaPlayer != null) {
                if (mediaPlayer.isPlaying()) {
                    mediaPlayer.stop();
                }
                mediaPlayer.release();
                mediaPlayer = null;
                Log.d(TAG, "🔕 Continuous restaurant chime alert stopped!");
            }
        } catch (Exception e) {
            Log.e(TAG, "Error stopping continuous alarm: " + e.getMessage());
        }
    }

    private void createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager == null) return;

            // 1. Silent Foreground Monitor Channel
            NotificationChannel fgChannel = new NotificationChannel(
                    FOREGROUND_CHANNEL_ID,
                    "SaSLoop Background Order Monitor",
                    NotificationManager.IMPORTANCE_MIN
            );
            fgChannel.setDescription("Keeps order monitoring active in background");
            fgChannel.setShowBadge(false);
            manager.createNotificationChannel(fgChannel);

            // 2. Urgent Order Alert Channel (Custom order_chime sound & Vibration)
            Uri customSoundUri = Uri.parse("android.resource://" + getPackageName() + "/" + R.raw.order_chime);
            AudioAttributes audioAttributes = new AudioAttributes.Builder()
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .setUsage(AudioAttributes.USAGE_NOTIFICATION_RINGTONE)
                    .build();

            NotificationChannel alertChannel = new NotificationChannel(
                    ALERT_CHANNEL_ID,
                    "SaSLoop Restaurant Chime Order Alerts",
                    NotificationManager.IMPORTANCE_HIGH
            );
            alertChannel.setDescription("Continuous dual-tone restaurant chime alerts for incoming orders");
            alertChannel.setSound(customSoundUri, audioAttributes);
            alertChannel.enableVibration(true);
            alertChannel.setVibrationPattern(new long[]{0, 500, 200, 500, 200, 1000});
            manager.createNotificationChannel(alertChannel);
        }
    }

    private void startForegroundServiceNotification() {
        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(
                this, 0, notificationIntent,
                PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT
        );

        Notification notification = new NotificationCompat.Builder(this, FOREGROUND_CHANNEL_ID)
                .setContentTitle("SaSLoop Orders Monitor Active")
                .setContentText("Listening for live orders in background...")
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentIntent(pendingIntent)
                .setOngoing(true)
                .setPriority(NotificationCompat.PRIORITY_MIN)
                .build();

        startForeground(FOREGROUND_NOTIFICATION_ID, notification);
    }

    private void checkNewOrders() {
        new Thread(() -> {
            try {
                SharedPreferences prefs = getSharedPreferences("SaSLoopOrders", Context.MODE_PRIVATE);
                String token = prefs.getString("auth_token", null);
                String bizId = prefs.getString("biz_id", null);

                if (token == null || token.trim().isEmpty() || token.equalsIgnoreCase("null")) {
                    Log.d(TAG, "🔒 User logged out / No auth token. Skipping order polling.");
                    stopContinuousAlarm();
                    return;
                }

                String urlStr = "https://backend.sasloop.in/api/orders?limit=15";
                if (bizId != null && !bizId.isEmpty() && !bizId.equalsIgnoreCase("null")) {
                    urlStr += "&target_user_id=" + bizId;
                }

                URL url = new URL(urlStr);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setConnectTimeout(6000);
                conn.setReadTimeout(6000);

                if (token != null && !token.isEmpty() && !token.equalsIgnoreCase("null")) {
                    conn.setRequestProperty("Authorization", "Bearer " + token);
                }

                int responseCode = conn.getResponseCode();
                if (responseCode == 200) {
                    BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                    StringBuilder response = new StringBuilder();
                    String inputLine;
                    while ((inputLine = in.readLine()) != null) {
                        response.append(inputLine);
                    }
                    in.close();

                    String jsonStr = response.toString();
                    JSONArray ordersArray = null;

                    if (jsonStr.startsWith("[")) {
                        ordersArray = new JSONArray(jsonStr);
                    } else if (jsonStr.startsWith("{")) {
                        JSONObject obj = new JSONObject(jsonStr);
                        if (obj.has("orders")) {
                            ordersArray = obj.getJSONArray("orders");
                        }
                    }

                    if (ordersArray != null) {
                        int newPendingCount = 0;
                        String lastOrderRef = "";
                        String lastOrderTotal = "";

                        for (int i = 0; i < ordersArray.length(); i++) {
                            JSONObject order = ordersArray.getJSONObject(i);
                            String orderId = String.valueOf(order.opt("id"));
                            String status = order.optString("status", "").toUpperCase();
                            String ref = order.optString("order_reference", order.optString("bill_no", "ORD-" + orderId));
                            String total = order.optString("total_price", order.optString("total_amount", "0"));

                            String orderType = order.optString("order_type", "").toUpperCase();
                            String source = order.optString("source", "").toUpperCase();
                            String terminal = order.optString("terminal", "").trim();
                            boolean isPOSFlag = order.optBoolean("is_pos", false);
                            boolean isPOSSale = source.contains("POS") || isPOSFlag || !terminal.isEmpty() || (!source.contains("WHATSAPP") && !source.contains("ONLINE") && !source.contains("DIGITAL") && !source.contains("WEB") && !orderType.equals("DELIVERY"));

                            boolean isUnconfirmedQuote = status.contains("AWAITING_CUSTOMER") || status.contains("AWAITING_DELIVERY");
                            boolean isPending = (status.contains("PENDING") || status.contains("AWAITING") || status.contains("PLACED") || status.contains("NEW") || status.contains("CONFIRMED")) && !isUnconfirmedQuote;

                            String stateKey = orderId + "_" + status;

                            if (isInitialCheck) {
                                seenOrderIds.add(stateKey);
                            } else {
                                if (!seenOrderIds.contains(stateKey) && isPending && !isPOSSale) {
                                    seenOrderIds.add(stateKey);
                                    newPendingCount++;
                                    lastOrderRef = ref;
                                    lastOrderTotal = total;
                                }
                            }
                        }

                        if (isInitialCheck) {
                            isInitialCheck = false;
                        } else if (newPendingCount > 0) {
                            Log.d(TAG, "🚨 NEW ORDER DETECTED IN BACKGROUND: " + lastOrderRef);
                            triggerSystemNotification(lastOrderRef, lastOrderTotal, newPendingCount);
                        }
                    }
                } else {
                    Log.w(TAG, "Background orders request returned code: " + responseCode);
                }
                conn.disconnect();
            } catch (Exception e) {
                Log.w(TAG, "Background check failed: " + e.getMessage());
            }
        }).start();
    }

    private void triggerSystemNotification(String orderRef, String total, int count) {
        try {
            // Wake lock to wake up phone screen when locked (WhatsApp / Messenger behavior)
            PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
            if (pm != null) {
                PowerManager.WakeLock wl = pm.newWakeLock(
                        PowerManager.SCREEN_BRIGHT_WAKE_LOCK | PowerManager.ACQUIRE_CAUSES_WAKEUP,
                        "SaSLoop:NewOrderWakeLock"
                );
                wl.acquire(5000);
            }

            // 1. Start continuous looping playback of custom order_chime.wav
            startContinuousAlarm();

            // 2. Post System Notification Panel Alert
            Intent intent = new Intent(this, MainActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            PendingIntent pendingIntent = PendingIntent.getActivity(
                    this, (int) System.currentTimeMillis(), intent,
                    PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT
            );

            String title = "🚨 NEW ORDER RECEIVED! (" + count + ")";
            String body = "Order Ref: " + orderRef + " | Total: ₹" + total + " - Tap to open SaSLoop Orders";

            Uri customSoundUri = Uri.parse("android.resource://" + getPackageName() + "/" + R.raw.order_chime);

            Notification notification = new NotificationCompat.Builder(this, ALERT_CHANNEL_ID)
                    .setContentTitle(title)
                    .setContentText(body)
                    .setStyle(new NotificationCompat.BigTextStyle().bigText(body))
                    .setSmallIcon(R.mipmap.ic_launcher)
                    .setContentIntent(pendingIntent)
                    .setAutoCancel(true)
                    .setSound(customSoundUri)
                    .setVibrate(new long[]{0, 500, 200, 500, 200, 1000})
                    .setPriority(NotificationCompat.PRIORITY_MAX)
                    .setCategory(NotificationCompat.CATEGORY_CALL)
                    .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                    .setFullScreenIntent(pendingIntent, true)
                    .setDefaults(Notification.DEFAULT_ALL)
                    .build();

            NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            if (manager != null) {
                int notificationId = (int) (System.currentTimeMillis() % 10000);
                manager.notify(notificationId, notification);
            }
        } catch (Exception e) {
            Log.e(TAG, "Failed to trigger system notification", e);
        }
    }

    private void checkNewTableReservations() {
        new Thread(() -> {
            try {
                SharedPreferences prefs = getSharedPreferences("SaSLoopOrders", Context.MODE_PRIVATE);
                String token = prefs.getString("auth_token", null);
                String bizId = prefs.getString("biz_id", null);

                if (token == null || token.trim().isEmpty() || token.equalsIgnoreCase("null")) {
                    Log.d(TAG, "🔒 User logged out / No auth token. Skipping reservation polling.");
                    stopContinuousAlarm();
                    return;
                }

                String urlStr = "https://backend.sasloop.in/api/reservations";
                if (bizId != null && !bizId.isEmpty() && !bizId.equalsIgnoreCase("null")) {
                    urlStr += "?target_user_id=" + bizId;
                }

                URL url = new URL(urlStr);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setConnectTimeout(6000);
                conn.setReadTimeout(6000);

                if (token != null && !token.isEmpty() && !token.equalsIgnoreCase("null")) {
                    conn.setRequestProperty("Authorization", "Bearer " + token);
                }

                int responseCode = conn.getResponseCode();
                if (responseCode == 200) {
                    BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                    StringBuilder response = new StringBuilder();
                    String inputLine;
                    while ((inputLine = in.readLine()) != null) {
                        response.append(inputLine);
                    }
                    in.close();

                    String jsonStr = response.toString();
                    JSONArray resArray = null;

                    if (jsonStr.startsWith("[")) {
                        resArray = new JSONArray(jsonStr);
                    } else if (jsonStr.startsWith("{")) {
                        JSONObject obj = new JSONObject(jsonStr);
                        if (obj.has("reservations")) {
                            resArray = obj.getJSONArray("reservations");
                        }
                    }

                    if (resArray != null) {
                        int newPendingCount = 0;
                        String lastResRef = "";
                        String lastCustomerName = "";

                        for (int i = 0; i < resArray.length(); i++) {
                            JSONObject resObj = resArray.getJSONObject(i);
                            String resId = String.valueOf(resObj.opt("id"));
                            String status = resObj.optString("status", "").toUpperCase();
                            String ref = resObj.optString("reservation_ref", "RES-" + resId);
                            String name = resObj.optString("customer_name", "Guest");

                            boolean isPending = status.contains("PENDING");

                            if (isInitialResCheck) {
                                seenReservationIds.add(resId);
                            } else {
                                if (!seenReservationIds.contains(resId) && isPending) {
                                    seenReservationIds.add(resId);
                                    newPendingCount++;
                                    lastResRef = ref;
                                    lastCustomerName = name;
                                }
                            }
                        }

                        if (isInitialResCheck) {
                            isInitialResCheck = false;
                        } else if (newPendingCount > 0) {
                            Log.d(TAG, "🍽️ NEW TABLE RESERVATION DETECTED IN BACKGROUND: " + lastResRef);
                            triggerReservationSystemNotification(lastResRef, lastCustomerName, newPendingCount);
                        }
                    }
                }
                conn.disconnect();
            } catch (Exception e) {
                Log.w(TAG, "Background reservation check failed: " + e.getMessage());
            }
        }).start();
    }

    private void triggerReservationSystemNotification(String resRef, String customerName, int count) {
        try {
            // 1. Start continuous looping playback of custom order_chime.wav
            startContinuousAlarm();

            // 2. Post System Notification Panel Alert
            Intent intent = new Intent(this, MainActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            PendingIntent pendingIntent = PendingIntent.getActivity(
                    this, (int) System.currentTimeMillis(), intent,
                    PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT
            );

            String title = "🍽️ NEW TABLE BOOKING! (" + count + ")";
            String body = "Ref: " + resRef + " | Customer: " + customerName + " - Tap to review table reservation";

            Uri customSoundUri = Uri.parse("android.resource://" + getPackageName() + "/" + R.raw.order_chime);

            Notification notification = new NotificationCompat.Builder(this, ALERT_CHANNEL_ID)
                    .setContentTitle(title)
                    .setContentText(body)
                    .setStyle(new NotificationCompat.BigTextStyle().bigText(body))
                    .setSmallIcon(R.mipmap.ic_launcher)
                    .setContentIntent(pendingIntent)
                    .setAutoCancel(true)
                    .setSound(customSoundUri)
                    .setVibrate(new long[]{0, 500, 200, 500, 200, 1000})
                    .setPriority(NotificationCompat.PRIORITY_MAX)
                    .setCategory(NotificationCompat.CATEGORY_CALL)
                    .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                    .build();

            NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            if (manager != null) {
                int notificationId = (int) (System.currentTimeMillis() % 10000);
                manager.notify(notificationId, notification);
            }
        } catch (Exception e) {
            Log.e(TAG, "Failed to trigger reservation system notification", e);
        }
    }
}
