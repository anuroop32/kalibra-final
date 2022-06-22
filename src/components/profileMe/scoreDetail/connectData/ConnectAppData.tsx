import { Layout, Text } from '@ui-kitten/components';
import React from 'react';
import { ViewProps, StyleSheet } from 'react-native';
import { ConnectData, UIHelper as uh } from '../../../../core';
import ConnectedType from './ConnecType';
import BiomarkerList from './ConnectDataBiomarkerList';

//props
interface IConnectAppProps extends ViewProps {
  title: string;
  summary: string;
  data: ConnectData;
  btnSettingClickHandler: () => void;
}

const ConnectApp = (props: IConnectAppProps) => {
  // styles
  const styleContainer = StyleSheet.create({
    container: {
      marginTop: uh.h2DP(16),
      borderRadius: 8,
      paddingTop: uh.h2DP(16),
      paddingBottom: uh.h2DP(16)
    },
    title: { marginLeft: uh.w2DP(16), marginRight: uh.w2DP(16) },
    summary: { marginTop: uh.h2DP(4), marginLeft: uh.w2DP(16), marginRight: uh.w2DP(16) },
    connectType: { marginTop: uh.h2DP(16), marginLeft: uh.w2DP(16) }
  });

  // view
  return (
    <Layout level="2" style={styleContainer.container}>
      <Text category="h6" style={styleContainer.title}>
        {props.title}
      </Text>
      <Text category="c1" appearance="hint" style={styleContainer.summary}>
        {props.summary}
      </Text>

      <ConnectedType
        style={styleContainer.connectType}
        name={props.data.connectName}
        logo={props.data.connectLogo}
        btnSettingClickHandler={props.btnSettingClickHandler}
      />

      <BiomarkerList biomarkers={props.data.biomarkers} />
    </Layout>
  );
};

export default ConnectApp;
