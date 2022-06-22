import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Layout } from '@ui-kitten/components';
import { UserInfo, KalibraScore } from '../../components/profileMe';
import { RootTabScreenProps } from '../../core';
import RefreshControl from 'src/components/shared/RefreshControl';

const kalibraScoreSummaryText = 'This is a visual representation and breakdown of your health scores.';
const learnMoreAccuracyText = 'Learn more about score accuracy';

const ProfileMeScreen = ({ navigation }: RootTabScreenProps<'Home'>) => {
  //styles
  const styleContainer = StyleSheet.create({
    screenContainer: { flex: 1, padding: 16 },
    safeAreaView: { flex: 1 },
    backdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
  });

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

  const scoreHistoryClickHandler = () => {};

  //view
  return (
    <ScrollView
      alwaysBounceVertical={true}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <Layout level="2" style={[styleContainer.screenContainer]}>
        <SafeAreaView>
          <UserInfo />
          <KalibraScore
            learnMoreClickHandler={learnMoreClickHandler}
            scoreHistoryClickHandler={scoreHistoryClickHandler}
            kalibraScoreSummaryText={kalibraScoreSummaryText}
            learnMoreAccuracyText={learnMoreAccuracyText}
            refreshing={refreshing}
            finishRefreshing={finishRefreshing}
          />
        </SafeAreaView>
      </Layout>
    </ScrollView>
  );
};

export default ProfileMeScreen;
