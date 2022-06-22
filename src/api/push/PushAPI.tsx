import { Platform } from 'react-native';
import Auth from '@aws-amplify/auth';
import { Config } from '../../core/constants/Config';
import {
  initializeOneSignalWeb,
  isWebPushNotificationsEnabled,
  isWebPushNotificationsSupported,
  removeWebPushExternalUserId,
  setWebPushExternalUserId,
  setWebPushSubscription
} from './WebPushAPI';

export const isPushNotificationsEnabled = async (): Promise<boolean> => {
  if (Platform.OS === 'web') {
    const enabled: boolean = await isWebPushNotificationsEnabled();
    return enabled;
  } else {
    try {
      const ReactNativeOneSignal = (await import('react-native-onesignal')).default;
      const deviceState = await ReactNativeOneSignal.getDeviceState();
      return !deviceState.isPushDisabled;
    } catch (error) {
      console.error(error);
    }
  }

  return false;
};

export const setExternalUserId = async (): Promise<void> => {
  if (Platform.OS === 'web') {
    await setWebPushExternalUserId();
  } else {
    try {
      const enabled: boolean = await isPushNotificationsEnabled();
      if (enabled) {
        const user = await Auth.currentAuthenticatedUser();
        if (user != undefined && user.attributes.sub !== undefined) {
          const ReactNativeOneSignal = (await import('react-native-onesignal')).default;
          ReactNativeOneSignal.setExternalUserId(user.attributes.sub);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
};

export const removeExternalUserId = async (): Promise<void> => {
  if (Platform.OS === 'web') {
    await removeWebPushExternalUserId();
  } else {
    try {
      const ReactNativeOneSignal = (await import('react-native-onesignal')).default;
      ReactNativeOneSignal.removeExternalUserId();
    } catch (error) {
      console.error(error);
    }
  }
};

// Only call once from App.tsx
export const initializeOneSignal = async (): Promise<void> => {
  if (Platform.OS === 'web') {
    await initializeOneSignalWeb();
  } else {
    try {
      const ReactNativeOneSignal = (await import('react-native-onesignal')).default;
      ReactNativeOneSignal.setLogLevel(6, 0);
      ReactNativeOneSignal.setAppId(Config.ONESIGNAL_APP_ID);
      ReactNativeOneSignal.promptForPushNotificationsWithUserResponse(async (response: boolean) => {
        console.debug("The user's subscription state is now:", response);
        if (response) {
          await setExternalUserId();
        } else {
          await removeExternalUserId();
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
};

export const isPushNotificationsSupported = async (): Promise<boolean> => {
  if (Platform.OS === 'web') {
    const supported: boolean = await isWebPushNotificationsSupported();
    return supported;
  } else {
    try {
      const ReactNativeOneSignal = (await import('react-native-onesignal')).default;
      const deviceState = await ReactNativeOneSignal.getDeviceState();
      if (deviceState.hasNotificationPermission === undefined) {
        return false;
      }
      return deviceState.hasNotificationPermission;
    } catch (error) {
      console.error(error);
    }
  }

  return false;
};

export const setSubscription = async (unmute: boolean): Promise<void> => {
  if (Platform.OS === 'web') {
    await setWebPushSubscription(unmute);
  } else {
    try {
      const ReactNativeOneSignal = (await import('react-native-onesignal')).default;
      ReactNativeOneSignal.disablePush(!unmute);
    } catch (error) {
      console.error(error);
    }
  }
};
