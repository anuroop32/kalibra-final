import { Text, Icon, Layout, useTheme, Divider } from '@ui-kitten/components';
import React from 'react';
import { View, ViewProps, StyleSheet, TouchableOpacity } from 'react-native';
import { UIHelper as uh } from '../../../core';

//props
interface IActionHeaderProps extends ViewProps {
  caption: string;
  btnClickHandler: () => void;
}

const ActionHeader = (props: IActionHeaderProps) => {
  const th = useTheme();
  // styles
  const styleContainer = StyleSheet.create({
    container: {
      zIndex: 999,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16
    },
    header: {
      flexDirection: 'row',
      height: 48,
      alignItems: 'center',
      marginTop: 12
    },
    icon: {
      width: 20,
      height: 20,
      marginLeft: uh.h2DP(16)
    },
    captionContainer: {
      flex: 1,
      marginRight: uh.h2DP(20),
      alignContent: 'center'
    },
    caption: {
      textAlign: 'center'
    },
    divider: { backgroundColor: th['border-basic-color-3'] }
  });

  // view
  return (
    <Layout level="2" style={[styleContainer.container, props.style]}>
      <View style={styleContainer.header}>
        <TouchableOpacity onPress={props.btnClickHandler}>
          <Icon name="arrow-ios-back-outline" style={styleContainer.icon} fill={th['color-basic-600']} />
        </TouchableOpacity>
        <View style={styleContainer.captionContainer}>
          <Text category="s2" style={styleContainer.caption}>
            {props.caption}
          </Text>
        </View>
      </View>
      <Divider style={styleContainer.divider} />
    </Layout>
  );
};

export default ActionHeader;
