import { Text } from '@ui-kitten/components';
import React from 'react';
import { ViewProps, StyleSheet, View } from 'react-native';
import { UIHelper as uh, Pillar } from '../../core';
import { PillarIcon } from '../home';

//props
interface IAssessmentPillarsProps extends ViewProps {
  caption: string;
  pillars: Array<Pillar>;
  size: 'large' | 'small';
  showOnePillarOnly?: boolean;
}

const AssessmentPillars = (props: IAssessmentPillarsProps) => {
  // styles
  const styleContainer = StyleSheet.create({
    container: { flex: 1 },
    item: {
      marginTop: props.size == 'large' ? uh.h2DP(8) : uh.h2DP(6),
      marginRight: uh.w2DP(4)
    },
    pillar: { flexDirection: 'row', flexWrap: 'wrap' },
    onePillarOnly: { alignItems: 'center', flex: 1, flexDirection: 'row' }
  });

  const renderPillars = () => {
    if (props.showOnePillarOnly == true) {
      return (
        <View style={styleContainer.onePillarOnly}>
          <PillarIcon
            key={`PillarIcon-${0}`}
            name={props.pillars[0].name}
            type={props.pillars[0].type}
            size={props.size}
            style={styleContainer.item}
          />
          {props.pillars.length > 1 && (
            <Text category="c2" style={styleContainer.item}>
              +1
            </Text>
          )}
        </View>
      );
    }

    return props.pillars.map((item: Pillar, index: number) => {
      return (
        <PillarIcon
          key={`PillarIcon-${index}`}
          name={item.name}
          type={item.type}
          size={props.size}
          style={styleContainer.item}
        />
      );
    });
  };

  // view
  return (
    <View style={[styleContainer.container, props.style]}>
      <Text category="c2" appearance="hint">
        {props.caption}
      </Text>
      <View style={styleContainer.pillar}>{renderPillars()}</View>
    </View>
  );
};

export default AssessmentPillars;
