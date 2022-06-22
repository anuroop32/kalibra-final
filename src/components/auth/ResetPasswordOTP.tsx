import React from 'react';
import { View, TouchableWithoutFeedback, Platform, StyleSheet, ViewProps } from 'react-native';
import { Button, Text, Input, Icon, useTheme } from '@ui-kitten/components';
import {
  AppContext,
  UIHelper as uh,
  emailValidator,
  passwordValidator,
  authCodeValidator,
  ValidateError
} from '../../core';
import { confirmPasswordReset } from '../../api/auth';
import { ErrorMessage } from '../shared';

interface IResetPasswordProps extends ViewProps {
  resetActionClickHandler: () => void;
}

const ResetPasswordOTP = (props: IResetPasswordProps) => {
  // App Context
  const appContext = React.useContext(AppContext);
  // const navigation: any = useNavigation();

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
    inputPassword: { marginVertical: 16 },
    inputOneTimeCode: { marginBottom: 16 }
  });

  // properties
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const [oneTimePass, setOneTimePass] = React.useState<string>('');
  const [error, setError] = React.useState<ValidateError>({ name: '', message: '' });
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  // handlers and conditionals
  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };
  const renderIcon = (iconProps: any) => {
    // This is workaround due to "OnPress" translation issue for react native web
    return Platform.OS === 'web' ? (
      <div onClick={toggleSecureEntry}>
        <Icon {...iconProps} name={secureTextEntry ? 'eye-off' : 'eye'} />
      </div>
    ) : (
      <TouchableWithoutFeedback onPress={toggleSecureEntry}>
        <Icon {...iconProps} name={secureTextEntry ? 'eye-off' : 'eye'} />
      </TouchableWithoutFeedback>
    );
  };
  const btnClickHandler = async () => {
    //validate and verify email/password and authCode then call confirmPasswordReset function
    const emailError = emailValidator(email);
    if (emailError) {
      setError({ name: 'email', message: emailError });
      return;
    }
    const passwordError = passwordValidator(password);
    if (passwordError) {
      setError({ name: 'password', message: passwordError });
      return;
    }
    const authCodeError = authCodeValidator(oneTimePass);
    if (authCodeError) {
      setError({ name: 'authCode', message: authCodeError });
      return;
    }

    setIsSubmitted(true);
    const result = await confirmPasswordReset(email, oneTimePass, password);
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
      <Input size="large" style={styleContainer.input} label="Email" value={email} onChangeText={setEmail} />
      <Input
        style={[styleContainer.input, styleContainer.inputPassword]}
        size="large"
        label="Password"
        value={password}
        secureTextEntry={secureTextEntry}
        accessoryRight={renderIcon}
        onChangeText={(nextValue: string) => setPassword(nextValue)}
      />

      <Input
        size="large"
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

export default ResetPasswordOTP;
