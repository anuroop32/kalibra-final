import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AgendaItem } from './AgendaItem';
import { TenantFeature, TenantTuple } from './AuthTypes';
import { HealthMarker } from './Bloodwork';
import { RootNavStackParamList } from './RootNavStackParamList';
import { UserAttributes } from './UserAttributes';

//AppContent State Type
export type AppContextState = {
  assetsHaveLoaded: boolean;
  kalibraTheme: any;
  viewPortWidth: number;
  isFirstLoad: boolean;
  userToken: string;
  isLoggedIn: boolean;
};

// AppContext Initializer Type
export type AppContextAction = {
  setTheme: (color?: string) => void;
  setAppLoaded: (appLoaded: boolean) => void;
  setViewPortWidth: () => void;
  getTheme: () => string;
  getIsMultipleUser: () => boolean;
  setUserToken: (authToken: string) => void;
  setUserAttributes: (userData: UserAttributes) => void;
  getUserAttrubutes: () => UserAttributes;
  setIsFirstLoad: (isFirstLoad: boolean) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  getTenantKey: () => string;
  getTenants: () => Array<TenantTuple>;
  setTenantKey: (key: string) => void;
  setTenants: (_tenants: Array<TenantTuple>) => void;
  getActionItems: () => Array<AgendaItem>;
  setActionItems: (_actionItems: Array<AgendaItem>) => void;
  getRefreshActionItemsFlag: () => boolean;
  setRefreshActionItemsFlag: (refresh: boolean) => void;
  getHealthMarkers: () => Array<HealthMarker>;
  setHealthMarkers: (_healthMarkers: Array<HealthMarker>) => void;
  setTenantFeatures: (_tenantFeatures: Array<TenantFeature>) => void;
  getTenantFeatures: () => Array<TenantFeature>;
  signIn: (
    navigation:
      | NativeStackNavigationProp<RootNavStackParamList, 'Login'>
      | NativeStackNavigationProp<RootNavStackParamList, 'ConfirmationTenant'>
  ) => void;
  signOut: () => void;
  logEvent: (name: string, eventProperties?: Record<string, unknown>) => void;
  setAnalyticUserId: (userId: string | null) => void;
};

// AppContext Reducer Type
export type AppContextReducer = {
  reducer: any;
  defaultState: AppContextState;
};

// AppContext Provider Type
export type AppContextProvider = {
  isInitComplete: boolean;
  appContextActions: AppContextAction;
  state: AppContextState;
};
