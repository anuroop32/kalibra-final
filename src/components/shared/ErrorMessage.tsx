import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Text, useTheme } from '@ui-kitten/components';

export const ErrorMessage = ({ message }: any) => {
  const th = useTheme();

  if (!message) {
    return null;
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: th['color-danger-transparent-100'],
      borderRadius: 25,
      flexDirection: 'row',
      padding: 15,
      alignItems: 'center',
      marginVertical: 10,
      width: '100%'
    },
    icon: {
      marginRight: 10,
      width: 20,
      height: 20
    },
    text: {
      width: '80%',
      color: th['color-danger-500']
    }
  });

  return (
    <View style={styles.container}>
      <Icon name="alert-triangle-outline" fill={th['color-danger-500']} style={styles.icon} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};
