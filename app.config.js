export default ({ config }) => ({
  ...config,
  name: 'Physical Academia - Seu App de Treino',
  slug: 'gym',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/physical-academia/ios/iTunesArtwork@2x.png',
  scheme: 'gym',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/images/physical-academia/android/ic_launcher-web.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.anonymous.gym',
    icon: './assets/images/physical-academia/ios/AppIcon.appiconset',
  },
  android: {
    adaptiveIcon: {
      foregroundImage:
        './assets/images/physical-academia/android/mipmap-hdpi/ic_launcher_foreground.png',
      backgroundColor: '#ffffff',
    },
    icon: './assets/images/physical-academia/android/mipmap-hdpi/ic_launcher.png',
    edgeToEdgeEnabled: true,
    package: 'com.anonymous.gym',
    permissions: [
      'android.permission.RECORD_AUDIO',
      'android.permission.CAMERA',
    ],
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/physical-academia/android/ic_launcher-web.png',
  },
  plugins: [
    'expo-router',
    'expo-notifications',
    [
      'expo-splash-screen',
      {
        image: './assets/images/physical-academia/android/ic_launcher-web.png',
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
