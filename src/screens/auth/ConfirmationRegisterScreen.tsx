import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Layout, useTheme } from '@ui-kitten/components';
import { ConfirmAuth } from '../../components/auth';
import { KeyboardAvoidingView } from '../../components/shared';
import { authStyles } from './_authStyles';
import { AppContext, RootStackScreenProps, UIHelper as uh } from '../../core';

const ConfirmationRegisterScreen = ({ navigation }: RootStackScreenProps<'ConfirmationRegister'>) => {
  // Context
  const th = useTheme();
  const appContext = React.useContext(AppContext);
  const ctTheme = appContext.getTheme();
  const condColors = {
    divider: uh.getHex(th, ctTheme, 'color-basic-400', 'color-basic-200'),
    input: uh.getHex(th, ctTheme, 'color-basic-100', 'color-basic-1100')
  };

  // styles
  const styleContainer = StyleSheet.create({
    screenContainer: { flex: 1 },
    safeAreaView: { flex: 1 },
    input: { backgroundColor: condColors.input }
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
            title="Thank you for your patience, your registration was successful"
            caption="Welcome to Kalibra, click the button below to proceed to log in"
            clickHandler={btnclickHandler}
            buttonTitle="Continue"
          />
        </SafeAreaView>
      </Layout>
    </KeyboardAvoidingView>
  );
};

export default ConfirmationRegisterScreen;
