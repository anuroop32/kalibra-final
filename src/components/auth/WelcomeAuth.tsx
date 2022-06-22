import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { UIHelper as uh } from '../../core';
import { Text } from '@ui-kitten/components';

//props
interface IWelcomeAuthProps extends ViewProps {
  title: string;
  welcomeCaption: string;
}

const WelcomeAuth = (props: IWelcomeAuthProps) => {
  //styles
  const styleContainer = StyleSheet.create({
    textCenter: { textAlign: 'center' },
    welcomeCaption: { marginTop: uh.h2DP(23) }
  });

  // view
  return (
    <View style={props.style}>
      <Text status="basic" category="h6" style={styleContainer.textCenter}>
        {props.title}
      </Text>
      <Text status="basic" category="p2" style={[styleContainer.textCenter, styleContainer.welcomeCaption]}>
        {props.welcomeCaption}
      </Text>
    </View>
  );
};

export default WelcomeAuth;
