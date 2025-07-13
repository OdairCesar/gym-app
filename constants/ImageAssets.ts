/**
 * Utilitário para gerenciar assets de imagem do aplicativo
 * Centraliza o acesso às imagens e permite configurações dinâmicas
 */

export const ImageAssets = {
  // Imagens principais do app
  icon: require('../assets/images/physical-academia/ios/iTunesArtwork@2x.png'),
  favicon: require('../assets/images/physical-academia/android/ic_launcher-web.png'),
  adaptiveIcon: require('../assets/images/physical-academia/android/mipmap-hdpi/ic_launcher_foreground.png'),
  splashIcon: require('../assets/images/physical-academia/android/ic_launcher-web.png'),
  androidIcon: require('../assets/images/physical-academia/android/mipmap-hdpi/ic_launcher.png'),

  // Paths para configuração do app.json
  paths: {
    icon: './assets/images/physical-academia/ios/iTunesArtwork@2x.png',
    favicon: './assets/images/physical-academia/android/ic_launcher-web.png',
    adaptiveIcon:
      './assets/images/physical-academia/android/mipmap-hdpi/ic_launcher_foreground.png',
    splashIcon: './assets/images/physical-academia/android/ic_launcher-web.png',
    androidIcon:
      './assets/images/physical-academia/android/mipmap-hdpi/ic_launcher.png',
    iosIconSet: './assets/images/physical-academia/ios/AppIcon.appiconset',
  },

  // Configurações específicas para cada plataforma
  splash: {
    backgroundColor: '#ffffff',
    resizeMode: 'contain' as const,
  },

  adaptiveIconConfig: {
    backgroundColor: '#ffffff',
  },
}

export type ImageAssetType = keyof typeof ImageAssets
