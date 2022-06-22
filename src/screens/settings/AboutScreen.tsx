import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { settingStyles } from './_settingStyles';

const AboutScreen = () => {
  // styles
  const styleContainer = StyleSheet.create({
    screenContainer: { flex: 1 },
    safeAreaView: { flex: 1 }
  });

  // view
  return (
    <Layout level="2" style={[styleContainer.screenContainer, settingStyles.settingScreenContainer]}>
      <SafeAreaView style={styleContainer.screenContainer}>
        <Text>
          Kalibra Version{' '}
          <Text category="s1" appearance="hint">
            1.0
          </Text>{' '}
        </Text>
      </SafeAreaView>
    </Layout>
  );
};

export default AboutScreen;
