import { Layout, Text, useTheme } from '@ui-kitten/components';
import React from 'react';
import { ViewProps, StyleSheet } from 'react-native';
import { UIHelper as uh, PillarScore, TextHelper as txh } from '../../../../core';
import AccuracyText from '../../kalibraScore/AccuracyText';
import LearnMore from '../../../home/LearnMore';
import YourScoreName from './YourScoreName';

//props
interface IScoreSummaryProps extends ViewProps {
  learnMoreClickHandler: () => void;
  data: PillarScore;
}

const ScoreSummary = (props: IScoreSummaryProps) => {
  const th = useTheme();

  // styles
  const styleContainer = StyleSheet.create({
    container: {
      marginTop: uh.h2DP(16),
      borderRadius: 8,
      padding: uh.h2DP(16)
    },
    score: {
      color: props.data.type == 'kalibra' ? th['color-primary-700'] : th['color-' + props.data.type + '-700']
    },
    accuracy: { justifyContent: 'flex-start' },
    learnMore: { marginTop: uh.h2DP(24) }
  });

  // view
  return (
    <Layout level="2" style={styleContainer.container}>
      <YourScoreName pillarType={props.data.type} />
      <Text category="h1" style={styleContainer.score}>
        {props.data.score}
        <Text category="h4" style={styleContainer.score}>
          %
        </Text>
      </Text>
      <AccuracyText accuracy={props.data.accuracy} style={styleContainer.accuracy} />

      <LearnMore
        style={styleContainer.learnMore}
        btnHandler={props.learnMoreClickHandler}
        messages={[txh.getText(`learnMoreAbout${props.data.name}`)]}
        useRender={true}
      />
    </Layout>
  );
};

export default ScoreSummary;
