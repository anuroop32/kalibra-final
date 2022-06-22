import { Text, useTheme } from '@ui-kitten/components';
import React from 'react';
import { ViewProps, StyleSheet, View, TouchableOpacity } from 'react-native';
import { UIHelper as uh } from '../../core';
import { HomeIcons } from '../home/HomeIcons';
import moment from 'moment';

//props
interface IIndividualAssessmentListItemProps extends ViewProps {
  btnClickHandler: () => void;
  name: string;
  date: Date;
}

const IndividualAssessmentListItem = (props: IIndividualAssessmentListItemProps) => {
  const th = useTheme();
  // styles
  const styleContainer = StyleSheet.create({
    container: {
      justifyContent: 'space-between',
      borderColor: th['color-basic-600'],
      flexDirection: 'row',
      borderRadius: 8,
      marginTop: uh.h2DP(8),
      borderWidth: 1,
      paddingLeft: uh.w2DP(16),
      paddingRight: uh.w2DP(16),
      paddingTop: uh.h2DP(8),
      paddingBottom: uh.h2DP(10)
    },
    rightIcon: {
      width: 20,
      height: 20
    }
  });

  // view
  return (
    <TouchableOpacity onPress={props.btnClickHandler}>
      <View style={styleContainer.container}>
        <View>
          <Text category="s2">{props.name}</Text>
          <Text category="c1" appearance="hint">
            {moment(props.date).format('DD MMM YYYY')}
          </Text>
        </View>

        <View style={{ justifyContent: 'center' }}>
          <HomeIcons.ForwardIcon style={styleContainer.rightIcon} fill={th['color-basic-600']} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default IndividualAssessmentListItem;
