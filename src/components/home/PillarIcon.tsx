import React from 'react';
import { ViewProps, StyleSheet, View } from 'react-native';
import { Icon, useTheme, Text } from '@ui-kitten/components';
import { UIHelper as uh } from '../../core';

//props
interface IPillarIconProps extends ViewProps {
  name?: string;
  type: string;
  size: 'small' | 'large';
}

const PillarIcon = (props: IPillarIconProps) => {
  const th = useTheme();
  const nameCategory = props.size === 'small' ? 'c1' : 'p2';
  // styles
  const styles = StyleSheet.create({
    icon: {
      width: props.size === 'small' ? 16 : 20,
      height: props.size === 'small' ? 16 : 20
    },
    iconWithName: {
      width: props.size === 'small' ? 16 : 24,
      height: props.size === 'small' ? 16 : 24
    },
    container: {
      backgroundColor: th['color-' + props.type + '-200-transparent'],
      padding: props.size === 'small' ? uh.h2DP(4) : uh.h2DP(6),
      borderRadius: 25,
      alignItems: 'center',
      height: props.size === 'small' ? 24 : 32,
      width: props.size === 'small' ? 24 : 32
    },
    containerWithName: {
      flexDirection: 'row',
      paddingTop: props.size === 'small' ? uh.h2DP(2) : uh.h2DP(4),
      paddingBottom: props.size === 'small' ? uh.h2DP(2) : uh.h2DP(4),
      paddingStart: props.size === 'small' ? uh.h2DP(6) : uh.h2DP(10),
      paddingEnd: props.size === 'small' ? uh.h2DP(10) : uh.h2DP(12),
      backgroundColor: th['color-' + props.type + '-200-transparent'],
      borderRadius: 25,
      height: props.size === 'small' ? 20 : 32,
      alignItems: 'center'
    },
    pillarName: {
      marginLeft: uh.h2DP(4),
      color: th['color-' + props.type + '-700']
    }
  });

  // icon along with name
  if (props.name != undefined) {
    return (
      <View style={[styles.containerWithName, props.style]}>
        <Icon name={props.type} style={styles.iconWithName} pack="kalibraCustomIconPack" />
        <Text category={nameCategory} style={styles.pillarName}>
          {props.name}
        </Text>
      </View>
    );
  } else {
    // icon only
    return (
      <View style={[styles.container, props.style]}>
        <Icon name={props.type} style={styles.icon} pack="kalibraCustomIconPack"></Icon>
      </View>
    );
  }
};

export default PillarIcon;
