import { Text, Icon } from '@ui-kitten/components';
import React from 'react';
import { ViewProps, StyleSheet, View } from 'react-native';
import { UIHelper as uh } from '../../../core';

//props
interface IAccuracyTextProps extends ViewProps {
  accuracy: number;
}

const AccuracyText = (props: IAccuracyTextProps) => {
  // styles
  const styleContainer = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    icon: { width: 16, height: 16, marginRight: uh.w2DP(4) }
  });

  // view
  return (
    <View style={[styleContainer.container, props.style]}>
      <Icon name="loading" pack="kalibraCustomIconPack" style={styleContainer.icon}></Icon>
      <Text category="p2">Accuracy: {props.accuracy}%</Text>
    </View>
  );
};

export default AccuracyText;
