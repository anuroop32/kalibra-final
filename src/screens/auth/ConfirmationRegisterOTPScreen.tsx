import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Layout } from '@ui-kitten/components';
import { KeyboardAvoidingView } from '../../components/shared';
import { RegisterOTP, WelcomeAuth } from '../../components/auth';
import { authStyles } from './_authStyles';
import { RootStackScreenProps } from 'src/core';

const ConfirmationRegisterOTPScreen = ({ navigation }: RootStackScreenProps<'ConfirmationRegisterOTP'>) => {
  // styles
  const styleContainer = StyleSheet.create({
    screenContainer: { flex: 1 },
    safeAreaView: { flex: 1 }
  });

  // handlers and conditionals
  const resetActionClickHandler = () => navigation.navigate('ConfirmationRegister');

  // view
  return (
    <KeyboardAvoidingView>
      <Layout level="2" style={[authStyles.authScreenContainer, styleContainer.screenContainer]}>
        <SafeAreaView style={styleContainer.safeAreaView}>
          <WelcomeAuth
            title="Great, nearly there! We have verified your email and sent you an OTP code"
            welcomeCaption="Type in the OTP code to join Kalibra"
          />
          <RegisterOTP resetActionClickHandler={resetActionClickHandler} />
        </SafeAreaView>
      </Layout>
    </KeyboardAvoidingView>
  );
};

export default ConfirmationRegisterOTPScreen;
