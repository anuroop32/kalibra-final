import React from 'react';
import { View, StyleSheet, ViewProps, Platform } from 'react-native';
import { useTheme, Text, Divider } from '@ui-kitten/components';
import SelectDropdown from 'react-native-select-dropdown';
import { ProfileIcons } from '../profileMe/ProfileIcons';
import { AppContext, UIHelper as uh } from '../../core';

//props
interface TenantDropdownListProps extends ViewProps {
  caption: string;
  data: Array<string>;
  selectedIndex: number;
  selecItem: (index: number) => void;
}

export const TenantDropdownList = (props: TenantDropdownListProps) => {
  //const data = ['Most recent', 'Alphabetical', 'Oldest'];
  const th = useTheme();
  const ctTheme = React.useContext(AppContext).getTheme();
  const condColors = {
    input: uh.getHex(th, ctTheme, 'color-basic-100', 'color-basic-1100')
  };

  const styleContainer = StyleSheet.create({
    container: {
      width: 200
    },
    caption: { marginBottom: uh.h2DP(4) },
    dropdownStyle: {
      marginTop: Platform.OS == 'android' ? -25 : 0,
      height: 48 * props.data.length,
      borderRadius: 8,
      borderColor: 'transparent',
      backgroundColor: uh.getHex(th, ctTheme, 'color-basic-100', 'color-basic-900')
    },
    dropdownBtn: {
      width: '100%',
      backgroundColor: condColors.input,
      left: 0,
      height: 48,
      borderRadius: 8
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
      backgroundColor: uh.getHex(th, ctTheme, 'color-basic-100', 'color-basic-900'),
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
      {props.caption != undefined && (
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

export default TenantDropdownList;
