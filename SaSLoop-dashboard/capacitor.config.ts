import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sasloop.app',
  appName: 'SaSLoop AI',
  webDir: 'build',
  
  /* 
  // Server config for development (live reload via tunnel)
  // Comment out this block for production builds
  server: {
    // Use ngrok tunnel for API calls from native app
    url: 'https://comply-lagged-concave.ngrok-free.dev',
    cleartext: true,
    allowNavigation: ['*']
  },
  */

  // Android-specific settings
  android: {
    allowMixedContent: true,
    backgroundColor: '#ffffff',
    // Enable WebView debugging in development
    webContentsDebuggingEnabled: true
  },

  // Status bar & splash screen
  plugins: {
    StatusBar: {
      backgroundColor: '#ffffff',
      style: 'LIGHT',
      overlaysWebView: false
    },
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#ffffff',
      showSpinner: true,
      spinnerColor: '#10b981',
      androidScaleType: 'CENTER_CROP'
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#10b981'
    }
  }
};

export default config;
