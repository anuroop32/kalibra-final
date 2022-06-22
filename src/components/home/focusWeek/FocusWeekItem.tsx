import { Text, useTheme } from '@ui-kitten/components';
import React from 'react';
import { View, ViewProps, StyleSheet, Platform } from 'react-native';
import { UIHelper as uh } from '../../../core';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text as SvgText } from 'react-native-svg';
import { ProgressCircle } from 'react-native-svg-charts';
import PillarIcon from '../PillarIcon';
import { HomeIcons } from '../HomeIcons';

//props
interface IWeekActionItemProps extends ViewProps {
  pillarName: string;
  pillarType: string;
  percentage: number;
  actionHandler: () => void;
}

const WeekActionItem = (props: IWeekActionItemProps) => {
  const th = useTheme();
  const progressCircleRadius = 32;
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
      width: 72,
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
    <TouchableOpacity onPress={props.actionHandler}>
      <View style={[styles.container, props.style]}>
        <View style={styles.rowContainer}>
          <View style={styles.leftContainer}>
            <PillarIcon size="large" type={props.pillarType}></PillarIcon>
            <Text category="s2" style={styles.actionName}>
              {props.pillarName}
            </Text>
          </View>

          <View style={styles.rightContainer}>
            <ProgressCircle
              style={{
                width: progressCircleRadius,
                height: progressCircleRadius
              }}
              progress={(props.percentage * 1.0) / 100}
              progressColor={th['color-' + props.pillarType + '-500']}
              backgroundColor={th['color-basic-default-border']}
              startAngle={0}
              endAngle={2 * Math.PI}
              strokeWidth={2}
              animate={false}
            >
              <SvgText
                x={0}
                y={Platform.OS === 'web' ? 3 : -1}
                scale={1}
                fill={th['text-basic-color']}
                fontSize={10}
                fontFamily={'Poppins-SemiBold'}
                textAnchor={'middle'}
                alignmentBaseline={'bottom'}
              >
                {`${props.percentage}%`}
              </SvgText>
            </ProgressCircle>
            <HomeIcons.ForwardIcon style={styles.rightIcon} fill={th['color-basic-600']} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default WeekActionItem;
