import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { UIHelper as uh } from '../../core';
import { Text, Card, Button, Icon, useTheme } from '@ui-kitten/components';

//props
interface IConfirmAuthProps extends ViewProps {
  title: string;
  caption: string;
  buttonTitle: string;
  clickHandler: () => void;
}

const ConfirmAuth = (props: IConfirmAuthProps) => {
  //style
  const th = useTheme();
  const condColors = {
    iconFill: th['color-primary-500']
  };
  const styleContainer = StyleSheet.create({
    cardContainer: { flex: 1, alignItems: 'center' },
    iconContainer: {
      width: 250,
      height: 250,
      alignSelf: 'center'
    },
    textCenter: { textAlign: 'center', marginTop: uh.h2DP(10) },
    welcomeCaption: { marginTop: uh.h2DP(23), marginBottom: uh.h2DP(23) }
  });

  //view
  return (
    <View style={props.style}>
      <Card status="primary">
        <View style={styleContainer.iconContainer}>
          <Icon status="primary" fill={condColors.iconFill} name="checkmark-circle" />
        </View>
        <Text status="basic" category="h6" style={styleContainer.textCenter}>
          {props.title}
        </Text>
        <Text status="basic" category="p2" style={[styleContainer.textCenter, styleContainer.welcomeCaption]}>
          {props.caption}
        </Text>
        <Button size="large" status="primary" onPress={props.clickHandler}>
          <Text status="primary" category="s2">
            {props.buttonTitle}
          </Text>
        </Button>
      </Card>
    </View>
  );
};

export default ConfirmAuth;
