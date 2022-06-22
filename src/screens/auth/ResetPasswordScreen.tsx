import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Layout } from '@ui-kitten/components';
import { KeyboardAvoidingView } from '../../components/shared';
import { ResetPassword, WelcomeAuth } from '../../components/auth';
import { authStyles } from './_authStyles';
import { RootStackScreenProps } from '../../core';

const ResetPasswordScreen = ({ navigation }: RootStackScreenProps<'ResetPassword'>) => {
  // styles
  const styleContainer = StyleSheet.create({
    screenContainer: { flex: 1 },
    safeAreaView: { flex: 1 }
  });

  //handlers and conditionals
  const goToResetOTPHandler = () => {
    // replace instead of navigate to be able to go back to home screen
    navigation.replace('PasswordOTP');
  };

  // view
  return (
    <KeyboardAvoidingView>
      <Layout level="2" style={[authStyles.authScreenContainer, styleContainer.screenContainer]}>
        <SafeAreaView style={styleContainer.safeAreaView}>
          <WelcomeAuth
            title="Dont worry, we'll get you back into Kalibra"
            welcomeCaption="For starters, please provide us with your email for verification"
          />
          <ResetPassword otpHandler={goToResetOTPHandler} />
        </SafeAreaView>
      </Layout>
    </KeyboardAvoidingView>
  );
};

export default ResetPasswordScreen;
