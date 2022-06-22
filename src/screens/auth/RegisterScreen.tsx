import React from 'react';
import { Linking, Platform, SafeAreaView, StyleSheet } from 'react-native';
import { RootStackScreenProps, UIHelper as uh } from '../../core';
import { Layout } from '@ui-kitten/components';
import { LogIn, TextAuthLink } from '../../components/auth';
import { authStyles } from './_authStyles';
import { KaliQuote } from '../../components/kalichat';
import { KeyboardAvoidingView } from '../../components/shared';

const RegisterScreen = ({ navigation }: RootStackScreenProps<'Register'>) => {
  // styles
  const styleContainer = StyleSheet.create({
    screenContainer: { flex: 1 },
    safeAreaView: { flex: 1 },
    scroll: { maxHeight: uh.height() },
    kaliQuote: { marginTop: uh.h2DP(28) },
    socialLogin: { marginTop: uh.h2DP(40) },
    stdLogin: { paddingTop: uh.h2DP(32) },
    textAuthLink: { marginTop: uh.h2DP(36) },
    oneTimeConfirmation: { marginTop: uh.h2DP(10) }
  });

  // handlers and conditionals
  const goToSignInHandler = () => navigation.navigate('Login');
  const confirmRegisterHandler = () => navigation.navigate('ConfirmationRegisterOTP');

  const goToPage = (url: string) => {
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url);
    }
  };

  // view
  return (
    <KeyboardAvoidingView style={styleContainer.scroll}>
      <Layout level="2" style={[styleContainer.screenContainer, authStyles.authScreenContainer]}>
        <SafeAreaView style={styleContainer.safeAreaView}>
          <KaliQuote
            style={styleContainer.kaliQuote}
            heading="Let’s improve your health together."
            caption="Sign up to create your account 
          and get started."
          />
          {/* <SocialLogIn
            type="Sign Up"
            message="Sign up with"
            style={styleContainer.socialLogin}
            afterSignInUpHandler={confirmRegisterHandler}
          /> */}
          <LogIn
            type="Sign Up"
            style={styleContainer.stdLogin}
            confirmRegisterHandler={confirmRegisterHandler}
            goToPage={goToPage}
          />
          <TextAuthLink
            message="Already have a profile? Log in instead."
            clickHandler={goToSignInHandler}
            style={styleContainer.textAuthLink}
          />
          <TextAuthLink
            message="Have a one-time confirmation code to enter?"
            clickHandler={confirmRegisterHandler}
            style={styleContainer.oneTimeConfirmation}
          />
        </SafeAreaView>
      </Layout>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
