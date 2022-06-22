import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { AppContext, RootTabParamList, TenantFeature } from '../../core';
import { StyleSheet } from 'react-native';
import { Divider, Tab, TabBar } from '@ui-kitten/components';
import * as MainScreens from '../../screens/main';
import { useIsFocused } from '@react-navigation/native';

const RootTabProfileNavigation = () => {
  // styles
  const styleContainer = StyleSheet.create({
    tabBarContainer: { height: 48 }
  });

  const appContext = React.useContext(AppContext);
  // This is set to true, as Tab need a default to render and default screen
  const [isMeProfileScreenEnable, setIsMeProfileScreenEnable] = React.useState(true);
  const [isMeAssessmentScreenEnable, setIsMeAssessmentScreenEnable] = React.useState(false);
  const [isMeBiomarkerScreenEnable, setIsMeBiomarkerScreenEnable] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFirstLoad, setIsFirstLoad] = React.useState(true);
  const isFocused = useIsFocused();

  React.useEffect(() => {
    //Update the state you want to be updated
    const tenantFeatures = appContext.getTenantFeatures();
    if (tenantFeatures != undefined && isFocused == true) {
      const isEnableAssessment =
        tenantFeatures.find((item: TenantFeature) => item.key == 'DailyMetricsReportFeature') != undefined;
      let needToReload = false;
      if (isEnableAssessment != isMeAssessmentScreenEnable) {
        needToReload = true;
      }
      const isEnableProfile =
        tenantFeatures.find((item: TenantFeature) => item.key == 'DailyMetricsReportFeature') != undefined;
      if (isEnableProfile != isMeProfileScreenEnable) {
        needToReload = true;
      }
      const isEnableBiomarker =
        tenantFeatures.find((item: TenantFeature) => item.key == 'BiomarkersAssessmentFeature') != undefined;
      if (isEnableBiomarker != isMeBiomarkerScreenEnable) {
        needToReload = true;
      }

      if (needToReload == true) {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          setIsFirstLoad(false);
        }, 1);
      }

      setIsMeAssessmentScreenEnable(isEnableAssessment);
      setIsMeProfileScreenEnable(isEnableProfile);
      setIsMeBiomarkerScreenEnable(isEnableBiomarker);
    }
  }, [isFocused, appContext, isMeAssessmentScreenEnable, isMeBiomarkerScreenEnable, isMeProfileScreenEnable]);

  if (isLoading == true && isFirstLoad == false) {
    return <></>;
  }

  // properties
  const TabTop = createMaterialTopTabNavigator<RootTabParamList>();
  const TopTabBar = ({ navigation, state }: any) => {
    return (
      <>
        <Divider />
        <TabBar
          style={styleContainer.tabBarContainer}
          selectedIndex={state.index}
          onSelect={(index) => navigation.navigate(state.routeNames[index])}
        >
          {state.routeNames.map((routeName: string, index: number) => {
            return <Tab title={routeName} key={index} />;
          })}
        </TabBar>
      </>
    );
  };

  // view
  return (
    <TabTop.Navigator tabBar={(props) => <TopTabBar {...props} />}>
      {isMeProfileScreenEnable && (
        <TabTop.Screen
          options={{ lazy: true }}
          name="Me"
          component={isMeProfileScreenEnable ? MainScreens.ProfileMeScreen : () => null}
        />
      )}
      {isMeAssessmentScreenEnable && (
        <TabTop.Screen
          options={{ lazy: true }}
          name="Assessments"
          component={isMeAssessmentScreenEnable ? MainScreens.ProfileMeAssessmentScreen : () => null}
        />
      )}
      {isMeBiomarkerScreenEnable && (
        <TabTop.Screen
          options={{ lazy: true }}
          name="My Markers"
          component={isMeBiomarkerScreenEnable ? MainScreens.ProfileMeMarkersScreen : () => null}
        />
      )}
    </TabTop.Navigator>
  );
};

export default RootTabProfileNavigation;
