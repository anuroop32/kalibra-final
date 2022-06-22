import React, { useState } from 'react';
import { Animated, StyleSheet, View, ViewProps } from 'react-native';
import { AxiosResponse } from 'axios';
import { Divider, Text, Button, Layout, Datepicker, Icon, Input, ModalService, IconProps } from '@ui-kitten/components';
import { BackendApi } from 'src/api/shared';
import { UIHelper as uh } from '../../../core';
import { ModalHeader } from 'src/components/profileMe';
import EditHealthMakerListItem from './review/EditHealthMakerListItem';
import { BiomarkerItem, Bloowork, HealthMarker } from 'src/core/types/Bloodwork';
import AddHealthMarkerModal from './review/AddHealthMakerModal';
import DoneModal from './review/DoneModal';
import { DeleteHealthMarkerConfirmationModal } from './review/DeleteHealthMarkerConfirmationModal';
import moment from 'moment';
import { ErrorMessage } from 'src/components/shared/ErrorMessage';
import Spinner from 'react-native-loading-spinner-overlay';

const infos = [
  'Congratulations, we have processed your bloodwork. We need to confirm a few things before adding them to your profile.',
  'We are confident these markers are correct, please review and confirm',
  'These following markers new your review, we are not confident that the value, or unit, is correct. Please carefully review your bloodwork and update any values and units before confiming.',
  'Thank you, we have confirmed 27 markers from your blood test.',
  ''
];

const buttonNames = ['Continue', 'Confirm', 'Confirm', 'Confirm and Commit Bloodwork', 'Confirm and Commit Bloodwork'];

let count = 1;
const CalendarIcon = (props: IconProps) => <Icon {...props} name="calendar" />;

interface ReviewBloodworkModalProps extends ViewProps {
  viewAssessmentHandler: (assessmentId: string) => void;
  btnBackHandler: () => void;
  bloodworkId: string;
  allHealthMarkers: Array<HealthMarker>;
  dropdownBGColor: string;
  inputColor: string;
}

const doneDes = 'Your bloodwork is now reflected in your Kalibra Score';

const ReviewBloodworkModal = (props: ReviewBloodworkModalProps) => {
  let modalID = '';
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bloodworkData, setBloodworkData] = useState<Bloowork>();
  const [step, setStep] = useState<number>(0);
  const [update, setUpdate] = useState<boolean>(false);
  const [referralAuthority, setReferralAuthority] = useState<string>('');
  const [measuredDate, setMeasuredDate] = React.useState(new Date());
  const [error, setError] = React.useState<string>('');
  const moveAnim = React.useRef(new Animated.Value(uh.height())).current;

  const styles = StyleSheet.create({
    screenContainer: {
      padding: uh.h2DP(16),
      paddingTop: 0,
      minHeight: uh.height() - uh.topPos()
    },
    animatedViewContainer: {
      height: uh.height() - uh.topPos(),
      position: 'absolute',
      alignSelf: 'center',
      width: uh.currentViewPort(),
      transform: [
        {
          translateY: moveAnim as any
        }
      ]
    },
    container: {
      flex: 1,
      padding: uh.h2DP(16)
    },
    progressBar: {
      marginBottom: uh.h2DP(20),
      width: uh.currentViewPort() - uh.w2DP(64),
      marginLeft: uh.w2DP(16)
    },
    progressBarTitle: {
      margin: uh.h2DP(20)
    },
    button: {
      alignItems: 'center',
      padding: uh.h2DP(10)
    },
    item: {
      marginTop: uh.w2DP(8)
    },
    divider: {
      marginTop: uh.w2DP(16)
    },
    backdropStyle: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    input: { backgroundColor: props.inputColor, marginTop: 10 },
    select: { flex: 1, marginTop: uh.h2DP(16) },
    confirmButton: { marginTop: uh.h2DP(24) },
    yesButton: { marginRight: uh.h2DP(20), marginLeft: 20 }
  });

  const moveUp = React.useCallback(() => {
    // Will decrease value to 30 in 500 milliseconds
    Animated.timing(moveAnim, {
      toValue: uh.topPos(),
      duration: 500,
      useNativeDriver: true
    }).start();
  }, [moveAnim]);

  React.useEffect(() => {
    moveUp();
    // refreshData();
  }, [moveUp]);

  const moveDown = (callBackFnc: () => void) => {
    // Will increase value to windowHeight in 500 milliseconds
    Animated.timing(moveAnim, {
      toValue: uh.height(),
      duration: 500,
      useNativeDriver: true
    }).start(() => {
      callBackFnc();
    });
  };

  const updateBloodwork = async (): Promise<any> => {
    try {
      setIsLoading(true);
      let paramaters = [];
      if (step == 0) {
        paramaters = [
          { documentId: props.bloodworkId, referralAuthority: referralAuthority, measuredDate: measuredDate }
        ];
      } else if (step == 1 || step == 2) {
        bloodworkData?.healthMarker.forEach((item) => {
          paramaters.push({
            bloodworkDataId: item.bloodworkDataId,
            healthMarkerId: item.healthMarkerId,
            value: Number(item.value),
            unitId: item.unitId
          });
        });
      }
      const response = await BackendApi.post('/health-markers/bloodwork-update-review-data', paramaters);
      if (response.status >= 200 && response.status <= 399) {
        if (response.data !== undefined) {
          setIsLoading(false);
          return {};
        }
      } else {
        console.error(response);
        setIsLoading(false);
        return { errorMessage: 'Something went wrong.' };
      }
    } catch (loadingError) {
      console.error(loadingError);
      setIsLoading(false);
      return { errorMessage: 'Something went wrong.' };
    }
  };

  const renderDoneModalContentElement = () => {
    return (
      <DoneModal
        caption="Bloodwork successfully added"
        description={doneDes}
        btnDoneClick={() => {
          ModalService.hide(modalID);
          props.btnBackHandler();
        }}
        btnViewAssessmentClick={() => {
          ModalService.hide(modalID);
          props.btnBackHandler();
        }}
      />
    );
  };

  const showDoneModal = () => {
    const contentElement = renderDoneModalContentElement();
    modalID = ModalService.show(contentElement, {
      backdropStyle: styles.backdropStyle
    });
  };

  const commitBloodwork = async (): Promise<any> => {
    try {
      setIsLoading(true);
      const response = await BackendApi.get(`/health-markers/bloodwork-process-health-markers/${props.bloodworkId}`, {
        documentId: props.bloodworkId
      });
      if (response.status >= 200 && response.status <= 399) {
        if (response.data !== undefined) {
          setIsLoading(false);
          return {};
        }
      } else {
        setIsLoading(false);
        console.error(response);
        return { errorMessage: 'Something went wrong.' };
      }
    } catch (loadingError) {
      setIsLoading(false);
      console.error(loadingError);
      return { errorMessage: 'Something went wrong.' };
    }
  };

  const btnConfirmClick = async () => {
    if (step == 0) {
      try {
        const result = await updateBloodwork();
        if (result?.errorMessage) {
          setError(result?.errorMessage);
        } else {
          setStep(1);
        }
      } catch (err) {
        setError(err?.message);
      }
    } else if (step == 1 || step == 2) {
      try {
        const result = await updateBloodwork();
        if (result?.errorMessage) {
          setError(result?.errorMessage);
        } else {
          setStep(3);
        }
      } catch (err) {
        setError(err?.message);
      }
    } else if (step == 4) {
      try {
        const result = await commitBloodwork();
        if (result?.errorMessage) {
          setError(result?.errorMessage);
        } else {
          showDoneModal();
        }
      } catch (err) {
        setError(err?.message);
      }
    }
  };

  const renderStep0 = () => {
    return (
      <>
        <Text category="p2" style={{ marginTop: 16 }}>
          When did you take this blood test?
        </Text>
        <Datepicker
          size="large"
          backdropStyle={styles.backdropStyle}
          status={'basic'}
          controlStyle={[styles.input]}
          label=""
          min={new Date('1920/01/01')}
          placement="top"
          max={new Date()}
          date={measuredDate}
          onSelect={(nextDate) => setMeasuredDate(nextDate)}
          accessoryRight={CalendarIcon}
        />
        <Text category="p2" style={{ marginTop: 16 }}>
          Referral authority (practitioner or clinic)
        </Text>
        <Input
          style={[styles.input]}
          size="large"
          status={'basic'}
          value={referralAuthority}
          label=""
          onChangeText={(text: string) => setReferralAuthority(text)}
        />
      </>
    );
  };

  const deleteBiomarkerItem = (id: string) => {
    bloodworkData.healthMarker = bloodworkData?.healthMarker.filter((item) => item.bloodworkDataId != id);
    setUpdate(!update);
  };

  const deleteHealthMarker = async (bloodworkDataId: string) => {
    try {
      const response: AxiosResponse = await BackendApi.delete(
        `/health-markers/bloodwork-delete-marker-data/${bloodworkDataId}`
      );
      // Deleted all the users data successfully
      if (response.status === 200) {
        deleteBiomarkerItem(bloodworkDataId);
        ModalService.hide(modalID);
      }
    } catch (err) {
      console.error(err?.message);
    }
  };

  const addMoreHealthMarker = (healthMarkerId: number, unitId: number, value: string) => {
    bloodworkData?.healthMarker.push({ healthMarkerId: healthMarkerId, value: value, healthmarkerUnitId: unitId });
    setUpdate(!update);
  };

  const renderConfirmModalContentElement = (bloodworkDataId: string) => {
    return (
      <DeleteHealthMarkerConfirmationModal
        message="Are you sure you would like to remove this biomarker?"
        yesBtnClick={() => deleteHealthMarker(bloodworkDataId)}
        noBtnClick={() => {
          ModalService.hide(modalID);
        }}
      />
    );
  };

  const showConfirmModal = (bloodworkDataId: string) => {
    const contentElement = renderConfirmModalContentElement(bloodworkDataId);
    modalID = ModalService.show(contentElement, {
      backdropStyle: styles.backdropStyle
    });
  };

  const renderAddModalContentElement = () => {
    return (
      <AddHealthMarkerModal
        btnCancelClick={() => {
          ModalService.hide(modalID);
        }}
        allHealthMarkers={props.allHealthMarkers}
        documentId={props.bloodworkId}
        addMoreHealthMarker={addMoreHealthMarker}
        dropdownBGColor={props.dropdownBGColor}
        intputColor={props.inputColor}
      />
    );
  };

  const showAddModal = () => {
    const contentElement = renderAddModalContentElement();
    modalID = ModalService.show(contentElement, {
      backdropStyle: styles.backdropStyle
    });
  };

  const updateValue = (newId: string, newValue: string, newUnitId: number): void => {
    const index = bloodworkData?.healthMarker.findIndex((item) => item.bloodworkDataId == newId);
    if (index != undefined && index >= 0) {
      bloodworkData.healthMarker[index].value = newValue;
      bloodworkData.healthMarker[index].unitId = newUnitId;
      setUpdate(!update);
    }
  };

  const renderStep1 = () => {
    let newList: BiomarkerItem[] = [];
    if (step == 1) {
      newList = bloodworkData?.healthMarker as BiomarkerItem[];
    } else {
      newList = bloodworkData?.healthMarker.filter(
        (item) => Number.isNaN(Number(item.value)) == true || item.value.trim().length == 0
      ) as BiomarkerItem[];
    }
    count = count + 1;
    if (count % 2 == 0) {
      return newList.map((item) => {
        return (
          <EditHealthMakerListItem
            key={item.healthMarkerId}
            item={item}
            allHealthMarkers={props.allHealthMarkers}
            deleteButtonClick={() => {
              showConfirmModal(item.bloodworkDataId);
            }}
            updateValue={updateValue}
            editable={false}
            inputColor={props.inputColor}
            dropdownBGColor={props.dropdownBGColor}
          />
        );
      });
    } else {
      return newList.map((item) => {
        return (
          <>
            <EditHealthMakerListItem
              item={item}
              allHealthMarkers={props.allHealthMarkers}
              deleteButtonClick={() => {
                showConfirmModal(item.bloodworkDataId);
              }}
              updateValue={updateValue}
              editable={false}
              inputColor={props.inputColor}
              dropdownBGColor={props.dropdownBGColor}
            />
          </>
        );
      });
    }
  };

  const renderStep2 = () => {
    return (
      <>
        <Text category="p2" style={{ marginTop: 16 }}>
          Would you like to add any additional markers?
        </Text>
        <View
          style={{
            marginTop: 40,
            flexDirection: 'row',
            marginVertical: 50,
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Button
            style={styles.yesButton}
            size="small"
            status="primary"
            disabled={false}
            onPress={() => {
              showAddModal();
            }}
          >
            Yes
          </Button>
          <Button
            style={styles.yesButton}
            size="small"
            status="primary"
            disabled={false}
            onPress={() => {
              setStep(4);
            }}
          >
            No
          </Button>
        </View>
      </>
    );
  };

  const renderStep = () => {
    if (step == 0) {
      return renderStep0();
    } else if (step == 1 || step == 2) {
      return renderStep1();
    } else if (step == 3) {
      return renderStep2();
    }
  };

  const getBloodworkDetail = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await BackendApi.get(`/health-markers/get-bloodwork-detail/${props.bloodworkId}`, {
        documentId: props.bloodworkId
      });
      if (response.status >= 200 && response.status <= 399) {
        if (response.data !== undefined) {
          setBloodworkData(response.data[0]);
          setMeasuredDate(moment(response.data[0].measuredDate).toDate());
          setReferralAuthority(response.data[0].referralAuthority);
        }
        setError('');
      } else {
        console.error(response);
        setError('Something went wrong.');
      }
      setIsLoading(false);
    } catch (loadingError) {
      setIsLoading(false);
      console.error(loadingError);
      setError('Something went wrong.');
    }
  }, [props.bloodworkId]);

  const getInfoText = () => {
    if (step == 3 || step == 4) {
      return `Thank you, we have confirmed ${bloodworkData.healthMarker.length} markers from your blood test.`;
    }
    return infos[step];
  };

  React.useEffect(() => {
    getBloodworkDetail();
  }, [getBloodworkDetail]);

  const validateData = () => {
    if (step == 0) {
      if (measuredDate == undefined || referralAuthority.length == 0) {
        return false;
      }
    } else if (step == 1) {
      const errorBiomarkers = bloodworkData?.healthMarker.filter((item) => {
        const healthMarker = props.allHealthMarkers.find((hm) => hm.healthMarkerId == item.healthMarkerId);
        return (
          Number.isNaN(Number(item.value)) == true ||
          String(item.value).trim().length == 0 ||
          Number(item.value) > Number(healthMarker?.healthMarkerMaxRange) ||
          Number(item.value) < Number(healthMarker?.healthMarkerMinRange)
        );
      });

      if (errorBiomarkers != undefined && errorBiomarkers?.length > 0) {
        return false;
      }
    } else if (step == 3) {
      return false;
    }
    return true;
  };

  const disableButton = !validateData();
  return (
    <Animated.View style={styles.animatedViewContainer}>
      {isLoading == true && <Spinner visible={true}></Spinner>}
      <ModalHeader
        caption="Review Your Bloodwork"
        btnClickHandler={() => {
          moveDown(props.btnBackHandler);
        }}
      />
      <Layout level="2" style={styles.container}>
        <ErrorMessage message={error} />

        <Text category="p2">{getInfoText()}</Text>
        <Divider style={styles.divider} />
        {renderStep()}

        {step < 5 && (
          <Button
            style={styles.confirmButton}
            size="small"
            status="primary"
            disabled={disableButton}
            onPress={() => {
              btnConfirmClick();
            }}
          >
            {buttonNames[step]}
          </Button>
        )}
      </Layout>
    </Animated.View>
  );
};

export default ReviewBloodworkModal;
