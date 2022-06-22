import { Text } from '@ui-kitten/components';
import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { UIHelper as uh } from '../../../core';
import LearnMore from '../../home/LearnMore';

//props
interface IActionSummaryProps extends ViewProps {
  summary: string;
  btnHandler: () => void;
}

const ActionSummary = (props: IActionSummaryProps) => {
  // styles
  const styleContainer = StyleSheet.create({
    button: {
      marginTop: uh.h2DP(16)
    },
    learnMore: { marginTop: uh.h2DP(24), marginLeft: uh.h2DP(32) }
  });

  // view
  return (
    <View style={[props.style]}>
      <Text category="p2">{props.summary}</Text>
      <LearnMore
        style={styleContainer.learnMore}
        btnMessage="Chat to me about this action"
        btnHandler={props.btnHandler}
        messages={[
          'This is an insight about this action. First, briefly explaining why the user has been given the action. Secondly giving a fact about this action.',
          'It’s also an opportunity to remind the user when this action was first assigned to them.'
        ]}
      />
    </View>
  );
};

export default ActionSummary;
