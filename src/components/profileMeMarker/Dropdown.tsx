import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { useTheme, Text, Divider } from '@ui-kitten/components';
import SelectDropdown from 'react-native-select-dropdown';
import { ProfileIcons } from '../profileMe/ProfileIcons';
import { AppContext, UIHelper as uh } from '../../core';

//props
interface DropdownProps extends ViewProps {
  changeSortedType: (index: number) => void;
}

export const Dropdown = (props: DropdownProps) => {
  const data = ['Most recent', 'Alphabetical', 'Oldest'];
  const th = useTheme();
  const ct = React.useContext(AppContext).getTheme();
  const styleContainer = StyleSheet.create({
    container: {
      width: 200
    },
    dropdownStyle: {
      height: 108,
      width: 102,
      marginLeft: uh.w2DP(9),
      borderRadius: 8,
      borderColor: 'transparent',
      backgroundColor: uh.getHex(th, ct, 'color-basic-100', 'color-basic-900')
    },
    dropdownBtn: {
      width: 110,
      backgroundColor: 'transparent',
      left: uh.w2DP(-8),
      height: 36
    },
    CustomizedButtonText: {
      textAlign: 'center'
    },
    icon: {
      width: 20,
      height: 20
    },
    rowStyle: {
      backgroundColor: uh.getHex(th, ct, 'color-basic-100', 'color-basic-900'),
      height: 36,
      borderBottomColor: 'transparent',
      alignItems: 'center'
    },
    rowTxt: { height: 36 },
    childContainer: { flex: 1 },
    childText: { textAlign: 'center', height: 16, marginTop: uh.h2DP(10) },
    divider: { marginTop: uh.h2DP(9) }
  });

  return (
    <View>
      <SelectDropdown
        data={data}
        onSelect={(_selectedItem, index) => {
          props.changeSortedType(index);
        }}
        dropdownStyle={styleContainer.dropdownStyle}
        defaultValueByIndex={0}
        buttonStyle={styleContainer.dropdownBtn}
        renderDropdownIcon={(isOpened) => {
          return isOpened ? (
            <ProfileIcons.UpIcon style={styleContainer.icon} fill={th['color-basic-600']} />
          ) : (
            <ProfileIcons.DownIcon style={styleContainer.icon} fill={th['color-basic-600']} />
          );
        }}
        buttonTextAfterSelection={(selectedItem) => {
          return selectedItem;
        }}
        rowTextForSelection={(item) => {
          return item;
        }}
        renderCustomizedButtonChild={(selectedItem) => {
          return (
            <Text style={styleContainer.CustomizedButtonText} category="c2">
              {selectedItem}
            </Text>
          );
        }}
        renderCustomizedRowChild={(item, index) => {
          return (
            <View style={styleContainer.childContainer}>
              <Text key={`index-${index}`} style={styleContainer.childText} category="c2">
                {item}
              </Text>
              {index < data.length - 1 && <Divider style={styleContainer.divider} />}
            </View>
          );
        }}
        rowStyle={styleContainer.rowStyle}
        rowTextStyle={styleContainer.rowTxt}
      />
    </View>
  );
};

export default Dropdown;
