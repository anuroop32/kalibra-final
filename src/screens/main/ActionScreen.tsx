import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Layout, Text, ButtonGroup, Button, useTheme } from '@ui-kitten/components';
import { mainStyles } from './_mainStyles';
import { ActionList } from '../../components/action';
import { RootTabScreenProps, UIHelper as uh } from '../../core';
import RefreshControl from 'src/components/shared/RefreshControl';

const noUpcomingActionsMsg = 'Kali will chat to you about today’s tasks soon.';
const clearedAllActionsMsg = 'All clear, enjoy your';
const noActionsMsg = 'No actions for now, have a restful';
const dontLikeMsg = 'I don’t like this action';

const ActionScreen = ({ navigation }: RootTabScreenProps<'Actions'>) => {
  const th = useTheme();
  const [isTodayActions, setIsTodayActions] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  //styles
  const styleContainer = StyleSheet.create({
    screenContainer: { flex: 1 },
    safeAreaView: { flex: 1 },
    btnSetup: { position: 'absolute', top: 0, right: 0 },
    list: { marginTop: uh.h2DP(20), flexDirection: 'column' },
    btnBackground: { backgroundColor: isTodayActions == true ? th['color-primary-500'] : 'grey' },
    btnWeekBackground: { backgroundColor: isTodayActions == false ? th['color-primary-500'] : 'grey' }
  });

  const chatWithKalibra = () => {
    navigation.navigate('Kali');
  };

  const changeActionType = (type: number) => {
    setIsTodayActions(type == 0);
  };

  const finishRefreshing = () => {
    setRefreshing(false);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
  }, []);

  //view
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Layout level="2" style={[styleContainer.screenContainer, mainStyles.mainScreenContainer]}>
        <SafeAreaView style={styleContainer.screenContainer}>
          <Text category="h4">{isTodayActions == true ? 'Today' : 'Upcoming'}</Text>
          <ButtonGroup size="small" style={styleContainer.btnSetup}>
            <Button style={styleContainer.btnBackground} onPress={() => changeActionType(0)}>
              Day
            </Button>
            <Button style={styleContainer.btnWeekBackground} onPress={() => changeActionType(1)}>
              Week
            </Button>
          </ButtonGroup>
          <ActionList
            style={styleContainer.list}
            type={isTodayActions ? 'today' : 'upcoming'}
            chatWithKalibraClick={chatWithKalibra}
            clearedAllActionsMsg={clearedAllActionsMsg}
            noUpcomingActionsMsg={noUpcomingActionsMsg}
            noActionsMsg={noActionsMsg}
            dontLikeMsg={dontLikeMsg}
            refreshing={refreshing}
            finishRefreshing={finishRefreshing}
          />
        </SafeAreaView>
      </Layout>
    </ScrollView>
  );
};

export default ActionScreen;
