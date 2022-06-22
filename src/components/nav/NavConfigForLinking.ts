import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { RootNavStackParamList } from '../../core';

export const NavigationLinkingForWeb: LinkingOptions<RootNavStackParamList> = {
  prefixes: [Linking.createURL('/'), 'kalibraFE://'],
  config: {
    screens: {
      PreRegister: { path: 'PreRegister' },
      Register: { path: 'Register' },
      ConfirmationRegister: { path: 'Confirmation Register' },
      Login: { path: 'Login' },
      ConfirmationTenant: { path: 'Confirmation Tenant' },
      ResetPassword: { path: 'Reset Password' },
      PasswordOTP: { path: 'Reset Password One Time Code' },
      ConfirmationRegisterOTP: { path: 'Register One Time Code' },
      ConfirmationReset: { path: 'Confirmation Reset' },
      Main: {
        path: '',
        screens: {
          Home: { path: 'Home' },
          Kali: { path: 'Kali' },
          Actions: { path: 'Actions' },
          Me: { path: 'Me' },
          Assessments: { path: 'Assessments' },
          Profile: { path: 'Markers' }
        }
      },
      AssessmentDetail: {
        path: 'AssessmentDetail/:assessmentId'
      },
      Settings: { path: 'Settings' },
      Profile: { path: 'Profile' },
      Feedback: { path: 'Feedback' },
      ConnectedDevices: { path: 'ConnectedDevices' },
      AboutUs: { path: 'About Us' }
    }
  }
};
