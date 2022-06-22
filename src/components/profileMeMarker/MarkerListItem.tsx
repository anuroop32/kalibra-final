import { useTheme } from '@ui-kitten/components';
import React from 'react';
import { ViewProps, StyleSheet, View, TouchableOpacity } from 'react-native';
import RoundButton from './RoundButton';
import { PillarIcon } from '../home';

//props
interface IMarkerListItemProps extends ViewProps {
  btnClickHandler: (type: string) => void;
  type: string;
  name: string;
  isSelected: boolean;
}

const MarkerListItem = (props: IMarkerListItemProps) => {
  const th = useTheme();
  // styles
  const styleContainer = StyleSheet.create({
    selectedContainer: {
      backgroundColor:
        props.type == 'all' ? th['color-primary-transparent-400'] : th[`color-${props.type}-200-transparent`],
      borderRadius: 25,
      alignItems: 'center',
      padding: 4,
      flexWrap: 'wrap',
      flexDirection: 'column'
    }
  });

  return (
    <TouchableOpacity
      onPress={() => {
        props.btnClickHandler(props.type);
      }}
    >
      <View style={[props.isSelected == true ? styleContainer.selectedContainer : undefined, props.style]}>
        {props.type == 'all' ? (
          <RoundButton name={props.name} />
        ) : (
          <PillarIcon type={props.type} name={props.name} size="large" />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default MarkerListItem;
