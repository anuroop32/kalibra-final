import React, { useRef } from 'react';
import { SafeAreaProvider, SafeAreaViewProps } from 'react-native-safe-area-context';
import { Platform, StyleSheet } from 'react-native';
import { RootStackNavigation, NavigationLinkingForWeb } from './nav';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { AppContext, AppContextState } from '../core';

// types
interface AppRootViewProps extends SafeAreaViewProps {
  appContextState: AppContextState;
}

const PERSISTENCE_KEY = 'NAVIGATION_STATE';

function AppRootView(props: AppRootViewProps) {
  // App Context
  const appContext = React.useContext(AppContext);
  // styles
  const styleContainer = StyleSheet.create({
    SafeAreaProvider: {
      flex: 1,
      margin: 'auto',
      width: props.appContextState.viewPortWidth
    }
  });
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef<string | undefined>('');

  // properties
  const isLoggedIn =
    props.appContextState.isLoggedIn &&
    props.appContextState.userToken !== '' &&
    props.appContextState.userToken.length > 0;

  const [isReady, setIsReady] = React.useState(false);
  const [strOldState, setStrOldState] = React.useState('');

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        if (Platform.OS == 'web') {
          // Only restore state if there's on web pflatform
          const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
          setStrOldState(savedStateString as string);
        }
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  if (!isReady) {
    return <></>;
  }

  // view
  return (
    <SafeAreaProvider style={styleContainer.SafeAreaProvider}>
      <NavigationContainer
        linking={NavigationLinkingForWeb}
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current = navigationRef.getCurrentRoute()?.name;
          if (Platform.OS == 'web') {
            const state = strOldState ? JSON.parse(strOldState) : undefined;

            //check for Navigation Timing API support
            // if (window.performance) {
            //   console.info('window.performance works fine on this browser');
            // }
            // console.info(performance.navigation.type);
            // if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
            //   console.info('This page is reloaded');
            // } else {
            //   console.info('This page is not reloaded');
            // }
            if (state !== undefined && performance.navigation.type == performance.navigation.TYPE_RELOAD) {
              setTimeout(() => {
                if (state.routes != undefined && state.routes.length > 0 && state.routes[0].state != undefined) {
                  navigationRef.resetRoot({
                    stale: true,
                    index: 0,
                    routeNames: [
                      'Main',
                      'AssessmentDetail',
                      'Settings',
                      'Profile',
                      'Feedback',
                      'ConnectedDevices',
                      'AboutUs'
                    ],
                    routes: [
                      {
                        key: 'Main-WFhqr-Lnew4tcqu3OOAHx',
                        name: 'Main',
                        state: {
                          stale: false,
                          type: 'tab',
                          key: 'tab-sD8X0Cb7YrFToZ9C0cWsx',
                          index: 0,
                          routeNames: ['Home', 'Kali', 'Actions', 'Profile'],
                          history: [
                            {
                              type: 'route',
                              key: 'Home-kNSSqfrPo9YZFF0QvJe3d'
                            }
                          ],
                          routes: [
                            {
                              name: 'Home',
                              key: 'Home-kNSSqfrPo9YZFF0QvJe3d'
                            },
                            {
                              name: 'Kali',
                              key: 'Kali-rhN3JHx-I38A0QvZQeAqL'
                            },
                            {
                              name: 'Actions',
                              key: 'Actions-9k_-NQjko5RjknJWOAJ2N'
                            },
                            {
                              name: 'Profile',
                              key: 'Profile-xSHHR_B1qXQcwxemfonCN'
                            }
                          ]
                        }
                      }
                    ]
                  });
                  setTimeout(() => {
                    navigationRef.navigate(state.routes[0].state.routeNames[state.routes[0].state.index]);
                  }, 10);
                }
              }, 20);
            }
          }
        }}
        onStateChange={async (state) => {
          if (Platform.OS == 'web') {
            await AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
          }
          const previousRouteName: string | undefined = routeNameRef.current;
          const currentRouteName: string | undefined = navigationRef.getCurrentRoute()?.name;
          const userAttributes = appContext.getUserAttrubutes();
          if (previousRouteName !== currentRouteName) {
            // Record navigation event in Analytics
            appContext.logEvent('Navigation/' + currentRouteName, {
              currentScreen: currentRouteName,
              previousScreen: previousRouteName,
              name: userAttributes?.name
            });
          }

          // Save the current route name for later comparison
          routeNameRef.current = currentRouteName;
        }}
      >
        <RootStackNavigation isFirstLoad={props.appContextState.isFirstLoad} isLoggedIn={isLoggedIn} />
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

export default AppRootView;
