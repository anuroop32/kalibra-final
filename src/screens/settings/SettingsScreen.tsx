import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Layout } from '@ui-kitten/components';
import { settingStyles } from './_settingStyles';
import { SettingMenu } from '../../components/settings';
import { RootStackScreenProps, AppContext } from '../../core';

const SettingsScreen = ({ navigation }: RootStackScreenProps<'Settings'>) => {
  // context
  const appContext = React.useContext(AppContext);

  //styles
  const styleContainer = StyleSheet.create({
    screenContainer: { flex: 1 },
    safeAreaView: { flex: 1 }
  });

  //properties and handler
  const signOutHandler = () => appContext.signOut();
  const profileHandler = () => navigation.navigate('Profile');
  const feedbackHandler = () => navigation.navigate('Feedback');
  const connectedDeviceskHandler = () => navigation.navigate('ConnectedDevices');
  const aboutUsHandler = () => navigation.navigate('AboutUs');

  //view
  return (
    <Layout level="2" style={[styleContainer.screenContainer, settingStyles.settingScreenContainer]}>
      <SafeAreaView style={styleContainer.screenContainer}>
        <SettingMenu
          signOutHandler={signOutHandler}
          profileHandler={profileHandler}
          feedbackHandler={feedbackHandler}
          connectedDeviceskHandler={connectedDeviceskHandler}
          aboutUsHandler={aboutUsHandler}
        />
      </SafeAreaView>
    </Layout>
  );
};

export default SettingsScreen;
