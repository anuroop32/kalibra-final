import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { createStackNavigator, StackNavigationOptions, CardStyleInterpolators } from '@react-navigation/stack';
import RootTabNavigation from './RootTabNavigation';
import { Icon, Text, useTheme } from '@ui-kitten/components';
import * as AuthScreen from '../../screens/auth';
import { AppContext, RootNavStackParamList, UIHelper as uh } from '../../core';
import * as SettingScreens from '../../screens/settings';
import * as MainScreens from '../../screens/main';
import { useNavigation } from '@react-navigation/native';

//props
interface RootStackNavigationProps {
  isFirstLoad: boolean;
  isLoggedIn: boolean;
}

const RootStackNavigation = (props: RootStackNavigationProps) => {
  // context
  const Stack = createStackNavigator<RootNavStackParamList>();
  const navigation = useNavigation();

  // styles
  const th = useTheme();
  const theme = React.useContext(AppContext).getTheme();
  const condColors = {
    header: uh.getHex(th, theme, 'color-basic-100', 'color-basic-1100'),
    headerLeftTint: uh.getHex(th, theme, 'color-basic-900', 'color-basic-100'),
    iconTint: th['color-primary-500']
  };
  const styleContainer = StyleSheet.create({
    backNavContainer: { flexDirection: 'row' },
    backIcon: { width: 24, height: 24 },
    backScreenName: { paddingTop: 2 }
  });

  // properties
  const headerLeftBase = (title: string) => (
    <TouchableOpacity
      style={styleContainer.backNavContainer}
      onPress={() => {
        if (navigation.canGoBack() == false) {
          navigation.navigate('Main');
        } else {
          navigation.goBack();
        }
      }}
    >
      <Icon name="arrow-ios-back-outline" fill={condColors.iconTint} style={styleContainer.backIcon} />
      <Text status="primary" category="s2" style={styleContainer.backScreenName}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const headerScreenOptions = (
    title: string,
    showHeader: boolean,
    headerLeftTitle?: string
  ): StackNavigationOptions => {
    const baseScreenOptions: StackNavigationOptions = {
      headerShown: showHeader,
      headerTitle: () => (
        <Text status="basic" category="s1">
          {title}
        </Text>
      ),
      headerLeft: headerLeftTitle ? () => headerLeftBase(headerLeftTitle) : () => null,
      headerTintColor: condColors.headerLeftTint,
      headerStyle: {
        backgroundColor: condColors.header
      },
      headerTitleAlign: 'center',
      // animation: 'slide_from_right'
      animationEnabled: false,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
    };
    return baseScreenOptions;
  };

  // view
  return (
    // Re-aligned navigators as "initialRouteName" on Stack.Navigator fails to switch context of view stack on signOut
    // Note:If more complex flows are added will need refactor out and load stacks
    <Stack.Navigator>
      {!props.isLoggedIn ? (
        <>
          {/* first load scenario before use signs up*/}
          {props.isFirstLoad && (
            <Stack.Screen
              name="PreRegister"
              options={{
                ...headerScreenOptions('PreRegister', false)
              }}
              component={AuthScreen.PreRegisterScreen}
            />
          )}
          {/* login will be default screen outside first load condition*/}
          <Stack.Screen
            name="Login"
            options={{
              ...headerScreenOptions('Login', true)
            }}
            component={AuthScreen.LoginScreen}
          />
          <Stack.Screen
            name="ConfirmationTenant"
            options={{
              ...headerScreenOptions('Select Profile', true)
            }}
            component={AuthScreen.ConfirmationTenantScreen}
          />
          <Stack.Screen
            name="Register"
            options={{
              ...headerScreenOptions('Register', false)
            }}
            component={AuthScreen.RegisterScreen}
          />
          <Stack.Screen
            name="ConfirmationRegisterOTP"
            options={{ ...headerScreenOptions('One Time Code', true, 'Register') }}
            component={AuthScreen.ConfirmationRegisterOTPScreen}
          />
          <Stack.Screen
            name="ConfirmationRegister"
            options={{ ...headerScreenOptions('Sign Up', true) }}
            component={AuthScreen.ConfirmationRegisterScreen}
          />
          <Stack.Screen
            name="ResetPassword"
            options={{
              ...headerScreenOptions('Reset Password', true, 'Login')
            }}
            component={AuthScreen.ResetPasswordScreen}
          />
          <Stack.Screen
            name="PasswordOTP"
            options={{ ...headerScreenOptions('One Time Code', true, 'Login') }}
            component={AuthScreen.ResetPasswordOTPScreen}
          />
          <Stack.Screen
            name="ConfirmationReset"
            options={{ ...headerScreenOptions('Reset Password', true) }}
            component={AuthScreen.ConfirmationResetScreen}
          />
        </>
      ) : (
        // logged in stack with tabs and settings
        <>
          <Stack.Screen name="Main" options={{ ...headerScreenOptions('Main', false) }} component={RootTabNavigation} />
          <Stack.Screen
            name="AssessmentDetail"
            options={{
              ...headerScreenOptions('Assessment details', true, 'Back')
            }}
            component={MainScreens.AssessmentDetailScreen}
          />
          <Stack.Screen
            name="Settings"
            options={{
              ...headerScreenOptions('Settings', true, 'Back')
            }}
            component={SettingScreens.SettingsScreen}
          />
          <Stack.Screen
            name="Profile"
            options={{ ...headerScreenOptions('Profile', true, 'Settings') }}
            component={SettingScreens.ProfileScreen}
          />
          <Stack.Screen
            name="Feedback"
            options={{ ...headerScreenOptions('Feedback', true, 'Settings') }}
            component={SettingScreens.FeedbackScreen}
          />
          <Stack.Screen
            name="ConnectedDevices"
            options={{ ...headerScreenOptions('Connected Devices', true, 'Settings') }}
            component={SettingScreens.ConnectedDevicesScreen}
          />
          <Stack.Screen
            name="AboutUs"
            options={{ ...headerScreenOptions('About Us', true, 'Settings') }}
            component={SettingScreens.AboutScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootStackNavigation;
