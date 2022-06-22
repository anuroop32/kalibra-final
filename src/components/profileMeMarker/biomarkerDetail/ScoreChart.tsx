import React from 'react';
import { Divider, useTheme } from '@ui-kitten/components';
import { View, ViewProps, StyleSheet, Dimensions } from 'react-native';
import { LineChart, XAxis } from 'react-native-svg-charts';
import * as scale from 'd3-scale';
import { Circle, G, Line, Rect } from 'react-native-svg';
import { UIHelper as uh } from '../../../core';
import moment from 'moment';
import * as d3 from 'd3';
import { HealthMarkerHistoryValue } from 'src/core/types/HealthMarkerHistory';

const GRAPH_MARGIN = 16;

//props
interface IScoreChartProps extends ViewProps {
  currentDate: Date;
  startDate: Date;
  endDate: Date;
  currentValue: number;
  scoreChanges: HealthMarkerHistoryValue[];
}

const ScoreChart = (props: IScoreChartProps) => {
  const th = useTheme();

  // styles
  const styles = StyleSheet.create({
    container: {},
    areaChart: { height: 98 },
    xAxis: { height: 20 },
    divider: { backgroundColor: th['border-basic-color-4'] }
  });

  if (props.scoreChanges?.length == 0) {
    return <></>;
  }

  let chartData: any[] = [];
  chartData.push({
    value: -1,
    date: props.startDate
  });

  props.scoreChanges?.forEach((item) => {
    chartData.push({
      value: item.value,
      date: moment(item.date).toDate()
    });
  });

  chartData.push({
    value: -1,
    date: props.endDate
  });

  chartData = chartData.sort(function (a, b) {
    return moment(a.date).valueOf() - moment(b.date).valueOf();
  });

  const graphWidth = Dimensions.get('window').width - 2 * GRAPH_MARGIN;
  const xDomain = [chartData[0].date, chartData[chartData.length - 1].date];
  const xRange = [0, graphWidth];
  const xScale = d3.scaleTime().domain(xDomain).range(xRange);

  const Decorator = ({ x, y, data }: any) => {
    return data.map((item: any, index: number) => {
      if (item.value < 0) {
        return <G key={`Decorator-${index}`}></G>;
      }

      return (
        <Circle
          key={`Decorator-${index}`}
          cx={x(xScale(item.date))}
          cy={y(item.value)}
          r={4}
          strokeWidth={2}
          stroke={th['color-primary-500']}
          fill={'white'}
        />
      );
    });
  };

  const OptimalArea = ({ y }: any) => (
    <Rect key={'OptimalArea'} y={y(5)} x={0} width={graphWidth} height={30} fill={th['color-primary-100']} />
  );

  const CurrentValue = ({ x, y }: any) => {
    return (
      <G x={x(xScale(moment(props.currentDate).toDate()))}>
        <Line y1={y(props.currentValue) + 4} y2={200} stroke={th['color-primary-500']} strokeWidth={2} />
        <Circle cy={y(props.currentValue)} r={5} fill={th['color-primary-500']} />
      </G>
    );
  };

  return (
    <View style={[styles.container, props.style]}>
      <LineChart
        style={{ height: 74 }}
        data={chartData.map((item) => item)}
        svg={{ stroke: 'transparent' }}
        xMin={xScale(chartData[0].date)}
        xMax={xScale(chartData[chartData.length - 1].date)}
        xAccessor={({ item }) => {
          return xScale(item.date);
        }}
        yAccessor={({ item }) => item.value}
        contentInset={{ top: 20, bottom: 20, left: 6, right: 6 }}
      >
        <OptimalArea />
        <Decorator />
        <CurrentValue />
      </LineChart>
      <Divider style={styles.divider} />
      <XAxis
        data={chartData}
        svg={{
          fill: th['text-hint-color'],
          fontSize: 10,
          rotation: 0,
          originY: 30,
          y: 8
        }}
        xAccessor={({ item }) => moment(item.date).toDate()}
        scale={scale.scaleTime}
        style={styles.xAxis}
        numberOfTicks={4}
        contentInset={{ left: uh.w2DP(16), right: uh.w2DP(16) }}
        formatLabel={(value) => moment(value).format('MMM D')}
      />
    </View>
  );
};

export default ScoreChart;
