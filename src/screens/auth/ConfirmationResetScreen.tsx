import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Layout } from '@ui-kitten/components';
import { ConfirmAuth } from '../../components/auth';
import { KeyboardAvoidingView } from '../../components/shared';
import { authStyles } from './_authStyles';
import { RootStackScreenProps } from '../../core';

const ConfirmationResetScreen = ({ navigation }: RootStackScreenProps<'ConfirmationReset'>) => {
  // styles
  const styleContainer = StyleSheet.create({
    screenContainer: { flex: 1 },
    safeAreaView: { flex: 1 }
  });

  //handlers and conditionals
  const btnclickHandler = () => {
    //appContext.signIn(navigation);
    navigation.navigate('Login');
  };

  // view
  return (
    <KeyboardAvoidingView>
      <Layout level="2" style={[authStyles.authScreenContainer, styleContainer.screenContainer]}>
        <SafeAreaView style={styleContainer.safeAreaView}>
          <ConfirmAuth
            title="Thank you for your patience your password reset was successful"
            caption="Welcome back to Kalibra, click the button below to proceed to log in"
            clickHandler={btnclickHandler}
            buttonTitle="Continue"
          />
        </SafeAreaView>
      </Layout>
    </KeyboardAvoidingView>
  );
};

export default ConfirmationResetScreen;
