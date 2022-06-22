import 'react-native-get-random-values';
import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@ui-kitten/components';
import { UIHelper as uh } from '../../core';
const ChatFooter = () => {
  const styles = StyleSheet.create({
    container: {
      height: uh.h2DP(40),
      backgroundColor: 'transparent'
    },
    text: {
      marginBottom: 5,
      fontStyle: 'italic',
      textAlign: 'center',
      marginTop: uh.h2DP(10),
      height: uh.h2DP(30),
      backgroundColor: 'transparent'
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text} appearance="hint">
        Long press on any message to react
      </Text>
    </View>
  );
};

export default memo(ChatFooter);
