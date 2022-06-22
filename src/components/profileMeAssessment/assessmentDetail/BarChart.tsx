import React from 'react';
import { useTheme } from '@ui-kitten/components';
import { Svg, G, Rect, Circle, Text as SvgText } from 'react-native-svg';
import * as d3 from 'd3';
import { UIHelper as uh } from '../../../core';
import { ViewProps, View, LayoutChangeEvent } from 'react-native';
import { NewHealthMarker } from 'src/core/types/HealthMarkerReport';

const GRAPH_BAR_HEIGHT = 8;

//props
interface IBarChartProps extends ViewProps {
  currentValue: number;
  healthMarker: NewHealthMarker;
}

const BarChart = (props: IBarChartProps) => {
  const th = useTheme();
  const [width, setWidth] = React.useState(uh.currentViewPort());
  const graphHeight = 48;
  const graphWidth = width;
  const graphData = [];
  for (const category of props.healthMarker.categories) {
    const data = {
      label: category.rangeLabel != '' ? category.rangeLabel : category.rangeLabelAlt,
      value: Number(category.maximum) - Number(category.minimum),
      desciption: '',
      color: category.color
    };
    graphData.push(data);
  }
  const spacingInner = 2.0;
  const onLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  // X scale linear
  const xDomain = [0, graphData.reduce((total: number, thing: any) => total + thing.value, 0)];
  const xRange = [0, graphWidth - spacingInner * (graphData.length - 1)];
  const x = d3.scaleLinear().domain(xDomain).range(xRange);
  let value = 0;

  const currentValue = props.currentValue - Number(props.healthMarker.categories[0].minimum);

  return (
    <View style={[props.style]} onLayout={(event) => onLayout(event)}>
      <Svg width={graphWidth} height={graphHeight} fill="#c4c4c4">
        <G y={20}>
          {/* bars */}
          {graphData.map((item: any, index: number) => {
            const oldValue = value;
            value += item.value;
            const barWidth = x(item.value);
            const barX = x(oldValue) + index * spacingInner * 1.0;
            const textX = barX + barWidth / 2;
            return (
              <G key={`barchart-${index}`}>
                {/* description */}
                <SvgText
                  x={textX}
                  y={-15}
                  scale={1}
                  fill={th['text-hint-color']}
                  fontSize={10}
                  fontFamily={'Poppins-Regular'}
                  textAnchor={'middle'}
                  alignmentBaseline={'central'}
                >
                  {item.desciption}
                </SvgText>

                <Rect
                  key={item.label}
                  y={0}
                  x={barX}
                  rx={4}
                  ry={4}
                  width={barWidth}
                  height={GRAPH_BAR_HEIGHT}
                  fill={item.color}
                />
                {/* label */}
                <SvgText
                  x={textX}
                  y={21}
                  scale={1}
                  fill={th['text-hint-color']}
                  fontSize={10}
                  textAnchor={'middle'}
                  fontFamily={'Poppins-Regular'}
                  alignmentBaseline={'central'}
                >
                  {item.label}
                </SvgText>
              </G>
            );
          })}
          {/* circle */}
          <Circle cy={4} cx={x(currentValue)} r={8} fill={th['color-primary-500']} stroke={'white'} strokeWidth={2} />
        </G>
      </Svg>
    </View>
  );
};

export default BarChart;
