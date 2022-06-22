import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Icon, useTheme } from '@ui-kitten/components';
import { AppContext } from '../../../core';

// styles
const styleContainer = StyleSheet.create({
  icon: { height: 22, width: 22 },
  iconLeft: { marginLeft: 17 }
});

// properties
const HeaderLeftTab = () => {
  const appContext = React.useContext(AppContext);
  const th = useTheme();

  return (
    <TouchableOpacity onPress={() => appContext.setTheme('light')}>
      <Icon
        name="book-open-outline"
        fill={th['color-primary-500']}
        style={[styleContainer.icon, styleContainer.iconLeft]}
      />
    </TouchableOpacity>
  );
};

export default HeaderLeftTab;
