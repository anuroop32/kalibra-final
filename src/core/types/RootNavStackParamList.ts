import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList extends RootNavStackParamList {}
  }
}

// Screens aligned to Root Tab Navigation
export type RootTabParamList = {
  Home: undefined;
  Kali: undefined;
  Actions: undefined;
  Profile: undefined;
  Me: undefined;
  Assessments: undefined;
  'My Markers': undefined;
};

// Merging Stacks for Root Navigation Stack
export type RootNavStackParamList = {
  PreRegister: undefined;
  Register: undefined;
  Login: undefined;
  ConfirmationTenant: undefined;
  ConfirmationRegister: undefined;
  ResetPassword: undefined;
  ConfirmationReset: undefined;
  PasswordOTP: undefined;
  ConfirmationRegisterOTP: undefined;
  Main: NavigatorScreenParams<RootTabParamList>;
  AssessmentDetail: undefined;
  Settings: undefined;
  Profile: undefined;
  Feedback: undefined;
  ConnectedDevices: undefined;
  AboutUs: undefined;
  //will add modal and not found reference here
};

export type RootStackScreenProps<Screen extends keyof RootNavStackParamList> = NativeStackScreenProps<
  RootNavStackParamList,
  Screen
>;

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = BottomTabScreenProps<RootTabParamList, Screen>;
