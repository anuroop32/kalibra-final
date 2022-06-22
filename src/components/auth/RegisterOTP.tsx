import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { Button, Text, Input, useTheme } from '@ui-kitten/components';
import { AppContext, UIHelper as uh, emailValidator, authCodeValidator, ValidateError } from '../../core';
import { confirmSignUpCode } from '../../api/auth';
import { ErrorMessage } from '../shared';

interface IRegisterOTPProps extends ViewProps {
  resetActionClickHandler: () => void;
}

const RegisterOTP = (props: IRegisterOTPProps) => {
  // App Context
  const appContext = React.useContext(AppContext);

  // styles
  const th = useTheme();
  const ctTheme = appContext.getTheme();
  const condColors = {
    divider: uh.getHex(th, ctTheme, 'color-basic-400', 'color-basic-200'),
    input: uh.getHex(th, ctTheme, 'color-basic-100', 'color-basic-1100')
  };
  const styleContainer = StyleSheet.create({
    resetPassContainer: { marginTop: uh.h2DP(32) },
    input: { backgroundColor: condColors.input },
    inputOneTimeCode: { marginBottom: uh.h2DP(36), marginTop: uh.h2DP(16) }
  });

  // properties
  const [oneTimePass, setOneTimePass] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [error, setError] = React.useState<ValidateError>({ name: '', message: '' });
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const btnClickHandler = async () => {
    const emailError = emailValidator(email);
    if (emailError) {
      setError({ name: 'email', message: emailError });
      return;
    }
    const authCodeError = authCodeValidator(oneTimePass);
    if (authCodeError) {
      setError({ name: 'authCode', message: authCodeError });
      return;
    }
    setIsSubmitted(true);
    // TODO :
    // verify the OTP code then go to ConfirmationRegister screen
    const result = await confirmSignUpCode(email, oneTimePass);
    setIsSubmitted(false);
    if (result?.error) {
      setError({ name: '', message: result?.error?.message });
    } else {
      setError({ name: '', message: '' });
      props.resetActionClickHandler();
    }
  };

  // view
  return (
    <View style={[styleContainer.resetPassContainer, props.style]}>
      <ErrorMessage message={error.message} />
      <Input
        size="large"
        status={error.name == 'email' ? 'danger' : 'basic'}
        style={styleContainer.input}
        label="Email"
        value={email}
        onChangeText={setEmail}
      />

      <Input
        size="large"
        status={error.name == 'authCode' ? 'danger' : 'basic'}
        style={[styleContainer.input, styleContainer.inputOneTimeCode]}
        label="One Time Code"
        value={oneTimePass}
        onChangeText={setOneTimePass}
      />

      <Button size="giant" status="primary" onPress={btnClickHandler} disabled={isSubmitted}>
        <Text status="primary" category="s2">
          Submit
        </Text>
      </Button>
    </View>
  );
};

export default RegisterOTP;
