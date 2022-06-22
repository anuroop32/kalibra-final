import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import AssessmentListSectionItem from './AssessmentListSectionItem';
import { HealthMarkerGroup } from 'src/core/types/HealthMarkerReport';

//props
interface IAssessmentListSectionProps extends ViewProps {
  btnDetailAssessmentClick: (assessmentId: string) => void;
  sections: HealthMarkerGroup[];
}

const AssessmentListSection = (props: IAssessmentListSectionProps) => {
  // styles
  const styleContainer = StyleSheet.create({
    container: {
      borderRadius: 8
    }
  });

  const renderSections = () => {
    return props.sections.map((section, index) => {
      return (
        <AssessmentListSectionItem
          btnDetailAssessmentClick={props.btnDetailAssessmentClick}
          key={`ListSectionItem-${index}`}
          section={section}
        />
      );
    });
  };

  // view
  return <View style={styleContainer.container}>{renderSections()}</View>;
};

export default AssessmentListSection;
