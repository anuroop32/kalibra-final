import { Text } from '@ui-kitten/components';
import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { UIHelper as uh } from '../../../core';

//props
interface IActionGoalsProps extends ViewProps {
  totalTimes: number;
  doneTimes: number;
}

const ActionGoals = (props: IActionGoalsProps) => {
  // styles
  const styleContainer = StyleSheet.create({
    totalTimes: {
      marginTop: uh.h2DP(6)
    },
    today: {
      marginTop: uh.h2DP(6)
    }
  });

  // view
  return (
    <View style={[props.style]}>
      <Text category="c2" appearance="hint">
        Goals
      </Text>
      <Text category="p1" style={styleContainer.totalTimes}>
        {props.totalTimes} times per day
      </Text>
      <Text category="p2" appearance="hint" style={styleContainer.today}>
        Today : {props.doneTimes} / {props.totalTimes}
      </Text>
    </View>
  );
};

export default ActionGoals;
