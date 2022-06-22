import { Text } from '@ui-kitten/components';
import React from 'react';
import { ViewProps, StyleSheet, View } from 'react-native';

//props
interface IAssessmentScoreProps extends ViewProps {
  caption: string;
  score: string;
  textCategory: string;
}

const AssessmentScore = (props: IAssessmentScoreProps) => {
  // styles
  const styleContainer = StyleSheet.create({
    container: { flex: 1 }
  });

  // view
  return (
    <View style={[styleContainer.container, props.style]}>
      <Text category="c1" appearance="hint">
        {props.caption}
      </Text>
      <Text category={props.textCategory}>{props.score}</Text>
    </View>
  );
};

export default AssessmentScore;
