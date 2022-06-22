import React from 'react';
import { Text } from '@ui-kitten/components';
import { ViewProps, View } from 'react-native';
import IndividualAssementListItem from './IndividualAssessmentListItem';
import { HealthMarkerReportListItem } from 'src/core/types/HealthMarkerReportList';

//props
interface IIndividualAssessmentListProps extends ViewProps {
  btnClickHandler: (assessmnetId: string) => void;
  assessments: HealthMarkerReportListItem[];
  caption: string;
}

const IndividualAssessmentList = (props: IIndividualAssessmentListProps) => {
  const renderItems = () => {
    return props.assessments.map((item, index) => {
      return (
        <IndividualAssementListItem
          key={`item-index-${index}`}
          name={item.assessmentName}
          date={item.createdOn}
          btnClickHandler={() => {
            props.btnClickHandler(item.id);
          }}
        />
      );
    });
  };

  // view
  return (
    <View style={[props.style]}>
      <Text category="c2" appearance="hint">
        {props.caption}
      </Text>
      {renderItems()}
    </View>
  );
};

export default IndividualAssessmentList;
