import { default as LightTheme } from '../../../assets/themes/kalibra-light-theme.json';
import { default as DarkTheme } from '../../../assets/themes/kalibra-dark-theme.json';
import * as eva from '@eva-design/eva';
import { FontSource } from 'expo-font';
import { ThemeType } from '@ui-kitten/components';

export const KalibraDesign = { ...eva };
export const KalibraLightTheme: ThemeType = { ...eva.light, ...LightTheme };
export const KalibraDarkTheme: ThemeType = { ...eva.dark, ...DarkTheme };

//Only using the font as defined by the design, any fonts need to be add can be put here.
export const KalibraFont: Record<string, FontSource> = {
  Poppins: require('../../../assets/fonts/Poppins-Regular.ttf'),
  'Poppins-SemiBold': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
  'Poppins-Regular': require('../../../assets/fonts/Poppins-Regular.ttf'),
  'Poppins-Medium': require('../../../assets/fonts/Poppins-Medium.ttf')
};
