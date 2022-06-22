import { Divider } from '@ui-kitten/components';
import React from 'react';
import { ViewProps, StyleSheet, View } from 'react-native';
import { UIHelper as uh, Biomarker } from '../../../../core';
import ConnectedDataBiomarkerListItem from './ConnectDataBiomarkerListItem';

//props
interface IConnectedDataBiomarkerListProps extends ViewProps {
  biomarkers: Array<Biomarker>;
}

const ConnectedDataBiomarkerList = (props: IConnectedDataBiomarkerListProps) => {
  // styles
  const styles = StyleSheet.create({
    divider: {
      marginTop: uh.h2DP(16)
    },
    list: {
      marginLeft: uh.w2DP(16),
      marginRight: uh.w2DP(16)
    }
  });

  // render list of pillars
  const renderData = () => {
    if (props.biomarkers != undefined) {
      return props.biomarkers.map((item, index) => {
        return (
          <View key={`biomarker-${index}`}>
            <Divider style={styles.divider} />
            <ConnectedDataBiomarkerListItem biomarker={item} style={styles.list} />
          </View>
        );
      });
    }
  };

  // view
  return <View>{renderData()}</View>;
};

export default ConnectedDataBiomarkerList;
