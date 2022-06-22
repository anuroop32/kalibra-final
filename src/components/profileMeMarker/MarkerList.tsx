import React from 'react';
import { ViewProps, StyleSheet, View, ScrollView } from 'react-native';
import MarkerListItem from './MarkerListItem';
import { UIHelper as uh } from '../../core';

const pillars = [
  { name: 'All my marker', type: 'all', percent: 54 },
  { name: 'Reflect', type: 'reflect', percent: 54 },
  { name: 'Rest', type: 'rest', percent: 54 },
  { name: 'Nourish', type: 'nourish', percent: 54 },
  { name: 'Connect', type: 'connect', percent: 54 },
  { name: 'Move', type: 'move', percent: 54 },
  { name: 'Grow', type: 'grow', percent: 54 }
];
//props
interface IMakerListProps extends ViewProps {
  btnClickHandler: (name: string) => void;
  markerName: string;
}

const MakerList = (props: IMakerListProps) => {
  // styles
  const styleContainer = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center' },
    item: { marginTop: uh.h2DP(8), marginRight: uh.w2DP(4) }
  });

  const [selectedMarker, setSelectedMarker] = React.useState('All my marker');

  const selectMarker = (name: string) => {
    setSelectedMarker(name);
    props.btnClickHandler(name);
  };

  const renderItems = () => {
    return pillars.map((item, index) => {
      return (
        <MarkerListItem
          style={styleContainer.item}
          key={`item-index-${index}`}
          name={item.name}
          type={item.type}
          isSelected={item.name == selectedMarker ? true : false}
          btnClickHandler={() => {
            selectMarker(item.name);
          }}
        />
      );
    });
  };

  // view
  return (
    <View style={[styleContainer.container, props.style]}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={styleContainer.container}>{renderItems()}</View>
      </ScrollView>
    </View>
  );
};

export default MakerList;
