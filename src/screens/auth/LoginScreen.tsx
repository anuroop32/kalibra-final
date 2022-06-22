import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Layout } from '@ui-kitten/components';
import { AppContext, RootStackScreenProps, UIHelper as uh, TextHelper as Th } from '../../core';
import { authStyles } from './_authStyles';
import { KeyboardAvoidingView } from '../../components/shared';
import { LogIn, WelcomeAuth, TextAuthLink } from '../../components/auth';

const LoginScreen = ({ navigation }: RootStackScreenProps<'Login'>) => {
  // appContext
  const appContext = React.useContext(AppContext);

  // styles
  const styleContainer = StyleSheet.create({
    screenContainer: { flex: 1, paddingTop: uh.h2DP(56) },
    safeAreaView: { flex: 1 },
    viewContainer: {},
    socialLogin: { marginTop: uh.h2DP(44) },
    stdLogin: { paddingTop: uh.h2DP(32) },
    register: { marginTop: uh.h2DP(36) }
  });

  // handlers and conditionals
  const goToRegisterHandler = () => navigation.navigate('Register');
  const signInHandler = () => appContext.signIn(navigation);
  const multiTenantHandler = () => navigation.navigate('ConfirmationTenant');
  const resetPasswordHandler = () => navigation.navigate('ResetPassword');

  // view
  return (
    <KeyboardAvoidingView>
      <Layout level="2" style={[authStyles.authScreenContainer, styleContainer.screenContainer]}>
        <SafeAreaView style={styleContainer.safeAreaView}>
          <WelcomeAuth
            title={Th.getText('WELCOME_AUTH_TITLE')}
            welcomeCaption="To get back to improving your health holistically please log in"
          />
          {/* <SocialLogIn
            type="Log In"
            message="Sign in with"
            style={styleContainer.socialLogin}
            afterSignInUpHandler={signInHandler}
          /> */}
          <LogIn
            type="Log In"
            style={styleContainer.stdLogin}
            signInUpHandler={signInHandler}
            multiTenantHandler={multiTenantHandler}
            resetPasswordHandler={resetPasswordHandler}
          />
          <TextAuthLink
            message="Don’t have a profile? Sign up instead"
            clickHandler={goToRegisterHandler}
            style={styleContainer.register}
          />
        </SafeAreaView>
      </Layout>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
