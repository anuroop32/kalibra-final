import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppContext, RootTabParamList, TenantFeature, UIHelper as uh } from '../../core';
import { BottomNavigation, BottomNavigationTab, Divider, Text, useTheme, ModalService } from '@ui-kitten/components';
import * as MainScreens from '../../screens/main';
import { NavigationIcons } from './NavigationIcons';
import RootTabProfileNavigation from './RootTabProfileNavigation';
import HeaderRightTab from './header/HeaderRightTab';
import { useIsFocused } from '@react-navigation/native';

ModalService.setShouldUseTopInsets = true;

const RootTabNavigation = () => {
  //context
  const appContext = React.useContext(AppContext);
  //set to true to default to landing screen
  const [isHomeScreenEnable, setIsHomeScreenEnable] = React.useState(true);
  const [isChatScreenEnable, setIsChatScreenEnable] = React.useState(false);
  const [isActionScreenEnable, setIsActionScreenEnable] = React.useState(false);
  const [isMeProfileEnable] = React.useState(true);

  const isFocused = useIsFocused();
  React.useEffect(() => {
    //Update the state you want to be updated
    const tenantFeatures = appContext.getTenantFeatures();
    if (tenantFeatures != undefined) {
      setIsChatScreenEnable(
        tenantFeatures.find((item: TenantFeature) => item.key == 'ChatAndAgendaFeature') != undefined
      );
      setIsActionScreenEnable(
        tenantFeatures.find((item: TenantFeature) => item.key == 'ChatAndAgendaFeature') != undefined
      );
      setIsHomeScreenEnable(
        tenantFeatures.find((item: TenantFeature) => item.key == 'ChatAndAgendaFeature') != undefined
      );
    }
  }, [isFocused, appContext]);

  // styles
  const th = useTheme();
  const theme = appContext.getTheme();

  const condColors = {
    header: uh.getHex(th, theme, 'color-basic-100', 'color-basic-1100'),
    headerLeftTint: uh.getHex(th, theme, 'color-basic-900', 'color-basic-100')
  };

  // need to flatten style due to eva design system to be able to override
  const styleContainer = StyleSheet.create({
    bottomNavigation: {
      paddingTop: 5,
      backgroundColor: condColors.header
    },
    screenName: { paddingTop: 2 },
    iconContainer: { flexDirection: 'row', alignItems: 'center' },
    icon: { height: 22, width: 22 },
    iconProfile: { height: 24, width: 24 },
    iconTab: { paddingBottom: 24 },
    iconLeft: { marginLeft: 17 },
    iconRight: { marginRight: 18 },
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

  const tabHeaderScreenOptions = (title: string, showHeader: boolean): BottomTabNavigationOptions => {
    const tabScreenOptions: BottomTabNavigationOptions = {
      // header left tab component no longer needed
      headerLeft: () => null,
      headerRight: () => <HeaderRightTab />,
      headerShown: showHeader,
      headerTitle: () => (
        <Text status="basic" category="s2" style={styleContainer.screenName}>
          {title}
        </Text>
      ),
      headerTitleAlign: 'center',
      headerTintColor: condColors.headerLeftTint,
      headerStyle: {
        backgroundColor: condColors.header
      }
    };
    return tabScreenOptions;
  };

  const Tab = createBottomTabNavigator<RootTabParamList>();
  const BottomTabBar = ({ navigation, state }: any) => {
    return (
      <>
        <Divider />
        <BottomNavigation
          appearance={Platform.OS === 'web' ? 'noIndicatorWebOnly' : 'noIndicator'}
          selectedIndex={state.index}
          onSelect={(index) => navigation.navigate(state.routeNames[index])}
          style={{
            ...styleContainer.bottomNavigation
          }}
        >
          {state.routeNames.map((routeName: string, index: number) => {
            return (
              <BottomNavigationTab
                title={routeName === 'Profile' ? 'Me' : routeName}
                key={index}
                icon={NavigationIcons.GetIcon(routeName)}
              />
            );
          })}
        </BottomNavigation>
      </>
    );
  };

  // view
  return (
    <Tab.Navigator tabBar={(props) => <BottomTabBar {...props} />}>
      {isHomeScreenEnable && (
        <Tab.Screen
          name="Home"
          component={MainScreens.HomeScreen}
          options={{ ...tabHeaderScreenOptions('Home', true) }}
        />
      )}
      {isChatScreenEnable && (
        <Tab.Screen
          name="Kali"
          component={MainScreens.KaliChatScreen}
          options={{ ...tabHeaderScreenOptions('Kali', true) }}
        />
      )}
      {isActionScreenEnable && (
        <Tab.Screen
          name="Actions"
          component={MainScreens.ActionScreen}
          options={{ ...tabHeaderScreenOptions('Actions', true) }}
        />
      )}
      {isMeProfileEnable && (
        <Tab.Screen
          name="Profile"
          component={RootTabProfileNavigation}
          options={{ ...tabHeaderScreenOptions('Me', true) }}
        />
      )}
    </Tab.Navigator>
  );
};

export default RootTabNavigation;
