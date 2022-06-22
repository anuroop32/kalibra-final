import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { Layout, Text, Divider, Button, useTheme, ModalService } from '@ui-kitten/components';
import { mainStyles } from './_mainStyles';
import { InformationButton } from '../../components/profileMe';
import { KaliChatQuote } from '../../components/home';
import { UIHelper as uh, RootTabScreenProps, AppContext } from '../../core';
import { UploadBloodworkModal, ReviewBloodworkModal, YourAssessments } from '../../components/profileMeAssessment';
import RefreshControl from 'src/components/shared/RefreshControl';
import BackendApi from 'src/api/shared/BackendApi';
import { useFocusEffect } from '@react-navigation/native';
import { HealthMarker } from 'src/core/types/Bloodwork';

// const learnMoreBtnTitle = 'Learn more';
// const learnMoreBtn2Title = 'Get an assessment';
// const learnMoreMsg =
//   'There are another 42 markers that you haven’t had assessed yet. Let me know if you’d like to find out what all of the markers are that you can potentially have assessed.';
const bloodworkAssessmentMsg =
  'Sentence explaining that you can get blood tests done and upload the results to Kalibra yourself.';

const ProfileMeAssessmentScreen = ({ navigation }: RootTabScreenProps<'Home'>) => {
  const th = useTheme();
  const appContext = React.useContext(AppContext);
  const ctTheme = appContext.getTheme();
  let modalID = '';
  //styles
  const styleContainer = StyleSheet.create({
    screenContainer: { flex: 1 },
    safeAreaView: { flex: 1 },
    container: {
      flex: 1
    },
    learnMore: { marginTop: uh.h2DP(40) },
    divider: { marginTop: uh.h2DP(39), marginBottom: uh.h2DP(39) },
    chatQuote: { marginTop: uh.h2DP(16) },
    btnUpload: { marginTop: uh.h2DP(16) },
    btnInfo: { marginTop: uh.h2DP(18) },
    backdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
  });

  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [isShowUploadBloodwork, setIsShowUploadBloodwork] = React.useState<boolean>(false);
  const [pendingDocId, setPendingDocId] = React.useState<string>('');

  const finishRefreshing = () => {
    setRefreshing(false);
    setTimeout(() => {
      setIsShowUploadBloodwork(true);
    }, 500);
  };

  const btnDetailAssessmentClick = (assessmentId: string) => {
    navigation.navigate('AssessmentDetail' as any, {
      assessmentId: assessmentId
    });
  };

  //properties and handlers
  const btnTellMoreClick = () => {
    navigation.navigate('Kali');
  };

  const getPendingBloodWork = async () => {
    try {
      const response = await BackendApi.get('/health-markers/get-pending-bloodwork');
      if (response.status >= 200 && response.status <= 399) {
        if (response.data !== undefined && response.data.documentId != undefined) {
          setPendingDocId(response.data.documentId.length == 0 ? '' : response.data.documentId);
        }
      } else {
        console.error(response);
      }
    } catch (loadingError) {
      console.error(loadingError);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getPendingBloodWork();
  }, []);

  const renderReviewModalContentElement = () => {
    return (
      <ReviewBloodworkModal
        bloodworkId={pendingDocId}
        viewAssessmentHandler={btnTellMoreClick}
        btnBackHandler={() => {
          ModalService.hide(modalID);
          onRefresh();
          getPendingBloodWork();
        }}
        allHealthMarkers={appContext.getHealthMarkers()}
        inputColor={uh.getHex(th, ctTheme, 'color-basic-100', 'color-basic-1100')}
        dropdownBGColor={uh.getHex(th, ctTheme, 'color-basic-100', 'color-basic-900')}
      />
    );
  };

  const renderModalContentElement = () => {
    return (
      <UploadBloodworkModal
        viewAssessmentHandler={btnTellMoreClick}
        btnBackHandler={() => {
          ModalService.hide(modalID);
        }}
      />
    );
  };

  const showModal = () => {
    const contentElement = renderModalContentElement();
    modalID = ModalService.show(contentElement, {
      backdropStyle: styleContainer.backdrop
    });
  };

  const showReviewModal = () => {
    const contentElement = renderReviewModalContentElement();
    modalID = ModalService.show(contentElement, {
      backdropStyle: styleContainer.backdrop
    });
  };

  const btnUploadClick = async () => {
    showModal();
  };

  const btnReviewClick = async () => {
    showReviewModal();
  };

  //properties and handlers
  const btnAboutBloodworkClick = () => {
    navigation.navigate('Kali');
  };

  const getHealthMarkersAndUnits = React.useCallback(async () => {
    try {
      const response = await BackendApi.get('/health-markers/health-markers-unit-details');
      if (response.status >= 200 && response.status <= 399) {
        if (response.data !== undefined && response.data.length > 0) {
          const data = response.data.filter((item: HealthMarker) => item.healthMarkerName != undefined);
          appContext.setHealthMarkers(data);
        }
      } else {
        console.error(response);
      }
    } catch (loadingError) {
      console.error(loadingError);
    }
  }, [appContext]);

  useFocusEffect(
    React.useCallback(() => {
      getPendingBloodWork();
    }, [])
  );

  React.useEffect(() => {
    if (appContext.getHealthMarkers().length == 0) {
      getHealthMarkersAndUnits();
    }
  }, [getHealthMarkersAndUnits, appContext]);

  //view
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Layout level="2" style={[styleContainer.screenContainer, mainStyles.mainScreenContainer]}>
        <SafeAreaView style={styleContainer.screenContainer}>
          <YourAssessments
            btnDetailAssessmentClick={btnDetailAssessmentClick}
            refreshing={refreshing}
            finishRefreshing={finishRefreshing}
          />
          {/* <LearnMore
            style={styleContainer.learnMore}
            btnMessage={learnMoreBtnTitle}
            btnHandler={btnTellMoreClick}
            btn2Message={learnMoreBtn2Title}
            btn2Handler={btnTellMoreClick}
            messages={[learnMoreMsg]}
          />*/}
          {isShowUploadBloodwork == true && (
            <>
              <Divider style={styleContainer.divider} />
              <Text category="s1">Getting a bloodwork assessment done</Text>
              <KaliChatQuote style={styleContainer.chatQuote} messages={[bloodworkAssessmentMsg]} />
              {pendingDocId.length > 0 ? (
                <Button onPress={btnReviewClick} size="medium" style={styleContainer.btnUpload}>
                  Review pending bloodwork
                </Button>
              ) : (
                <Button onPress={btnUploadClick} size="medium" style={styleContainer.btnUpload}>
                  Upload new bloodwork document
                </Button>
              )}
              <InformationButton
                style={styleContainer.btnInfo}
                onPress={btnAboutBloodworkClick}
                title="How to get bloodwork done"
                color={th['color-primary-500']}
              />
            </>
          )}
        </SafeAreaView>
      </Layout>
    </ScrollView>
  );
};

export default ProfileMeAssessmentScreen;
