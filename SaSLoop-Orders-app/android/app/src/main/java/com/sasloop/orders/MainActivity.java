package com.sasloop.orders;

import android.Manifest;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.media.AudioManager;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestNotificationPermission();

        // Register Native Auth Bridge on WebView
        try {
            WebView webView = getBridge().getWebView();
            if (webView != null) {
                webView.addJavascriptInterface(new WebAppInterface(this), "AndroidNativeAuth");
                Log.d("MainActivity", "✅ AndroidNativeAuth JavascriptInterface registered on WebView");
            }
        } catch (Exception e) {
            Log.e("MainActivity", "Error attaching JavascriptInterface: " + e.getMessage());
        }

        startBackgroundService();
    }

    @Override
    public void onResume() {
        super.onResume();
        // Turn off background continuous alert sound immediately upon opening app
        stopBackgroundAlarmSound();
    }

    @Override
    public void onStart() {
        super.onStart();
        stopBackgroundAlarmSound();
    }

    private void stopBackgroundAlarmSound() {
        try {
            SharedPreferences prefs = getSharedPreferences("SaSLoopOrders", Context.MODE_PRIVATE);
            String token = prefs.getString("auth_token", null);
            if (token == null || token.trim().isEmpty() || token.equalsIgnoreCase("null")) {
                return;
            }

            Intent stopIntent = new Intent(this, OrderMonitoringService.class);
            stopIntent.setAction("ACTION_STOP_ALARM");
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                startForegroundService(stopIntent);
            } else {
                startService(stopIntent);
            }
        } catch (Exception e) {
            Log.e("MainActivity", "Error sending stop alarm intent: " + e.getMessage());
        }
    }

    public class WebAppInterface {
        Context mContext;

        WebAppInterface(Context c) {
            mContext = c;
        }

        @JavascriptInterface
        public void saveAuthToken(String token, String bizId) {
            try {
                SharedPreferences prefs = mContext.getSharedPreferences("SaSLoopOrders", Context.MODE_PRIVATE);
                prefs.edit().putString("auth_token", token).putString("biz_id", bizId).apply();
                Log.d("WebAppInterface", "✅ Auth token & bizId saved to Android SharedPreferences!");
                
                startBackgroundService();
            } catch (Exception e) {
                Log.e("WebAppInterface", "Error saving auth token: " + e.getMessage());
            }
        }

        @JavascriptInterface
        public void clearAuthToken() {
            try {
                SharedPreferences prefs = mContext.getSharedPreferences("SaSLoopOrders", Context.MODE_PRIVATE);
                prefs.edit().clear().apply();
                Log.d("WebAppInterface", "🛑 Auth token & bizId cleared from Android SharedPreferences on Logout!");

                Intent serviceIntent = new Intent(mContext, OrderMonitoringService.class);
                mContext.stopService(serviceIntent);

                NotificationManager manager = (NotificationManager) mContext.getSystemService(Context.NOTIFICATION_SERVICE);
                if (manager != null) {
                    manager.cancelAll();
                }
                Log.d("WebAppInterface", "🛑 Background OrderMonitoringService stopped & notifications cleared!");
            } catch (Exception e) {
                Log.e("WebAppInterface", "Error clearing auth token: " + e.getMessage());
            }
        }

        @JavascriptInterface
        public void stopAlarm() {
            stopBackgroundAlarmSound();
        }

        @JavascriptInterface
        public boolean isDeviceSilent() {
            try {
                AudioManager audioManager = (AudioManager) mContext.getSystemService(Context.AUDIO_SERVICE);
                if (audioManager != null) {
                    int ringerMode = audioManager.getRingerMode();
                    return ringerMode != AudioManager.RINGER_MODE_NORMAL;
                }
            } catch (Exception e) {
                Log.e("WebAppInterface", "Error checking ringer mode: " + e.getMessage());
            }
            return false;
        }
    }

    private void requestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= 33) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(
                        this,
                        new String[]{Manifest.permission.POST_NOTIFICATIONS},
                        101
                );
            }
        }
    }

    private void startBackgroundService() {
        try {
            SharedPreferences prefs = getSharedPreferences("SaSLoopOrders", Context.MODE_PRIVATE);
            String token = prefs.getString("auth_token", null);
            if (token == null || token.trim().isEmpty() || token.equalsIgnoreCase("null")) {
                Log.d("MainActivity", "🔒 No auth token in SharedPreferences. Not starting background service.");
                return;
            }

            Intent serviceIntent = new Intent(this, OrderMonitoringService.class);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                startForegroundService(serviceIntent);
            } else {
                startService(serviceIntent);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
