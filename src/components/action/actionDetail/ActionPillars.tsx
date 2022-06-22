import { Text } from '@ui-kitten/components';
import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { Pillar, UIHelper as uh } from '../../../core';
import PillarIcon from '../../home/PillarIcon';

//props
interface IActionPillarsProps extends ViewProps {
  pillars: Array<Pillar>;
}

const ActionPillars = (props: IActionPillarsProps) => {
  // styles
  const styleContainer = StyleSheet.create({
    pillars: {
      flexDirection: 'row',
      marginRight: uh.h2DP(26),
      flexWrap: 'wrap'
    },
    item: {
      marginTop: uh.h2DP(8),
      marginRight: uh.h2DP(8)
    }
  });

  const renderPillars = () => {
    return props.pillars.map((item: Pillar, index: number) => {
      return (
        <PillarIcon
          key={`pillars-${index}`}
          name={item.name}
          type={item.type}
          size="large"
          style={styleContainer.item}
        />
      );
    });
  };

  // view
  return (
    <View style={[props.style]}>
      <Text category="c2" appearance="hint">
        Pillars
      </Text>
      <View style={styleContainer.pillars}>{renderPillars()}</View>
    </View>
  );
};

export default ActionPillars;
