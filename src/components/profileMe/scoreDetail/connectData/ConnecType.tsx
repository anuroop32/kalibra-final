import { Layout, Text, Icon, useTheme } from '@ui-kitten/components';
import React from 'react';
import { ViewProps, StyleSheet, TouchableOpacity } from 'react-native';
import { UIHelper as uh } from '../../../../core';
import { ProfileIcons } from '../../ProfileIcons';

//props
interface IConnectedTypeProps extends ViewProps {
  btnSettingClickHandler: () => void;
  name: string;
  logo: string;
}

const ConnectedType = (props: IConnectedTypeProps) => {
  const th = useTheme();
  // styles
  const styleContainer = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center'
    },

    appleWatch: {
      width: 64,
      height: 14,
      marginLeft: uh.w2DP(16)
    },
    headspace: { width: 72, height: 16, marginLeft: uh.w2DP(16) },
    setting: { width: 16, height: 16, marginLeft: uh.w2DP(17) }
  });

  function renderLogo() {
    switch (props.logo) {
      case 'apple-watch':
        return <ProfileIcons.AppleWatchIcon style={styleContainer.appleWatch} />;
      case 'headspace':
        return <ProfileIcons.HeadspaceIcon style={styleContainer.headspace} />;
        break;
      default:
        return <></>;
    }
  }

  // view
  return (
    <Layout level="2" style={[styleContainer.container, props.style]}>
      <Text category="c2">{props.name}</Text>
      {renderLogo()}
      <TouchableOpacity onPress={props.btnSettingClickHandler}>
        <Icon name="settings-outline" style={styleContainer.setting} fill={th['color-basic-500']} />
      </TouchableOpacity>
    </Layout>
  );
};

export default ConnectedType;
