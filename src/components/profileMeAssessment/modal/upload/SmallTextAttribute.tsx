import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { Text } from '@ui-kitten/components';

interface ISmallTextAttributeProps extends ViewProps {
  title: string;
  value: string;
}

const SmallTextAttribute = (props: ISmallTextAttributeProps) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row'
    }
  });

  return (
    <View style={styles.container}>
      {!!props.title && (
        <Text category="c1" appearance="hint">
          {props.title}:{' '}
        </Text>
      )}
      <Text category="c1">{props.value}</Text>
    </View>
  );
};

export default SmallTextAttribute;
