import { Text, Icon, Layout, useTheme } from '@ui-kitten/components';
import React from 'react';
import { View, ViewProps, StyleSheet, TouchableOpacity } from 'react-native';
import { UIHelper as uh } from '../../../core';

//props
interface IModalHeaderProps extends ViewProps {
  caption: string;
  btnClickHandler: () => void;
}

const ModalHeader = (props: IModalHeaderProps) => {
  const th = useTheme();
  // styles
  const styleContainer = StyleSheet.create({
    container: {
      zIndex: 999,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16
    },
    header: {
      marginTop: uh.h2DP(12),
      height: 48,
      alignItems: 'center',
      flexDirection: 'row'
    },
    icon: {
      width: 20,
      height: 20,
      marginLeft: uh.w2DP(16)
    },
    captionContainer: {
      flex: 1,
      marginRight: uh.w2DP(20),
      alignContent: 'center'
    },
    caption: {
      textAlign: 'center'
    }
  });

  // view
  return (
    <Layout level="1" style={[styleContainer.container, props.style]}>
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
    </Layout>
  );
};

export default ModalHeader;
