import { Text, useTheme } from '@ui-kitten/components';
import React from 'react';
import { ViewProps, StyleSheet, View, TouchableOpacity } from 'react-native';
import { UIHelper as uh } from '../../../core';
import { HomeIcons } from '../../home/HomeIcons';

//props
interface IKalibraScoreHeaderProps extends ViewProps {
  btnClickHandler: () => void;
  summary: string;
}

const KalibraScoreHeader = (props: IKalibraScoreHeaderProps) => {
  const th = useTheme();
  // styles
  const styleContainer = StyleSheet.create({
    container: { marginBottom: uh.h2DP(6) },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: uh.h2DP(16),
      marginRight: uh.w2DP(16),
      marginLeft: uh.w2DP(16)
    },
    summary: {
      marginTop: 5,
      marginLeft: uh.w2DP(16),
      marginRight: uh.w2DP(16)
    }
  });

  // view
  return (
    <View style={styleContainer.container}>
      <TouchableOpacity onPress={props.btnClickHandler}>
        <View style={styleContainer.header}>
          <Text category="s1">Kalibra Scores</Text>
          <HomeIcons.ForwardIcon fill={th['color-basic-600']} style={{ width: 20, height: 20 }} />
        </View>
      </TouchableOpacity>
      <Text category="c1" appearance="hint" style={styleContainer.summary}>
        {props.summary}
      </Text>
    </View>
  );
};

export default KalibraScoreHeader;
