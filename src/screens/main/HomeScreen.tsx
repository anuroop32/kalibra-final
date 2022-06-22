import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, Platform, Linking } from 'react-native';
import { Layout } from '@ui-kitten/components';
import { mainStyles } from './_mainStyles';
import { KaliNBAQuote, NextAction, FocusWeek } from '../../components/home';
import { UIHelper as uh, RootTabScreenProps, AppContext, TenantFeature } from '../../core';
import RefreshControl from 'src/components/shared/RefreshControl';

const dontLikeMsg = 'I don’t like this action';
const HomeScreen = ({ navigation }: RootTabScreenProps<'Home'>) => {
  const appContext = React.useContext(AppContext);
  //styles
  const styleContainer = StyleSheet.create({
    screenContainer: { flex: 1 },
    safeAreaView: { flex: 1 },
    button: {
      minWidth: 168,
      marginTop: uh.h2DP(16),
      padding: 0,
      marginHorizontal: 0,
      alignSelf: 'center'
    },
    learnMore: { marginTop: uh.h2DP(40) }
  });

  //properties and handlers
  const btnClickHandler = () => {
    navigation.navigate('Kali');
  };

  //properties and handlers
  const btnTellMoreClick = () => {
    navigation.navigate('Kali');
  };

  //properties and handlers
  //TO-DO : should set strongly type for navigation parameters
  const nextActionItemClick = (id: number) => {
    navigation.navigate('Actions', { id: id } as any);
  };

  //properties and handlers
  const allNxtActionsBtnClick = () => {
    navigation.navigate('Actions');
  };

  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
  }, []);

  const finishRefreshing = () => {
    setRefreshing(false);
  };

  const learnMoreClickHandler = () => {
    navigation.navigate('Kali');
  };

  const onLinkPress = (url: string): boolean => {
    if (url === undefined) {
      return false;
    }
    const index = url.indexOf('kalibra.ai/');
    if (index > -1) {
      const routeName = url.substr(index + 11);
      navigation.navigate(routeName);
    } else {
      if (Platform.OS === 'web') {
        // Open link in new tab
        window.open(url, '_blank');
      } else {
        Linking.openURL(url);
      }
    }
    return true;
  };

  const tenantFeatures = appContext.getTenantFeatures();
  const enableChatAndAgenda =
    tenantFeatures.find((item: TenantFeature) => item.key == 'ChatAndAgendaFeature') != undefined;

  //view
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      alwaysBounceVertical={true}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Layout level="2" style={[styleContainer.screenContainer, mainStyles.mainScreenContainer]}>
        <SafeAreaView style={styleContainer.screenContainer}>
          <KaliNBAQuote btnMessage="Talk to Kali" btnHandler={btnClickHandler} onLinkPress={onLinkPress} />
          {enableChatAndAgenda == true && (
            <NextAction
              title="Next action to tick off"
              btnMessage="View all actions"
              btnHandler={allNxtActionsBtnClick}
              itemClick={nextActionItemClick}
              dontLikeMsg={dontLikeMsg}
              chatWithKalibraClick={btnTellMoreClick}
              refreshing={refreshing}
              finishRefreshing={finishRefreshing}
            ></NextAction>
          )}
          <FocusWeek
            title="Focus for the week"
            summary="These are the pillars you’re focusing on this week."
            learnMoreClickHandler={learnMoreClickHandler}
            refreshing={refreshing}
            finishRefreshing={finishRefreshing}
          ></FocusWeek>
          {/* <LearnMore
            style={styleContainer.learnMore}
            btnMessage="Tell me more"
            btnHandler={btnTellMoreClick}
            messages={[
              'An opportunity to have a quote or short fact that relates to the current pillars the user is focused on.'
            ]}
          /> */}
        </SafeAreaView>
      </Layout>
    </ScrollView>
  );
};

export default HomeScreen;
