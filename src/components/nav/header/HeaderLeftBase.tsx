import React from 'react';
import { TouchableOpacity, StyleSheet, ViewProps } from 'react-native';
import { Icon, Text, useTheme } from '@ui-kitten/components';
// styles
const styleContainer = StyleSheet.create({
  backNavContainer: { flexDirection: 'row' },
  backIcon: { width: 20, height: 20, marginLeft: 16 },
  backScreenName: { paddingTop: 2 }
});

interface IHeaderLeftBaseProps extends ViewProps {
  title: string;
  btnClickHandler: () => void;
}

// properties
const HeaderLeftBase = (props: IHeaderLeftBaseProps) => {
  const th = useTheme();
  return (
    <TouchableOpacity style={styleContainer.backNavContainer} onPress={props.btnClickHandler}>
      <Icon name="arrow-ios-back-outline" fill={th['color-primary-500']} style={styleContainer.backIcon} />
      <Text status="primary" category="s2" style={styleContainer.backScreenName}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

export default HeaderLeftBase;
