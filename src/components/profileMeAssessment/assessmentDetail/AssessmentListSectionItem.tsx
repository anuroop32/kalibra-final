import { Text, Layout, Divider } from '@ui-kitten/components';
import React from 'react';
import { ViewProps, StyleSheet, View } from 'react-native';
import { UIHelper as uh, convertToNewHealthMarker } from '../../../core';
import CoachMessage from './CoachMessage';
import AssessmentBiomarker from './AssessmentBiomarker';
import { HealthMarker, HealthMarkerGroup } from 'src/core/types/HealthMarkerReport';

//props
interface IAssessmentListSectionItemProps extends ViewProps {
  section: HealthMarkerGroup;
  btnDetailAssessmentClick: (assessmentId: string) => void;
}

const AssessmentListSectionItem = (props: IAssessmentListSectionItemProps) => {
  // styles
  const styleContainer = StyleSheet.create({
    contain: {
      marginTop: uh.h2DP(24),
      borderRadius: 8
    },
    name: {
      marginLeft: uh.w2DP(16),
      marginRight: uh.w2DP(16),
      marginTop: uh.h2DP(16)
    },
    summary: {
      marginLeft: uh.w2DP(16),
      marginRight: uh.w2DP(16),
      marginTop: uh.h2DP(10)
    },
    coachMessage: {
      marginTop: uh.h2DP(40),
      marginLeft: uh.w2DP(16),
      marginRight: uh.w2DP(16),
      marginBottom: uh.h2DP(16)
    },
    icon: {
      width: 20,
      height: 20
    },
    divider: { marginTop: uh.h2DP(24) },
    bioDivider: { marginTop: uh.h2DP(10) }
  });

  const renderBiomarkers = () => {
    return props.section.data.map((biomarker: HealthMarker, index: number) => {
      if (biomarker.categories.length <= 0 || biomarker.graphType == 'None') {
        return <View key={`biomarker-item-${index}`}></View>;
      }
      return (
        <View key={`biomarker-item-${index}`}>
          <AssessmentBiomarker
            btnDetailAssessmentClick={props.btnDetailAssessmentClick}
            biomarker={convertToNewHealthMarker(biomarker)}
          />
          <Divider style={styleContainer.bioDivider} />
        </View>
      );
    });
  };

  // view
  return (
    <Layout style={styleContainer.contain}>
      <Text category="h6" style={styleContainer.name}>
        {props.section.groupName}
      </Text>
      {/* <Text category="p2" appearance="hint" style={styleContainer.summary}>
        {
          'A brief introduction about this section of the assessment. Maybe a short explanation of what these things are.'
        }
      </Text> */}
      <Divider style={styleContainer.divider} />
      {renderBiomarkers()}
      {props.section.comment?.comment != null && props.section.comment?.comment.length > 0 && (
        <CoachMessage style={styleContainer.coachMessage} messages={[props.section.comment?.comment as string]} />
      )}
    </Layout>
  );
};

export default AssessmentListSectionItem;
