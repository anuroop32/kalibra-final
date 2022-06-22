import { Divider, Layout, Text, useTheme } from '@ui-kitten/components';
import React from 'react';
import { ViewProps, StyleSheet } from 'react-native';
import { UIHelper as uh, ScoreItem, PillarScore } from '../../../../core';
import LineChart from './LineChart';
import moment from 'moment';

//props
interface IKalibraScoreProps extends ViewProps {
  btnScoreHistoryHandler: () => void;
  graphData: Array<ScoreItem>;
  pillarScore: PillarScore;
  isLoading: boolean;
}

const KalibraScore = (props: IKalibraScoreProps) => {
  const th = useTheme();
  // styles
  const styleContainer = StyleSheet.create({
    container: {
      marginTop: uh.h2DP(16),
      borderRadius: 8
    },
    week: {
      marginLeft: uh.w2DP(16),
      marginRight: uh.w2DP(16),
      marginTop: uh.h2DP(16)
    },
    percentage: {
      marginLeft: uh.w2DP(16),
      marginRight: uh.w2DP(16)
    },
    divider: { marginTop: uh.h2DP(16) }
  });

  const chartColor =
    props.pillarScore.type == 'kalibra' ? th['color-primary-500'] : th['color-' + props.pillarScore.type + '-500'];
  let strWeek = '';
  if (props.graphData.length > 0) {
    const fromDate = moment(props.graphData[props.graphData.length - 1].date);
    const toDate = moment(props.graphData[0].date);
    strWeek = `Score History ${fromDate.format('D MMM')} - ${toDate.format('D MMM')}`;
  }

  // view
  return (
    <Layout level="2" style={styleContainer.container}>
      <Text category="s1" style={styleContainer.week}>
        {strWeek}
      </Text>
      {/* {props.graphData.length > 0 && ( */}
      <LineChart
        type={props.pillarScore.type}
        score={props.pillarScore.score}
        color={chartColor}
        currentScore={props.graphData[0]?.value}
        currentDate={props.graphData[0]?.date}
        graphData={props.graphData}
        isLoading={props.isLoading}
      />
      {/* )} */}
      <Divider style={styleContainer.divider} />
    </Layout>
  );
};

export default KalibraScore;
