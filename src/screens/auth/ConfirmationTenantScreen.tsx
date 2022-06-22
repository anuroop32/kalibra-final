import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Layout } from '@ui-kitten/components';
import { KeyboardAvoidingView } from '../../components/shared';
import { authStyles } from './_authStyles';
import { AppContext, RootStackScreenProps } from '../../core';
import { SelectTenant } from '../../components/auth';

const ConfirmationTenantScreen = ({ navigation }: RootStackScreenProps<'ConfirmationTenant'>) => {
  // Context
  const appContext = React.useContext(AppContext);

  // styles
  const styleContainer = StyleSheet.create({
    screenContainer: { flex: 1 },
    safeAreaView: { flex: 1 }
  });

  //handlers and conditionals
  const btnclickHandler = async () => {
    appContext.signIn(navigation);
  };

  //view
  return (
    <KeyboardAvoidingView>
      <Layout level="2" style={[authStyles.authScreenContainer, styleContainer.screenContainer]}>
        <SafeAreaView style={styleContainer.safeAreaView}>
          <SelectTenant
            title="Hello, you seem have access to multiple providers our platform"
            caption="To continue, please select the provider you would want to proceed to sign in with"
            clickHandler={btnclickHandler}
            tenantCollection={appContext.getTenants()}
          />
        </SafeAreaView>
      </Layout>
    </KeyboardAvoidingView>
  );
};

export default ConfirmationTenantScreen;
