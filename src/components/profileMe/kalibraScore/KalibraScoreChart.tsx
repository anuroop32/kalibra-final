import { useTheme, Text } from '@ui-kitten/components';
import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { PillarScore, UIHelper as uh } from '../../../core';
import AccuracyText from './AccuracyText';

//props
interface IKalibraScoreChartProps extends ViewProps {
  pillarScores: Array<PillarScore>;
}

const KalibraScoreChart = (props: IKalibraScoreChartProps) => {
  // styles
  const th = useTheme();
  const stylesContainer = StyleSheet.create({
    container: {
      alignItems: 'center'
    },
    center: {},
    behind: {
      position: 'absolute',
      left: 0,
      top: 0
    },
    chart: {
      height: 250,
      width: 250
    },
    kalibraScore: { position: 'absolute', alignSelf: 'center', justifyContent: 'center', top: '42%' },
    kalibraScoreValue: { paddingLeft: uh.h2DP(6), top: '48%' },
    accuracy: { marginTop: uh.h2DP(14) }
  });

  // properties
  const doughnutWidth = 55;
  const innerRadiusBase = 45;
  const renderingOuterRadius = innerRadiusBase * 2;
  const [sliceName, setSliceName] = React.useState(props.pillarScores[0].type);
  const [kalibraUserScore, setKalibraUserScore] = React.useState(props.pillarScores[0].score);
  const [kalibraUserAccuracy, setKalibraUserAccuracy] = React.useState(props.pillarScores[0].accuracy);

  // Sets the base value for the
  const baseData = props.pillarScores.map((item) => {
    return {
      key: item.type,
      value: doughnutWidth,
      svg: { fill: th['color-' + item.type + '-200-transparent'] },
      arc: { innerRadius: innerRadiusBase + '%', outerRadius: innerRadiusBase + doughnutWidth + '%' },
      onPress: () => {
        setSliceName(item.type);
        setKalibraUserScore(item.score);
        setKalibraUserAccuracy(item.accuracy);
      }
    };
  });

  // defines the user data
  const userScoreData = props.pillarScores.map((item) => {
    return {
      key: item.type,
      value: doughnutWidth,
      svg: { fill: th['color-' + item.type + '-500'] },
      arc: {
        innerRadius: innerRadiusBase + '%',
        outerRadius: innerRadiusBase + item.score * (doughnutWidth / 100) + '%'
      }
    };
  });

  // view
  return (
    <View style={[stylesContainer.container]}>
      <View style={stylesContainer.center}>
        <View style={stylesContainer.behind}>
          <PieChart
            style={stylesContainer.chart}
            outerRadius={renderingOuterRadius + '%'}
            innerRadius={innerRadiusBase + '%'}
            data={userScoreData}
          />
        </View>
        <View>
          <PieChart
            style={stylesContainer.chart}
            outerRadius={renderingOuterRadius + '%'}
            innerRadius={innerRadiusBase + '%'}
            data={baseData}
          />
          <Text
            appearance="hint"
            category="label"
            style={[
              stylesContainer.kalibraScore,
              { textTransform: 'capitalize', color: th['color-' + sliceName + '-700'] }
            ]}
          >
            {sliceName} Score
          </Text>
          <Text
            category="h4"
            style={[
              stylesContainer.kalibraScore,
              stylesContainer.kalibraScoreValue,
              { color: th['color-' + sliceName + '-600'] }
            ]}
          >
            {kalibraUserScore}
            <Text style={{ color: th['color-' + sliceName + '-600'] }} category="h6">
              %
            </Text>
          </Text>
        </View>
      </View>
      <AccuracyText accuracy={kalibraUserAccuracy} style={stylesContainer.accuracy} />
    </View>
  );
};

export default KalibraScoreChart;
