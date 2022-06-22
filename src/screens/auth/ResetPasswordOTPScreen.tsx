import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Layout } from '@ui-kitten/components';
import { KeyboardAvoidingView } from '../../components/shared';
import { ResetPasswordOTP, WelcomeAuth } from '../../components/auth';
import { authStyles } from './_authStyles';
import { RootStackScreenProps } from 'src/core';

const welcomeTitle = 'Great, nearly there! We have verified your email and sent you an OTP code';
const welcomeCaption = 'Type in the OTP code and your new password to get back into Kalibra';

const ResetPasswordOTPScreen = ({ navigation }: RootStackScreenProps<'PasswordOTP'>) => {
  // styles
  const styleContainer = StyleSheet.create({
    screenContainer: { flex: 1 },
    safeAreaView: { flex: 1 }
  });

  // handlers and conditionals
  const resetActionClickHandler = () => navigation.navigate('ConfirmationReset');

  // view
  return (
    <KeyboardAvoidingView>
      <Layout level="2" style={[authStyles.authScreenContainer, styleContainer.screenContainer]}>
        <SafeAreaView style={styleContainer.safeAreaView}>
          <WelcomeAuth title={welcomeTitle} welcomeCaption={welcomeCaption} />
          <ResetPasswordOTP resetActionClickHandler={resetActionClickHandler} />
        </SafeAreaView>
      </Layout>
    </KeyboardAvoidingView>
  );
};

export default ResetPasswordOTPScreen;
