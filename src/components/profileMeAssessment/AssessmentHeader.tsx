import { Text, useTheme, Layout } from '@ui-kitten/components';
import React from 'react';
import { ViewProps, StyleSheet, View } from 'react-native';
import { UIHelper as uh } from '../../core';
import { ProfileIcons } from '../profileMe/ProfileIcons';

//props
interface IAssessmentHeaderProps extends ViewProps {
  assessmentType: string;
  numberOfAssessments: number;
  isActive: boolean;
}

const AssessmentHeader = (props: IAssessmentHeaderProps) => {
  const th = useTheme();
  // styles
  const styleContainer = StyleSheet.create({
    inactiveContainer: {
      padding: uh.h2DP(16),
      marginTop: uh.h2DP(8),
      borderRadius: 8
    },
    activeContainer: {
      padding: uh.h2DP(16),
      marginTop: uh.h2DP(8),
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8
    },
    content: {
      justifyContent: 'flex-start',
      marginLeft: uh.w2DP(10)
    },
    assessmentType: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    assessments: {
      marginTop: uh.h2DP(5)
    },
    icon: {
      width: 20,
      height: 20
    }
  });

  const RightIcon = () => {
    if (props.isActive == true) {
      return <ProfileIcons.UpIcon style={styleContainer.icon} fill={th['color-basic-600']} />;
    } else {
      return <ProfileIcons.DownIcon style={styleContainer.icon} fill={th['color-basic-600']} />;
    }
  };

  // view
  return (
    <Layout style={props.isActive == true ? styleContainer.activeContainer : styleContainer.inactiveContainer}>
      <View style={styleContainer.content}>
        <View style={styleContainer.assessmentType}>
          <Text category="s1">{props.assessmentType}</Text>
          {RightIcon()}
        </View>
        <Text category="c1" appearance="hint" style={styleContainer.assessments}>
          {props.numberOfAssessments} Assessments
        </Text>
      </View>
    </Layout>
  );
};

export default AssessmentHeader;
