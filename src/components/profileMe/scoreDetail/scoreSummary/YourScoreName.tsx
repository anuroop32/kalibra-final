import { Text } from '@ui-kitten/components';
import React from 'react';
import { ViewProps, StyleSheet, View } from 'react-native';
import { UIHelper as uh, StringHelper as sh } from '../../../../core';
import PillarIcon from '../../../home/PillarIcon';

//props
interface IYourScoreNameProps extends ViewProps {
  pillarType: string;
}

const YourScoreName = (props: IYourScoreNameProps) => {
  // styles
  const styleContainer = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    icon: {
      marginRight: uh.w2DP(4)
    }
  });

  // view
  return (
    <View>
      <View style={styleContainer.container}>
        {props.pillarType != 'kalibra' && (
          <PillarIcon type={props.pillarType} style={styleContainer.icon} size="small" />
        )}
        <Text category="s1">Your {sh.capitalize(props.pillarType)} score</Text>
      </View>
    </View>
  );
};

export default YourScoreName;
