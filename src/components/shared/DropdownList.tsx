import React from 'react';
import { View, StyleSheet, ViewProps, Platform } from 'react-native';
import { useTheme, Text, Divider } from '@ui-kitten/components';
import SelectDropdown from 'react-native-select-dropdown';
import { ProfileIcons } from '../profileMe/ProfileIcons';
import { UIHelper as uh } from '../../core';

//props
interface DropdownListProps extends ViewProps {
  caption: string;
  data: Array<string>;
  selectedIndex: number;
  intputColor: string;
  dropdownBGColor: string;
  selecItem: (index: number) => void;
}

export const DropdownList = (props: DropdownListProps) => {
  const th = useTheme();
  const styleContainer = StyleSheet.create({
    container: {
      width: 200
    },
    caption: { marginBottom: uh.h2DP(4) },
    dropdownStyle: {
      marginTop: Platform.OS == 'android' ? -25 : 0,
      height: props.data.length > 4 ? 48 * 4 : 48 * props.data.length,
      borderRadius: 8,
      borderColor: 'transparent',
      backgroundColor: props.dropdownBGColor
    },
    dropdownBtn: {
      width: '100%',
      backgroundColor: props.intputColor,
      left: 0,
      height: 48,
      borderRadius: 8,
      borderEndWidth: 1,
      borderColor: 'transparent',
      alignItems: 'center'
    },
    CustomizedButtonText: {
      textAlign: 'left',
      marginLeft: uh.w2DP(10),
      fontSize: 14
    },
    icon: {
      width: 20,
      height: 20
    },
    rowStyle: {
      backgroundColor: props.dropdownBGColor,
      height: 48,
      borderBottomColor: 'transparent',
      alignItems: 'center'
    },
    rowTxt: { height: 48 },
    childContainer: { flex: 1 },
    childText: { marginLeft: uh.w2DP(14), fontSize: 14, textAlign: 'left', height: 28, marginTop: uh.h2DP(10) },
    divider: { marginTop: uh.h2DP(9) }
  });

  return (
    <View style={[props.style]}>
      {props.caption != undefined && props.caption.length > 0 && (
        <Text category="label" appearance="hint" style={styleContainer.caption}>
          {' '}
          {props.caption}{' '}
        </Text>
      )}
      <SelectDropdown
        data={props.data}
        onSelect={(_selectedItem, index) => {
          props.selecItem(index);
        }}
        dropdownStyle={styleContainer.dropdownStyle}
        defaultValueByIndex={props.selectedIndex}
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
              {index < props.data.length - 1 && <Divider style={styleContainer.divider} />}
            </View>
          );
        }}
        rowStyle={styleContainer.rowStyle}
        rowTextStyle={styleContainer.rowTxt}
      />
    </View>
  );
};

export default DropdownList;
