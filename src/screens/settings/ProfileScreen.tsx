import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Layout } from '@ui-kitten/components';
import { settingStyles } from './_settingStyles';
import { Profile } from '../../components/settings';

const SettingsScreen = () => {
  //styles
  const styleContainer = StyleSheet.create({
    screenContainer: { flex: 1 },
    safeAreaView: { flex: 1 }
  });

  //view
  return (
    <Layout level="2" style={[styleContainer.screenContainer, settingStyles.settingScreenContainer]}>
      <SafeAreaView style={styleContainer.screenContainer}>
        <Profile />
      </SafeAreaView>
    </Layout>
  );
};

export default SettingsScreen;
