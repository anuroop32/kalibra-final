import { resolve } from 'path';
import { config } from 'dotenv';
import appJson from './app.json';

config({ path: resolve(__dirname, './.env') });
export default {
  name: 'kalibraNewFE',
  slug: 'kalibraNewFE',
  version: appJson.expo.version,
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'kalibra',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain'
  },
  updates: {
    enabled: false,
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'ai.kalibraNewFE.app.ios',
    buildNumber: appJson.expo.ios.buildNumber,
    config: {
      usesNonExemptEncryption: false
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#FFFFFF'
    },
    package: 'ai.kalibraNewFE.app.android',
    versionCode: appJson.expo.android.versionCode
  },
  web: {
    favicon: './assets/images/favicon.png',
    build: {
      babel: {
        include: ['@ui-kitten/components']
      }
    }
  }
};
