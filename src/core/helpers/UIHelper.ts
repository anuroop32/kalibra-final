import { Appearance, Dimensions, Platform } from 'react-native';
import * as KalibraTheme from '../constants/KalibraTheme';
import { widthPercentageToDP as wp2dp, heightPercentageToDP as hp2dp } from 'react-native-responsive-screen';
import { getStatusBarHeight } from 'react-native-status-bar-height';

// Get Device  Theme based on input or current scheme
const getThemeBasedOnAppearance = (colour?: string): any => {
  // TODO: refactor with type and props
  if (colour === 'system') {
    colour = Appearance.getColorScheme()?.toString();
  }
  return colour === 'light'
    ? { theme: 'light', package: KalibraTheme.KalibraLightTheme }
    : { theme: 'dark', package: KalibraTheme.KalibraDarkTheme };
};

// Get Device Viewport Settings
const getViewPortWidth = (): number => {
  const width: number = Dimensions.get('window').width;
  const cappedWidth: number = Math.max(Math.min(width, 450), 280);
  return cappedWidth;
};

// Calculate the percentage effectively based on design
const getWidthDp = (dimension: number): number => {
  const vwidth = getViewPortWidth();
  return vwidth > 375 && Platform.OS === 'web' ? dimension : wp2dp((dimension / 375) * 100 + '%');
};

// Calculate the percentage effectively based on design
const getHeightDp = (dimension: number): number => {
  return hp2dp((dimension / 812) * 100 + '%');
};

// translate the dark and light color for theme
const getThemeColor = (themeHelper: any, theme: string, lightCode: string, darkCode: string): string => {
  return themeHelper[theme === 'light' ? lightCode : darkCode];
};

// get screen height
const getHeight = (): number => {
  return Dimensions.get('window').height;
};

// get top position of modal
const getTopPos = (): number => {
  return Platform.OS == 'web' ? 20 : getStatusBarHeight();
};

// uiHelper export functions
export const UIHelper = {
  currentTheme: (colour?: string) => {
    return getThemeBasedOnAppearance(colour);
  },
  currentViewPort: () => {
    return getViewPortWidth();
  },
  w2DP: (dimension: number) => {
    return getWidthDp(dimension);
  },
  h2DP: (dimension: number) => {
    return getHeightDp(dimension);
  },
  getHex: (themeHelper: any, theme: string, lightCode: string, dark: string): string => {
    return getThemeColor(themeHelper, theme, lightCode, dark);
  },
  height: (): number => {
    return getHeight();
  },
  topPos: (): number => {
    return getTopPos();
  }
};
