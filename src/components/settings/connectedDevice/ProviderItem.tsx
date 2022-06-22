import React from 'react';
import { View, StyleSheet, ViewProps, TouchableOpacity, Image } from 'react-native';
import { Text, Toggle, Divider, Icon, useTheme } from '@ui-kitten/components';
import { TerraProvider } from 'src/core/types/TerraProvider';

interface IProviderItemProps extends ViewProps {
  data: TerraProvider;
  showHint: () => void;
  btnToggleClick: (isOn: boolean) => void;
}

const ProviderItem = (props: IProviderItemProps) => {
  const th = useTheme();

  //styles
  const styleContainer = StyleSheet.create({
    propertyContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      justifyContent: 'flex-start',
      paddingVertical: 10
    },
    propertyContainerText: { marginLeft: 8, width: '70%' },
    themeContainerRadio: { flexDirection: 'row' },
    buttonContainer: {
      marginTop: 70,
      flexDirection: 'row',
      justifyContent: 'center'
    },
    infoIconContainer: { width: 20, height: 20, position: 'absolute', right: 0, top: 20 },
    infoIcon: { width: 20, height: 20 },
    logo: { width: 40, height: 40, borderRadius: 6 }
  });

  const isConnected = props.data.connectedDate != null && props.data.disconnectedDate == null;
  const isWasConnected = props.data.connectedDate != null && props.data.disconnectedDate != null;
  const iconColor = isConnected == true ? th['color-info-500'] : th['color-warning-500'];
  return (
    <>
      <View style={styleContainer.propertyContainer}>
        <Image style={styleContainer.logo} source={{ uri: props.data.logo }} />
        <Text status="basic" category="s2" style={styleContainer.propertyContainerText}>
          {props.data.provider_name}
        </Text>
        <Toggle
          status="success"
          style={{ position: 'absolute', right: 30 }}
          checked={isConnected}
          onChange={props.btnToggleClick}
        />
        {(isConnected == true || isWasConnected == true) && (
          <TouchableOpacity onPress={props.showHint} style={styleContainer.infoIconContainer}>
            <Icon name="info-outline" fill={iconColor} style={styleContainer.infoIcon}></Icon>
          </TouchableOpacity>
        )}
      </View>
      <Divider />
    </>
  );
};

export default ProviderItem;
