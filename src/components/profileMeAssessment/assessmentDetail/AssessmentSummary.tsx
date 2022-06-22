import { Text } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { UIHelper as uh } from '../../../core';
import AssessmentCoach from './AssessmentCoach';
import moment from 'moment';
import { CoachInfo } from 'src/core/types/CoachInfo';

//props
interface IAssessmentSummaryProps extends ViewProps {
  name: string;
  type: string;
  date: Date;
  coach: CoachInfo;
}

const AssessmentSummary = (props: IAssessmentSummaryProps) => {
  // styles
  const styleContainer = StyleSheet.create({
    container: {
      marginTop: uh.h2DP(28)
    },
    assessmentType: {
      marginTop: uh.h2DP(8)
    },
    date: {
      marginTop: uh.h2DP(4)
    },
    coach: {
      marginTop: uh.h2DP(24)
    }
  });

  // view
  return (
    <View style={styleContainer.container}>
      <Text category="h4">{props.name}</Text>
      <Text category="p2" style={styleContainer.assessmentType}>
        Type: {props.type}
      </Text>
      <Text category="c1" style={styleContainer.date}>
        Date: {moment(props.date).format('DD MMM YYYY')}
      </Text>
      <AssessmentCoach caption="Coach" coach={props.coach} btnMessage="Manage" style={styleContainer.coach} />
    </View>
  );
};

export default AssessmentSummary;
