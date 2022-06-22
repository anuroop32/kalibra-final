import * as React from 'react';
import { Appearance, Platform } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { AppContextInitialiser } from '../context/AppContext';
import { AppContextAction, AppContextReducer, AppContextProvider, AppContextState } from '../types/AppContext';
import { KalibraFont } from '../constants/KalibraTheme';
import Auth from '@aws-amplify/auth';
import { getValue } from '../../api/storage';
import { getCurrentUser } from '../../api/auth';
import { initializeOneSignal, setExternalUserId } from '../../api/push';

enum ThemeTo {
  System = 0,
  Light,
  Dark
}

export function useAppInitializer(): AppContextProvider {
  const [isInitComplete, setInitComplete] = React.useState(false);

  // gather key input for reducer
  const appContextReducer = React.useMemo<AppContextReducer>(() => AppContextInitialiser.Reducer(), []);

  //initiate the reducer, had to deconstruct to type to App bootstrap
  const [state, dispatch]: any = React.useReducer(appContextReducer.reducer, appContextReducer.defaultState);
  // initiate the provider actions
  const appContextActions = React.useMemo<AppContextAction>(() => AppContextInitialiser.ContextActions(dispatch), []);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    //   console.log('useEffect Called...');
    const windowResizer = () => {
      appContextActions.setViewPortWidth();
    };
    async function initializeResourcesAsync() {
      let token = undefined;
      try {
        SplashScreen.preventAutoHideAsync();
        // Load and fetch key application parameter
        await Font.loadAsync(KalibraFont);
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        // get theme from local storage
        const themeIndex = await getValue('themeIndex');
        appContextActions.setTheme(
          themeIndex == '' ? ThemeTo[0].toLowerCase() : ThemeTo[Number(themeIndex)].toLowerCase()
        );
        //set the set and change listener
        Appearance.addChangeListener(() => appContextActions.setTheme(ThemeTo[Number(themeIndex)].toLowerCase()));
        // set view port and change listener for web
        appContextActions.setViewPortWidth();
        if (Platform.OS === 'web') {
          window.addEventListener('resize', windowResizer);
        }
        //set global reducer state for appLoaded

        // init oneSignal
        initializeOneSignal();
        // load userToken
        const user = await getCurrentUser();
        if (user != undefined) {
          appContextActions.setUserAttributes(user.attributes);
          const result = await Auth.currentSession();
          token = result.getIdToken().getJwtToken();
          appContextActions.setUserToken(token);
        }
        await setExternalUserId();
        // load isFirstLoad
        const isFirstLoad = await getValue('isFirstLoad');
        appContextActions.setIsFirstLoad(isFirstLoad == '' ? true : isFirstLoad == 'true');
        // load tenantKey
        const tenantKey = await getValue('tenantKey');
        appContextActions.setTenantKey(tenantKey);
        // load Tenants
        const strTenants = await getValue('tenants');
        if (strTenants != '') {
          const tenants = JSON.parse(strTenants);
          appContextActions.setTenants(tenants);
        }
        // load Tenant features
        const strTenantFeatures = await getValue('tenantFeatures');
        if (strTenantFeatures != '') {
          const tenantFeatures = JSON.parse(strTenantFeatures);
          appContextActions.setTenantFeatures(tenantFeatures);
        }

        appContextActions.setIsLoggedIn(token != undefined);
        //hide splash screen
        SplashScreen.hideAsync();
        appContextActions.setAppLoaded(true);

        //ensure hook ran properly by return value
        setInitComplete(true);
      }
    }
    initializeResourcesAsync();
    // clean up on un-mounting
    return () => {
      Appearance.removeChangeListener(() => appContextActions.setTheme());
      if (Platform.OS === 'web') {
        window.removeEventListener('resize', windowResizer);
      }
    };
  }, [appContextActions]);

  return {
    isInitComplete: isInitComplete,
    appContextActions: appContextActions,
    // type of AppContextState which we need to caste back
    state: { ...state } as AppContextState
  };
}
