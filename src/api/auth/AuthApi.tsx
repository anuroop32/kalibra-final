import Auth, { CognitoUser } from '@aws-amplify/auth';
import { AuthError, UserAttributes } from '../../core';
import { removeExternalUserId } from '../push/PushAPI';

// Override default messages returned from Cognito service
const errorMessageMap = new Map<string, string>();
errorMessageMap.set('Username cannot be empty', 'Email cannot be empty.');
errorMessageMap.set('Custom auth lambda trigger is not configured for the user pool.', 'Password cannot be empty.');

const getErrorMessage = (message: string): string => {
  if (errorMessageMap.has(message)) {
    const errorMessage = errorMessageMap.get(message);
    if (errorMessage !== undefined) {
      return errorMessage;
    }
  }
  return message;
};

const convertError = (error: any): AuthError => {
  console.debug(error.message);
  return {
    error: {
      code: error.code,
      message: getErrorMessage(error.message)
    }
  };
};

export const getCurrentUser = async (): Promise<CognitoUser | any | undefined> => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    return user;
  } catch (error) {
    return undefined;
  }
};

export const getUserId = async (): Promise<string | undefined> => {
  const user = await getCurrentUser();
  if (user === undefined) {
    return undefined;
  }
  return user.attributes.sub;
};

export const logoutUser = async (): Promise<void> => {
  try {
    await Auth.signOut();
  } catch (error) {
    console.error(error);
  }
};

export const registerUser = async (
  email: string,
  password: string,
  fullname: string,
  nickname: string,
  gender: string,
  birthdate: string
): Promise<AuthError | any> => {
  try {
    await Auth.signUp({
      username: email,
      password: password,
      attributes: {
        email: email,
        name: fullname,
        nickname: nickname,
        gender: gender,
        birthdate: birthdate
      }
    });
    return {};
  } catch (error) {
    return convertError(error);
  }
};

export const loginUser = async (email: string, password: string): Promise<CognitoUser | AuthError | any> => {
  try {
    const user = await Auth.signIn(email, password);
    return user;
  } catch (error) {
    return convertError(error);
  }
};

export const confirmSignUpCode = async (email: string, code: string): Promise<AuthError | any> => {
  try {
    await Auth.confirmSignUp(email, code);
    return {};
  } catch (error) {
    return convertError(error);
  }
};

export const requestPasswordReset = async (email: string): Promise<AuthError | any> => {
  try {
    await Auth.forgotPassword(email);
    return {};
  } catch (error) {
    return convertError(error);
  }
};

export const confirmPasswordReset = async (
  email: string,
  code: string,
  newPassword: string
): Promise<AuthError | any> => {
  try {
    await Auth.forgotPasswordSubmit(email, code, newPassword);
    return {};
  } catch (error) {
    return convertError(error);
  }
};

export const completeNewPassword = async (
  user: CognitoUser,
  newPassword: string,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  requiredAttributes: any = {}
): Promise<AuthError | any> => {
  try {
    await Auth.completeNewPassword(user, newPassword, requiredAttributes);
    return {};
  } catch (error) {
    return convertError(error);
  }
};

export const updateUser = async (attributes: UserAttributes): Promise<AuthError | any> => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    await Auth.updateUserAttributes(user, attributes);
    return {};
  } catch (error) {
    return convertError(error);
  }
};

export const deleteUserAccount = async (): Promise<void> => {
  try {
    const user: CognitoUser = await getCurrentUser();
    if (user === undefined) {
      // User not logged in
      return;
    }

    // Deregister Push Notifications
    await removeExternalUserId();

    user.deleteUser((error) => {
      if (error) {
        console.error(error);
      } else {
        // Log user out from all devices
        Auth.signOut({ global: true });
      }
    });
  } catch (error) {
    console.error(error);
  }
};
