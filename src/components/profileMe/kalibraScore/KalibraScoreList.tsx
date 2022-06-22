import { Divider, useTheme } from '@ui-kitten/components';
import React from 'react';
import { ViewProps, StyleSheet, View } from 'react-native';
import { PillarScore, UIHelper as uh } from '../../../core';
import KalibraScoreListItem from './KalibraScoreListItem';

//props
interface IKKalibraScoreListProps extends ViewProps {
  btnClickHandler: (data: PillarScore) => void;
  pillarScores: Array<PillarScore>;
}

const KalibraScoreList = (props: IKKalibraScoreListProps) => {
  const th = useTheme();

  // styles
  const styleContainer = StyleSheet.create({
    container: {
      flex: 1
    },
    divider: { height: 1, backgroundColor: th['border-basic-color-3'] },
    item: {
      marginTop: uh.h2DP(16),
      marginBottom: uh.h2DP(16),
      marginLeft: uh.h2DP(8),
      marginRight: uh.h2DP(16)
    },
    backdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
  });

  const renderItems = () => {
    return props.pillarScores.map((item, index) => {
      return (
        <View key={`KalibraScoreListItem-${index}`}>
          <Divider style={styleContainer.divider} />
          <KalibraScoreListItem style={styleContainer.item} data={item} actionHandler={props.btnClickHandler} />
        </View>
      );
    });
  };

  // view
  return <View style={[styleContainer.container, props.style]}>{renderItems()}</View>;
};

export default KalibraScoreList;
