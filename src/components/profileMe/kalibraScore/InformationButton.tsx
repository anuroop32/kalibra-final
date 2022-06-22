import { Text, Icon } from '@ui-kitten/components';
import React from 'react';
import { ViewProps, StyleSheet, View, TouchableOpacity } from 'react-native';
import { UIHelper as uh } from '../../../core';

//props
interface IInformationButtonProps extends ViewProps {
  onPress: () => void;
  title: string;
  color: string;
}

const InformationButton = (props: IInformationButtonProps) => {
  // styles
  const styleContainer = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: uh.h2DP(8)
    },
    icon: { width: 16, height: 16, marginRight: uh.w2DP(4) }
  });

  // view
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={[styleContainer.container, props.style]}>
        <Icon name="info-outline" fill={props.color} style={styleContainer.icon}></Icon>

        <Text category="c1" style={{ color: props.color }}>
          {props.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default InformationButton;
