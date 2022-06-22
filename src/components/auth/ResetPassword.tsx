import { Button, Input, useTheme } from '@ui-kitten/components';
import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { AppContext, UIHelper as uh, emailValidator, ValidateError } from '../../core';
import { requestPasswordReset } from '../../api/auth';
import { ErrorMessage } from '../shared';

// props
interface IResetPasswordProps extends ViewProps {
  otpHandler: () => void;
}

const ResetPassword = (props: IResetPasswordProps) => {
  // App Context
  const appContext = React.useContext(AppContext);

  // styles
  const th = useTheme();
  const ctTheme = appContext.getTheme();
  const condColors = {
    input: uh.getHex(th, ctTheme, 'color-basic-100', 'color-basic-1100')
  };

  const styleContainer = StyleSheet.create({
    resetPassContainer: { marginTop: uh.h2DP(32) },
    input: { backgroundColor: condColors.input },
    inputEmail: { marginVertical: 16 }
  });

  // properties
  const [email, setEmail] = React.useState<string>('');
  const [error, setError] = React.useState<ValidateError>({ name: '', message: '' });
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  // handlers and conditionals
  const btnClickHandler = async () => {
    //validate and verify email then call the success redirect function
    const emailError = emailValidator(email);
    if (emailError) {
      setError({ name: 'email', message: emailError });
      return;
    }

    setIsSubmitted(true);
    const result = await requestPasswordReset(email);
    setIsSubmitted(false);
    if (result?.error) {
      setError({ name: '', message: result?.error?.message });
    } else {
      setError({ name: '', message: '' });
      props.otpHandler();
    }
  };

  // view
  return (
    <View style={[styleContainer.resetPassContainer, props.style]}>
      <ErrorMessage message={error.message} />
      <Input
        size="large"
        style={[styleContainer.input, styleContainer.inputEmail]}
        label="Email"
        value={email}
        onChangeText={setEmail}
      />
      <Button size="giant" status="primary" onPress={btnClickHandler} disabled={isSubmitted}>
        Send
      </Button>
    </View>
  );
};

export default ResetPassword;
