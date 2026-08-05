import { LocalNotifications } from '@capacitor/local-notifications';

class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.isMuted = false;
    this.loopInterval = null;
    this.isPlaying = false;
    this.swRegistration = null;

    // Register Service Worker for web backup
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          this.swRegistration = reg;
        })
        .catch((err) => console.warn('ServiceWorker registration failed:', err));
    }

    this.setupCapacitorNotifications();
  }

  async setupCapacitorNotifications() {
    try {
      // Create high-importance Android Notification Channel with sound & vibration
      await LocalNotifications.createChannel({
        id: 'sasloop_order_alerts',
        name: 'SaSLoop Order & Reservation Alerts',
        description: 'Urgent notification alerts for incoming orders and table bookings',
        importance: 5, // MAX Importance - Heads Up Banner + Sound + Vibration
        visibility: 1, // PUBLIC
        vibration: true
      });
      console.log('✅ Android Notification Channel initialized');
    } catch (e) {
      console.warn('Capacitor channel setup:', e);
    }
  }

  async requestPermissions() {
    try {
      // 1. Request Capacitor Native Android Notification Permissions
      const status = await LocalNotifications.checkPermissions();
      if (status.display !== 'granted') {
        await LocalNotifications.requestPermissions();
      }
    } catch (e) {
      console.warn('Capacitor notification permissions:', e);
    }

    // 2. Web fallback
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    this.requestPermissions();
  }

  // Synthesize loud dual-tone chime ring for in-app audio
  playChimeTone() {
    try {
      if (typeof window !== 'undefined' && window.AndroidNativeAuth && typeof window.AndroidNativeAuth.isDeviceSilent === 'function') {
        if (window.AndroidNativeAuth.isDeviceSilent()) {
          console.log("🔇 Device is in silent/vibrate mode. Skipping web audio chime.");
          return;
        }
      }

      this.initContext();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;

      // Tone 1 (High bell)
      const osc1 = this.audioCtx.createOscillator();
      const gain1 = this.audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.exponentialRampToValueAtTime(1318.51, now + 0.15);
      gain1.gain.setValueAtTime(0.7, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc1.connect(gain1);
      gain1.connect(this.audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.5);

      // Tone 2 (Accent bell)
      const osc2 = this.audioCtx.createOscillator();
      const gain2 = this.audioCtx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1046.50, now + 0.18);
      osc2.frequency.exponentialRampToValueAtTime(1567.98, now + 0.35);
      gain2.gain.setValueAtTime(0.8, now + 0.18);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc2.connect(gain2);
      gain2.connect(this.audioCtx.destination);
      osc2.start(now + 0.18);
      osc2.stop(now + 0.7);
    } catch (e) {
      console.warn("Audio chime play error:", e);
    }
  }

  // Send Native Android System Notification (appears in notification panel shade with sound!)
  async sendSystemNotification(title, body) {
    try {
      // Priority 1: Native Capacitor Local Notifications (Android System Panel)
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id: Math.floor(Math.random() * 1000000),
            channelId: 'sasloop_order_alerts',
            schedule: { at: new Date(Date.now() + 100) },
            actionTypeId: '',
            extra: null
          }
        ]
      });
      console.log('✅ Native Android LocalNotification dispatched into Notification Panel');
    } catch (capErr) {
      console.warn("Capacitor notification fallback to Web API:", capErr);

      // Priority 2: Web Notification / ServiceWorker
      try {
        if ('Notification' in window && Notification.permission === 'granted') {
          if (this.swRegistration && this.swRegistration.showNotification) {
            await this.swRegistration.showNotification(title, {
              body,
              icon: '/logo.png',
              badge: '/logo.png',
              vibrate: [200, 100, 200, 100, 400],
              tag: 'sasloop-order-alert',
              renotify: true,
              requireInteraction: true
            });
          } else {
            new Notification(title, {
              body,
              icon: '/logo.png',
              tag: 'sasloop-order-alert',
              requireInteraction: true
            });
          }
        }
      } catch (webErr) {
        console.warn("Web notification error:", webErr);
      }
    }
  }

  startAlertLoop(title = '🚨 New Order Received!', body = 'Tap to open SaSLoop Orders dashboard') {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.initContext();
    this.playChimeTone();
    this.sendSystemNotification(title, body);

    if (this.loopInterval) clearInterval(this.loopInterval);

    this.loopInterval = setInterval(() => {
      if (!this.isMuted) {
        this.playChimeTone();
      }
    }, 2200);
  }

  stopAlertLoop() {
    this.isPlaying = false;
    if (this.loopInterval) {
      clearInterval(this.loopInterval);
      this.loopInterval = null;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopAlertLoop();
    }
    return this.isMuted;
  }

  testSound() {
    this.initContext();
    this.playChimeTone();
    setTimeout(() => this.playChimeTone(), 400);
    this.sendSystemNotification('SaSLoop Orders Test Alert', 'Native Android Notification Panel alerts & audio chime working!');
  }
}

export const audioEngine = new SoundEngine();
export default audioEngine;
