import 'react-native-gesture-handler'; // Import before React. iOS/Android requirement.

// ignore all logs
import { LogBox } from 'react-native';
import React from 'react';
import { AppearanceProvider } from 'react-native-appearance';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { KalibraCustomIconPack } from './src/core/constants/KalibraCustomIconPack';
import { AppContext, useAppInitializer, AppContextProvider, KalibraDesign, Config } from './src/core';
import AppRootView from './src/components/AppRootView';
import Amplify from '@aws-amplify/core';

if (!Config.DEBUG_MODE) LogBox.ignoreAllLogs();

Amplify.configure({
  Auth: {
    identityPoolId: Config.COGNITO_IDENTITY_POOL_ID,
    region: Config.AWS_REGION,
    userPoolId: Config.COGNITO_USER_POOL_ID,
    userPoolWebClientId: Config.COGNITO_USER_POOL_WEB_CLIENT_ID
  },
  Storage: {
    AWSS3: {
      bucket: Config.USER_FILES_S3_BUCKET,
      region: Config.AWS_REGION
    }
  },
  Analytics: {
    disabled: false
  }
});

export default function App() {
  // call custom initializer hook
  const appInit: AppContextProvider = useAppInitializer();

  // render application entry point
  return !appInit.isInitComplete && !appInit.state.assetsHaveLoaded ? null : (
    <>
      <IconRegistry icons={[EvaIconsPack, KalibraCustomIconPack]} />
      <AppearanceProvider>
        <ApplicationProvider {...KalibraDesign} theme={appInit.state.kalibraTheme}>
          <AppContext.Provider value={appInit.appContextActions}>
            <AppRootView appContextState={appInit.state} />
          </AppContext.Provider>
        </ApplicationProvider>
      </AppearanceProvider>
    </>
  );
}
