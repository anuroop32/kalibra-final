import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Icon, useTheme } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';

// styles
const styleContainer = StyleSheet.create({
  icon: { height: 22, width: 22 },
  iconProfile: { height: 24, width: 24 },
  iconRight: { marginRight: 18 },
  iconContainer: { flexDirection: 'row', alignItems: 'center' },
  modalContainer: { flex: 1, justifyContent: 'space-evenly', alignItems: 'center' },
  modalCardContainer: {
    minHeight: 160,
    width: '90%',
    maxWidth: 320
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  }
});

const HeaderRightTab = () => {
  const tabNavigator: any = useNavigation();
  const th = useTheme();

  // const [userProfileToggle, setUserProfileToggle] = React.useState<boolean>(false);
  // let modalID = '';
  // const renderModalContentElement = () => {
  //   return (
  //     <View style={styleContainer.modalContainer}>
  //       <Card style={styleContainer.modalCardContainer} disabled={true}>
  //         <Text style={{ textAlign: 'center' }}>Please confirm to change your role and context within Kalibra</Text>
  //         <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', paddingVertical: 20 }}>
  //           <Button
  //             size="medium"
  //             onPress={() => {
  //               setUserProfileToggle(!userProfileToggle);
  //               ModalService.hide(modalID);
  //             }}
  //           >
  //             Confirm
  //           </Button>
  //           <Button
  //             size="medium"
  //             status="info"
  //             onPress={() => {
  //               ModalService.hide(modalID);
  //             }}
  //           >
  //             Cancel
  //           </Button>
  //         </View>
  //       </Card>
  //     </View>
  //   );
  // };

  return (
    <View style={styleContainer.iconContainer}>
      {/* {appContext.getIsMultipleUser() && (
        <TouchableOpacity onPress={() => showModal()}>
          {userProfileToggle ? (
            <Icon
              name="people-outline"
              fill={th['color-primary-500']}
              style={[styleContainer.iconProfile, styleContainer.iconRight]}
            />
          ) : (
            <Icon
              name="person-outline"
              fill={th['color-primary-500']}
              style={[styleContainer.iconProfile, styleContainer.iconRight]}
            />
          )}
        </TouchableOpacity>
      )} */}
      <TouchableOpacity onPress={() => tabNavigator.navigate('Settings')}>
        <Icon
          name="settings-2-outline"
          fill={th['color-primary-500']}
          style={[styleContainer.icon, styleContainer.iconRight]}
        />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderRightTab;
