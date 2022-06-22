import { Text, useTheme } from '@ui-kitten/components';
import React from 'react';
import { ViewProps, StyleSheet, View } from 'react-native';
import { UIHelper as uh } from '../../core';
//props
interface RoundButtonProps extends ViewProps {
  name: string;
}

const RoundButton = (props: RoundButtonProps) => {
  const th = useTheme();
  // styles
  const styleContainer = StyleSheet.create({
    container: {
      backgroundColor: th['color-primary-500'],
      borderRadius: 25,
      paddingLeft: uh.w2DP(12),
      paddingRight: uh.w2DP(12),
      paddingTop: uh.h2DP(6),
      paddingBottom: uh.h2DP(6)
    },
    outerContainer: {}
  });

  // view
  return (
    <View style={styleContainer.container}>
      <Text category="p2" style={{ color: th['color-primary-100'] }}>
        {props.name}
      </Text>
    </View>
  );
};

export default RoundButton;
