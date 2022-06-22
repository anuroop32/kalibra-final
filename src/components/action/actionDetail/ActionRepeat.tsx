import { Text } from '@ui-kitten/components';
import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { UIHelper as uh } from '../../../core';
import LearnMore from '../../home/LearnMore';
import moment from 'moment';

//props
interface IActionRepeatProps extends ViewProps {
  date: Date;
  repeatFrequencyDays: number;
  btnClickHandler: () => void;
  btn2ClickHandler: () => void;
}

const ActionRepeat = (props: IActionRepeatProps) => {
  // styles
  const styleContainer = StyleSheet.create({
    caption: { marginLeft: uh.h2DP(32), marginTop: uh.h2DP(8) },
    learnMore: { marginTop: uh.h2DP(24), marginLeft: uh.h2DP(32) }
  });

  // view
  return (
    <View style={[props.style]}>
      <Text category="c2" appearance="hint" style={styleContainer.caption}>
        Repeat
      </Text>
      <Text category="p1" style={styleContainer.caption}>
        Every {props.repeatFrequencyDays} day(s) until {moment(props.date).format('ddd')}{' '}
        <Text category="s1"> {moment(props.date).format('D MMM')} </Text>
      </Text>
      <LearnMore
        style={styleContainer.learnMore}
        btnMessage="Learn more"
        btnHandler={props.btnClickHandler}
        btn2Message="Mark as a habit"
        btn2Handler={props.btn2ClickHandler}
        messages={['If you feel like this has become a part of your daily life you can mark it off as a habit.']}
      />
    </View>
  );
};

export default ActionRepeat;
