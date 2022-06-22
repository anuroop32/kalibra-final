import React from 'react';
import { Divider, useTheme, Spinner, Text } from '@ui-kitten/components';
import { View, ViewProps, StyleSheet, Dimensions } from 'react-native';
import { AreaChart, XAxis } from 'react-native-svg-charts';
import * as scale from 'd3-scale';
import { Circle, Path, Defs, LinearGradient, Stop, G, Line } from 'react-native-svg';
import { ScoreItem, UIHelper as uh, StringHelper as sh } from '../../../../core';
import moment from 'moment';
import * as d3 from 'd3';

//props
interface ILineChartProps extends ViewProps {
  type: string;
  score: number;
  currentScore: number;
  currentDate: Date;
  color: string;
  graphData: Array<ScoreItem>;
  isLoading: boolean;
}

const LineChart = (props: ILineChartProps) => {
  const th = useTheme();
  const graphHeight = 135;
  const stopOpacity = 0.24;

  // styles
  const styles = StyleSheet.create({
    container: {
      height: graphHeight,
      padding: uh.h2DP(16)
    },
    NoGraphContainer: {
      height: 50,
      padding: uh.h2DP(16)
    },
    loading: {
      height: graphHeight,
      alignContent: 'center',
      alignSelf: 'center',
      padding: uh.h2DP(16)
    },
    areaChart: { height: 98 },
    xAxis: { marginHorizontal: -15, height: 20 },
    score: {
      marginLeft: uh.w2DP(16),
      marginRight: uh.w2DP(16)
    },
    scoreName: {
      marginLeft: uh.w2DP(16),
      marginRight: uh.w2DP(16),
      marginTop: uh.h2DP(4)
    },
    divider: { backgroundColor: th['border-basic-color-4'], marginLeft: uh.w2DP(5), marginRight: uh.w2DP(5) }
  });
  const [isDelay, setIsDelay] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setIsDelay(false);
    }, 600);
  }, []);

  if (isDelay == true || props.isLoading) {
    return (
      <View style={styles.loading}>
        <Spinner status="primary" />
      </View>
    );
  }

  if (props.graphData.length == 0) {
    return (
      <View>
        <Text category="c1" appearance="hint" style={styles.scoreName}>
          {sh.capitalize(props.type)} score
        </Text>
        <Text category="h6" style={styles.score}>
          {props.score}%
        </Text>
        <View style={styles.NoGraphContainer}>
          <Text appearance="hint" style={{ textAlign: 'center' }}>
            {' '}
            No graph data{' '}
          </Text>
        </View>
      </View>
    );
  }

  // sort chart data's date by asc
  let chartData = props.graphData.sort(function (a, b) {
    return moment(a.date).valueOf() - moment(b.date).valueOf();
  });

  // group chart data by date
  const tmpChartData: Array<ScoreItem> = [];
  let strPrevDay = '';
  chartData.forEach((item) => {
    const strDay = moment(item.date).format('DD MMM YYY');
    if (strPrevDay != strDay) {
      tmpChartData.push({ date: item.date, value: item.value });
      strPrevDay = strDay;
    } else {
      if (item.value > tmpChartData[tmpChartData.length - 1].value) {
        tmpChartData[tmpChartData.length - 1].value = item.value;
      }
    }
  });
  chartData = tmpChartData;
  const GRAPH_MARGIN = 16;
  const graphWidth = Dimensions.get('window').width - 2 * GRAPH_MARGIN;
  const xDomain = [chartData[0].date, chartData[chartData.length - 1].date];
  const xRange = [0, graphWidth];
  const xScale = d3.scaleTime().domain(xDomain).range(xRange);

  const Decorator = ({ x, y, data }: any) => {
    return data.map((item: ScoreItem, index: number) => (
      <Circle
        key={index}
        cx={x(xScale(item.date))}
        cy={y(item.value)}
        r={4}
        strokeWidth={2}
        stroke={props.color}
        fill={'white'}
      />
    ));
  };

  const Gradient = () => (
    <Defs key={'defs'}>
      <LinearGradient id={'gradient'} x1={'0%'} y1={'0%'} x2={'0%'} y2={'100%'}>
        <Stop offset={'0%'} stopColor={props.color} stopOpacity={1} />
        <Stop offset={'100%'} stopColor={th['background-basic-color-1']} stopOpacity={stopOpacity} />
      </LinearGradient>
    </Defs>
  );

  const CurrentValue = ({ x, y }: any) => {
    return (
      <G x={x(xScale(props.currentDate))}>
        <Line y1={108} y2={y(props.currentScore)} stroke={props.color} strokeWidth={2} />
        <Circle cy={y(props.currentScore)} r={4} fill={props.color} />
      </G>
    );
  };

  const LineShape = ({ line }: any) => <Path d={line} stroke={props.color} strokeWidth={2} fill={'none'} />;

  return (
    <View>
      <Text category="c1" appearance="hint" style={styles.scoreName}>
        {sh.capitalize(props.type)} score
      </Text>
      <Text category="h6" style={styles.score}>
        {props.score}%
      </Text>
      <View style={styles.container}>
        <AreaChart
          style={styles.areaChart}
          data={chartData.map((item: any) => item)}
          svg={{ fill: 'url(#gradient)' }}
          contentInset={{ top: uh.h2DP(5), bottom: uh.h2DP(30), left: uh.w2DP(5), right: uh.w2DP(5) }}
          xAccessor={({ item }) => {
            return xScale(item.date);
          }}
          yAccessor={({ item }) => item.value}
        >
          <Gradient />
          <LineShape />
          <Decorator />
          <CurrentValue />
        </AreaChart>
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
          numberOfTicks={3}
          style={styles.xAxis}
          contentInset={{ left: uh.w2DP(24), right: uh.w2DP(24) }}
          formatLabel={(value) => moment(value).format('MMM D')}
        />
      </View>
    </View>
  );
};

export default LineChart;
