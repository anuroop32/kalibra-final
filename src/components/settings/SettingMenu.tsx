import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MenuItem, Text, RadioGroup, Radio, Layout, Toggle, Divider, Button } from '@ui-kitten/components';
import { SettingsIcons } from './SettingsIcons';
import { AppContext } from '../../core';
import { getValue, setValue } from '../../api/storage';
import { isPushNotificationsEnabled, isPushNotificationsSupported, setSubscription } from '../../api/push';

//props

enum ThemeTo {
  System = 0,
  Light,
  Dark
}

interface ISettingsProps extends ViewProps {
  signOutHandler: () => void;
  profileHandler: () => void;
  feedbackHandler: () => void;
  connectedDeviceskHandler: () => void;
  aboutUsHandler: () => void;
}

const SettingMenu = (props: ISettingsProps) => {
  // context
  const appContext = React.useContext(AppContext);

  //styles
  const styleContainer = StyleSheet.create({
    settingContainer: { flex: 1 },
    scrollView: { flex: 1 },
    propertyContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      width: '100%',
      justifyContent: 'space-between',
      paddingVertical: 8,
      paddingHorizontal: 12
    },
    propertyContainerText: { paddingLeft: 5 },
    themeContainerRadio: { flexDirection: 'row' },
    buttonContainer: {
      marginTop: 70,
      flexDirection: 'row',
      justifyContent: 'center'
    },
    logOutButton: { width: 110 }
  });

  //properties
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [enableNotifications, setEnableNotifications] = React.useState<boolean>(false);
  const ForwardIcon = SettingsIcons.ForwardIcon;

  //handlers
  const onRadioChange = async (index: any) => {
    setSelectedIndex(index);
    setValue('themeIndex', index.toString());
    appContext.setTheme(index > 0 ? ThemeTo[index].toLowerCase() : undefined);
  };
  const onCheckedChange = async (isChecked: boolean) => {
    setEnableNotifications(isChecked);
    setSubscription(isChecked);
    // await setValue('notification', isChecked == true ? 'true' : 'false');
  };

  const [pushNotificationsSupported, setPushNotificationsSupported] = React.useState<boolean>(false);

  const getPushNotificationSettings = async () => {
    const pushSupported: boolean = await isPushNotificationsSupported();
    setPushNotificationsSupported(pushSupported);

    if (pushSupported) {
      const pushEnabled: boolean = await isPushNotificationsEnabled();
      setEnableNotifications(pushEnabled);
    }
  };

  const loadData = React.useCallback(async () => {
    // const noti = await getValue('notification');
    // setEnableNotifications(noti == 'true');
    const themeIndex = await getValue('themeIndex');
    setSelectedIndex(Number(themeIndex));
    await getPushNotificationSettings();
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  //view
  return (
    <View style={[styleContainer.settingContainer, props.style]}>
      <ScrollView alwaysBounceVertical={true} style={styleContainer.scrollView}>
        <Divider />
        <MenuItem title="Profile" accessoryRight={ForwardIcon} onPress={() => props.profileHandler()} />
        <Divider />
        <Layout level="1" style={styleContainer.propertyContainer}>
          <Text status="basic" category="s2" style={styleContainer.propertyContainerText}>
            Theme
          </Text>
          <RadioGroup style={styleContainer.themeContainerRadio} selectedIndex={selectedIndex} onChange={onRadioChange}>
            <Radio status="success" appearance="settings">
              {ThemeTo[0].toString()}
            </Radio>
            <Radio status="success" appearance="settings">
              {ThemeTo[1].toString()}
            </Radio>
            <Radio status="success" appearance="settings">
              {ThemeTo[2].toString()}
            </Radio>
          </RadioGroup>
        </Layout>
        <Divider />
        {pushNotificationsSupported == true && (
          <Layout level="1" style={styleContainer.propertyContainer}>
            <Text status="basic" category="s2" style={styleContainer.propertyContainerText}>
              Notifications
            </Text>
            <Toggle appearance="settings" status="success" checked={enableNotifications} onChange={onCheckedChange}>
              {''}
            </Toggle>
          </Layout>
        )}
        <Divider />
        <MenuItem title="Send us feedback" accessoryRight={ForwardIcon} onPress={() => props.feedbackHandler()} />
        <Divider />
        <MenuItem
          title="Connected Devices"
          accessoryRight={ForwardIcon}
          onPress={() => props.connectedDeviceskHandler()}
        />
        <Divider />
        <MenuItem title="About" accessoryRight={ForwardIcon} onPress={() => props.aboutUsHandler()} />
        <Divider />
        <View style={styleContainer.buttonContainer}>
          <Text status="basic" category="s2" style={styleContainer.propertyContainerText}></Text>

          <Button
            size="medium"
            status="primary"
            style={styleContainer.logOutButton}
            onPress={() => props.signOutHandler()}
          >
            Log Out
          </Button>

          {/* <Button status="danger" >
            Delete my data
          </Button> */}
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingMenu;
