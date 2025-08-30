import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.cb547f1666ed4bfa8ba4d4d1de8484ce',
  appName: 'halo-shimmer-wave',
  webDir: 'dist',
  server: {
    url: 'https://cb547f16-66ed-4bfa-8ba4-d4d1de8484ce.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#ffffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999"
    }
  }
};

export default config;