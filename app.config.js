export default ({ config }) => ({
  ...config,
  name: 'Gyim - Seu App de Treino e Dieta',
  slug: 'gym',
  version: '1.0.2',
  orientation: 'portrait',
  icon: './assets/images/ios/iTunesArtwork@2x.png',
  scheme: 'gym',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/images/android/ic_launcher-web.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.odairdev.gyim',
    icon: './assets/images/ios/AppIcon.appiconset',
  },
  android: {
    adaptiveIcon: {
      foregroundImage:
        './assets/images/android/mipmap-hdpi/ic_launcher_foreground.png',
      backgroundColor: '#ffffff',
    },
    icon: './assets/images/android/mipmap-hdpi/ic_launcher.png',
    edgeToEdgeEnabled: true,
    package: 'com.odairdev.gyim',
    permissions: [
      'android.permission.RECORD_AUDIO',
      'android.permission.CAMERA',
    ],
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/android/ic_launcher-web.png',
  },
  plugins: [
    'expo-router',
    'expo-notifications',
    [
      'expo-splash-screen',
      {
        image: './assets/images/android/ic_launcher-web.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: '2cff7688-7b36-4a02-b76e-9e302a35fd47',
    },
  },
})
