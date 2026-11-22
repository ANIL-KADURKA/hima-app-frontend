import type { ExpoConfig } from 'expo/config';

const APP_IDENTITY = {
  nativeApplicationId: 'com.hima.callingpoc',
} as const;

const config: ExpoConfig = {
  name: 'hima-app-frontend',
  slug: 'hima-app-frontend',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  ios: {
    supportsTablet: true,
    bundleIdentifier: APP_IDENTITY.nativeApplicationId,
    googleServicesFile: './GoogleService-Info.plist',
  },
  android: {
    package: APP_IDENTITY.nativeApplicationId,
    googleServicesFile: './google-services.json',
    adaptiveIcon: {
      backgroundColor: '#F00087',
      foregroundImage: './assets/android-icon-foreground.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    [
      'expo-build-properties',
      {
        android: {
          kotlinVersion: '2.4.0',
        },
      },
    ],
    'expo-router',
    'expo-status-bar',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#F00087',
        image: './assets/hima-splash-logo.png',
        imageWidth: 160,
        resizeMode: 'contain',
        dark: {
          backgroundColor: '#F00087',
          image: './assets/hima-splash-logo.png',
        },
      },
    ],
    'expo-secure-store',
    '@react-native-firebase/app',
    '@react-native-google-signin/google-signin',
  ],
  scheme: 'hima-app-frontend',
  experiments: {
    typedRoutes: true,
  },
};

export default config;
