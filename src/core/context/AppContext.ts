import React from 'react';
import { UIHelper } from '../helpers/UIHelper';
import { AppContextAction, AppContextReducer, AppContextState } from '../types/AppContext';
import { TenantFeature, TenantTuple } from '../types/AuthTypes';
import { setValue } from '../../api/storage';
import { logoutUser } from '../../api/auth';
import { removeExternalUserId } from '../../api/push';
import { Analytics } from 'src/api/analytics';
import { UserAttributes } from '../types/UserAttributes';
import { AgendaItem } from '../types/AgendaItem';
import { HealthMarker } from '../types/Bloodwork';

// Core location for all ContextProvider Methods
const getAppContextActions = (dispatch: any): AppContextAction => {
  // simple workaround keep global properties on context
  let themeTitle = '';
  let isMultiUserRole = false;
  let tenantKey: string;
  let tenants: Array<TenantTuple>;
  let tenantFeatures: Array<TenantFeature>;
  let userAttributes: UserAttributes;
  let actionItems: Array<AgendaItem>;
  let RefreshActionItemsFlag: boolean;
  let healthMarkers: Array<HealthMarker> = [];

  return {
    setTheme: (color?: string) => {
      // can add any other logic here
      const currentTheme = UIHelper.currentTheme(color);
      //extensionState.setThemeTitle(currentTheme.theme);
      themeTitle = currentTheme.theme;
      dispatch({
        type: 'APPLY_THEME',
        value: currentTheme.package
      });
    },
    getTheme: () => {
      return themeTitle;
    },
    setAppLoaded: (appLoaded: boolean) => {
      // can add any other logic here
      dispatch({
        type: 'APP_LOADED',
        value: appLoaded
      });
    },
    setViewPortWidth: () => {
      // can add any other logic here
      dispatch({
        type: 'SET_VIEWPORT',
        value: UIHelper.currentViewPort()
      });
    },
    getIsMultipleUser: () => {
      return isMultiUserRole;
    },
    setUserToken: (authToken: string) => {
      dispatch({
        type: 'SET_USER_TOKEN',
        value: authToken
      });
    },
    setUserAttributes: (userData: UserAttributes) => {
      userAttributes = userData;
    },
    getUserAttrubutes: () => {
      return userAttributes;
    },
    getTenantKey: () => {
      return tenantKey;
    },
    setTenantKey: async (key: string) => {
      tenantKey = key;
      setValue('tenantKey', tenantKey);
    },
    getTenants: () => {
      return tenants;
    },
    setTenants: async (_tenants: Array<TenantTuple>) => {
      tenants = _tenants;
      await setValue('tenants', JSON.stringify(tenants));
      isMultiUserRole = tenants.length > 0 ? true : false;
    },
    getActionItems: () => {
      return actionItems;
    },
    setActionItems: async (_actionItems: Array<AgendaItem>) => {
      actionItems = _actionItems;
    },
    getTenantFeatures: () => {
      return tenantFeatures;
    },
    setRefreshActionItemsFlag: (refresh: boolean) => {
      RefreshActionItemsFlag = refresh;
    },
    getRefreshActionItemsFlag: () => {
      return RefreshActionItemsFlag;
    },
    setTenantFeatures: async (_tenantFeatures: Array<TenantFeature>) => {
      tenantFeatures = _tenantFeatures;
      await setValue('tenantFeatures', JSON.stringify(tenantFeatures));
    },
    getHealthMarkers: () => {
      return healthMarkers;
    },
    setHealthMarkers: async (_healthMarkers: Array<HealthMarker>) => {
      healthMarkers = _healthMarkers;
    },
    signIn: (navigation) => {
      Analytics.logEvent('SignUp');
      dispatch({
        type: 'SIGN_IN',
        value: true
      });
      if (navigation.canGoBack()) {
        navigation.popToTop();
      }
    },
    signOut: async () => {
      //can add other logic here
      await logoutUser();
      await removeExternalUserId();
      await setValue('isFirstLoad', 'true');
      try {
        Analytics.setUserId(null);
      } catch (analyticsError) {
        console.error(analyticsError);
      }
      dispatch({
        type: 'SIGN_OUT'
      });
    },
    setIsFirstLoad: async (isFirstLoad: boolean) => {
      //can add other logic here
      await setValue('isFirstLoad', isFirstLoad ? 'true' : 'false');
      dispatch({
        type: 'SET_IS_FIRST_LOAD',
        value: isFirstLoad
      });
    },
    setIsLoggedIn: (isLoggedIn: boolean) => {
      //can add other logic here
      dispatch({
        type: 'SET_IS_LOGGEDIN',
        value: isLoggedIn
      });
    },
    // To-do: add SignUp,Analytics and Global error handling
    logEvent: (name: string, eventProperties?: Record<string, unknown>) => {
      try {
        Analytics.logEvent(name, eventProperties);
      } catch (analyticsError) {
        console.error(analyticsError);
      }
    },
    setAnalyticUserId: (userId: string | null) => {
      try {
        Analytics.setUserId(userId);
      } catch (analyticsError) {
        console.error(analyticsError);
      }
    }
  };
};

// Reducer responding
const getAppContextReducer = (): AppContextReducer => {
  // initial arguments
  const initialArg: AppContextState = {
    assetsHaveLoaded: false,
    kalibraTheme: {},
    viewPortWidth: 450,
    isFirstLoad: true,
    userToken: '',
    isLoggedIn: false
  };

  // app context reducer
  const reducer = (prevState: any, action: any) => {
    switch (action.type) {
      case 'APP_LOADED':
        return {
          ...prevState,
          assetsHaveLoaded: action.value
        };
      case 'APPLY_THEME':
        return {
          ...prevState,
          kalibraTheme: action.value
        };
      case 'SET_VIEWPORT':
        return {
          ...prevState,
          viewPortWidth: action.value
        };
      case 'SET_USER_TOKEN':
        return {
          ...prevState,
          userToken: action.value
        };
      case 'SET_TENANT':
        return {
          ...prevState,
          userToken: action.value
        };
      case 'SET_IS_FIRST_LOAD':
        return {
          ...prevState,
          isFirstLoad: action.value
        };
      case 'SET_IS_LOGGEDIN':
        return {
          ...prevState,
          isLoggedIn: action.value
        };
      case 'SIGN_IN':
        return {
          ...prevState,
          isLoggedIn: action.value
        };
      case 'SIGN_OUT':
        return {
          ...prevState,
          userToken: '',
          isFirstLoad: false,
          isLoggedIn: false
        };
      // To-do: add Analytics and Global error handling
    }
  };
  return {
    reducer: reducer,
    defaultState: initialArg
  };
};

// export default for compiler and eslint integrity
export const AppContext = React.createContext<AppContextAction>({} as AppContextAction);

export const AppContextInitialiser = {
  Reducer: () => {
    return getAppContextReducer();
  },
  ContextActions: (dispatch: any) => {
    return getAppContextActions(dispatch);
  }
};
