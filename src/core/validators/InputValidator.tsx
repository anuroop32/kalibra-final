import moment from 'moment';
import { InputValidatorMessages } from '../constants/ErrorMessages';

export const emailValidator = (email: string): string => {
  const validEmail = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) {
    return InputValidatorMessages.emailEmpty;
  }
  if (!validEmail.test(email)) {
    return InputValidatorMessages.emailNotValid;
  }

  return '';
};

export const passwordValidator = (password: string): string => {
  if (!password || password.length <= 0) {
    return InputValidatorMessages.passwordEmpty;
  }
  if (password.length < 8) {
    return InputValidatorMessages.passwordLength;
  }
  // Check Minimum password requirements:
  // - 1 lowercase character
  // - 1 uppercase character
  // - 1 digit (0-9)
  if (!(/[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password))) {
    return InputValidatorMessages.passwordValidity;
  }

  return '';
};

export const stringValidator = (name: string, value: string): string => {
  if (!value || value.length <= 0) {
    return name + InputValidatorMessages.stringEmpty;
  }

  return '';
};

export const genderTypeValidator = (gender: string): string => {
  if (!gender || gender.length <= 0 || (gender !== 'male' && gender !== 'female')) {
    return InputValidatorMessages.genderEmpty;
  }

  return '';
};

export const dateValidator = (format: string, value: string): string => {
  if (!value || value.length <= 0) {
    return InputValidatorMessages.dobEmpty;
  }

  if (!moment(value, format, true).isValid()) {
    return InputValidatorMessages.dobValidity;
  }

  const years = moment().diff(value, 'years', true);
  if (years < 18) {
    return InputValidatorMessages.dobUnderAge;
  }

  return '';
};

export const authCodeValidator = (value: string): string => {
  if (!value || value.length <= 0) {
    return InputValidatorMessages.authCodeEmpty;
  }

  return '';
};

export const nameValidator = (name: string): string => {
  if (!name || name.length <= 0) {
    return InputValidatorMessages.nameIsEmpty;
  }

  return '';
};

export const isNumeric = (value: string): boolean => {
  return value.trim().length > 0 && !isNaN(Number(value));
};
