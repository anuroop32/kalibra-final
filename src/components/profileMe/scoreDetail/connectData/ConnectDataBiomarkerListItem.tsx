import { Text } from '@ui-kitten/components';
import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { Biomarker, UIHelper as uh } from '../../../../core';
//props
interface IConnectedDataBiomarkerListItemProps extends ViewProps {
  biomarker: Biomarker;
}

const ConnectedDataBiomarkerListItem = (props: IConnectedDataBiomarkerListItemProps) => {
  // styles
  const styles = StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    name: { marginTop: uh.h2DP(16) },
    item: { justifyContent: 'flex-start', width: '50%', marginTop: uh.h2DP(16) }
  });

  // render biomarker's data
  const renderData = () => {
    if (props.biomarker != undefined) {
      return Object.keys(props.biomarker.data).map((key, index) => {
        const value = props.biomarker.data[key];
        return (
          <View key={`biomarker-item-${index}`} style={styles.item}>
            <Text category="c1" appearance="hint">
              {key}
            </Text>
            <Text category="h6">{value}</Text>
          </View>
        );
      });
    }
  };

  // view
  return (
    <View style={[props.style]}>
      {props.biomarker.name != undefined && (
        <Text category="s1" style={styles.name}>
          {props.biomarker.name}
        </Text>
      )}
      <View style={styles.itemContainer}>{renderData()}</View>
    </View>
  );
};

export default ConnectedDataBiomarkerListItem;
