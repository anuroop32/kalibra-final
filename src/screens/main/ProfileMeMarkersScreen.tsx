import React from 'react';
import { SafeAreaView, StyleSheet, View, ScrollView } from 'react-native';
import { Layout, Input, Text, Button } from '@ui-kitten/components';
import { mainStyles } from './_mainStyles';
import { ProfileIcons } from '../../components/profileMe/ProfileIcons';
import { Dropdown, MarkerList, BiomarkerList } from '../../components/profileMeMarker';
import { RootStackScreenProps, UIHelper as uh } from '../../core';
import RefreshControl from 'src/components/shared/RefreshControl';

const ProfileMeMarkersScreen = ({ navigation }: RootStackScreenProps<'Main'>) => {
  //styles
  const styleContainer = StyleSheet.create({
    screenContainer: { flex: 1 },
    safeAreaView: { flex: 1 },
    learnMore: { marginTop: uh.h2DP(16) },
    searchText: { height: 40, flex: 1 },
    searchArea: { flexDirection: 'row', marginTop: uh.h2DP(12), alignItems: 'center' },
    loadMore: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: uh.h2DP(20),
      alignContent: 'center',
      alignSelf: 'center'
    },
    noMoreData: { marginTop: uh.h2DP(20), textAlign: 'center' }
  });

  const [searchText, setSearchText] = React.useState('');
  const [sortedType, setSortedType] = React.useState(0);
  const [markerName, setMarkerName] = React.useState('All my marker');
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [isLoadMore, setIsLoadMore] = React.useState<boolean>(false);
  const [canLoadMore, setCanLoadMore] = React.useState<boolean>(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    if (canLoadMore == false) {
      setCanLoadMore(true);
    }
  }, [canLoadMore]);

  const finishRefreshing = () => {
    setRefreshing(false);
  };

  const markerClick = (name: string) => {
    setMarkerName(name);
  };

  const changeSortedType = (type: number) => {
    setSortedType(type);
  };

  // const btnTellMoreClick = () => { };

  const btnDetailAssessmentClick = (assessmentId: string) => {
    navigation.navigate('AssessmentDetail' as any, {
      assessmentId: assessmentId
    });
  };

  //view
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Layout level="2" style={[styleContainer.screenContainer, mainStyles.mainScreenContainer]}>
        <SafeAreaView style={styleContainer.screenContainer}>
          <Text category="h4">My markers</Text>
          <MarkerList btnClickHandler={markerClick} markerName={markerName} />
          <View style={styleContainer.searchArea}>
            <Dropdown changeSortedType={changeSortedType} />
            <Input
              style={styleContainer.searchText}
              value={searchText}
              placeholder="Search..."
              accessoryRight={<ProfileIcons.SearchIcon />}
              onChangeText={(nextValue) => setSearchText(nextValue)}
            />
          </View>
          <BiomarkerList
            btnDetailAssessmentClick={btnDetailAssessmentClick}
            refreshing={refreshing}
            finishRefreshing={finishRefreshing}
            isLoadMore={isLoadMore}
            markerName={markerName}
            searchText={searchText}
            sortedType={sortedType}
            finishLoadMore={(_canLoadMore) => {
              setCanLoadMore(_canLoadMore);
              setIsLoadMore(false);
            }}
          />
        </SafeAreaView>
        {isLoadMore == false && canLoadMore == true && (
          <View style={styleContainer.loadMore}>
            <Button
              status="primary"
              appearance="outline"
              size="small"
              onPress={() => {
                setIsLoadMore(true);
              }}
            >
              Load more...
            </Button>
          </View>
        )}
      </Layout>
    </ScrollView>
  );
};

export default ProfileMeMarkersScreen;
