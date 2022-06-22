import React from 'react';
import { SafeAreaView, StyleSheet, Platform } from 'react-native';
import { AppContext, RootStackScreenProps, UIHelper as uh } from '../../core';
import { Layout } from '@ui-kitten/components';
import { KeyboardAvoidingView } from '../../components/shared';
import { PreSignUp, PreSignUpAlt, TextAuthLink } from '../../components/auth';
import { authStyles } from './_authStyles';

const PreRegisterScreen = ({ navigation }: RootStackScreenProps<'PreRegister'>) => {
  // App Context
  const appContext = React.useContext(AppContext);

  // styles
  const styleContainer = StyleSheet.create({
    screenContainer: { flex: 1 },
    safeAreaView: { flex: 1 }
  });

  // handlers and conditionals
  const goToRegisterHandler = () => {
    appContext.setIsFirstLoad(false);
    navigation.navigate('Register');
    // console.log('move');
    // to-do: store API
  };

  // view
  return (
    <KeyboardAvoidingView>
      <Layout level="2" style={[styleContainer.screenContainer, authStyles.authScreenContainer]}>
        <SafeAreaView style={styleContainer.screenContainer}>
          {Platform.OS === 'web' ? (
            <PreSignUpAlt finalActionHandler={goToRegisterHandler} />
          ) : (
            <PreSignUp finalActionHandler={goToRegisterHandler} />
          )}
          <TextAuthLink message="Skip" clickHandler={goToRegisterHandler} style={{ marginTop: uh.h2DP(28) }} />
        </SafeAreaView>
      </Layout>
    </KeyboardAvoidingView>
  );
};

export default PreRegisterScreen;
