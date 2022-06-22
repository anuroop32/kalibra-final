import { Text, useTheme, Icon } from '@ui-kitten/components';
import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { PillarScore, UIHelper as uh } from '../../../core';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PillarIcon from '../../home/PillarIcon';
import { HomeIcons } from '../../home/HomeIcons';

//props
interface IKalibraScoreListItemProps extends ViewProps {
  data: PillarScore;
  actionHandler: (data: PillarScore) => void;
}

const KalibraScoreListItem = (props: IKalibraScoreListItemProps) => {
  const th = useTheme();
  // styles
  const styles = StyleSheet.create({
    container: {
      height: 32
    },
    actionName: { marginTop: uh.h2DP(7), marginLeft: uh.h2DP(8) },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flex: 1
    },
    leftContainer: {
      flexDirection: 'row'
    },
    rightContainer: {
      flexDirection: 'row',
      width: 130,
      alignItems: 'center'
    },
    rightIcon: {
      width: 20,
      height: 20,
      alignSelf: 'center',
      alignContent: 'center',
      marginLeft: uh.h2DP(15)
    }
  });

  // view
  return (
    <TouchableOpacity
      onPress={() => {
        props.actionHandler(props.data);
      }}
    >
      <View style={[styles.container, props.style]}>
        <View style={styles.rowContainer}>
          <View style={styles.leftContainer}>
            <PillarIcon size="large" type={props.data.type}></PillarIcon>
            <Text category="p1" style={styles.actionName}>
              {props.data.name}
            </Text>
          </View>
          <View style={styles.rightContainer}>
            <Icon name="loading" pack="kalibraCustomIconPack" style={{ width: 16, height: 16, marginRight: 2 }}></Icon>
            <Text category="c1" appearance="hint" style={{ width: 30 }}>{`${props.data.accuracy}%`}</Text>
            <Text category="h6" style={{ width: 55, textAlign: 'right' }}>{`${props.data.score}%`}</Text>
            <HomeIcons.ForwardIcon style={styles.rightIcon} fill={th['color-basic-600']} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default KalibraScoreListItem;
