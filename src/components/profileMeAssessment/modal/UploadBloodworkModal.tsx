import React, { useState } from 'react';
import { Animated, ScrollView, StyleSheet, View, ViewProps } from 'react-native';
import { AxiosResponse } from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import { Divider, Text, Button, Layout, ModalService } from '@ui-kitten/components';
import * as Progress from 'react-native-progress';
import { BackendApi } from 'src/api/shared';
import { HealthMarkerFileUpload } from 'src/core/types/HealthMarkerFileUpload';
import { uploadUserFile } from 'src/api/storage/S3Storage';
import FileUploadListItem from './upload/FileUploadListItem';
import { UIHelper as uh } from '../../../core';
import { ModalHeader } from 'src/components/profileMe';
import DoneModal from './review/DoneModal';

const doneDes =
  "We've received your bloodwork document, and we're now working on extracting your health markers.\n\n We'll notify you when we are ready for you to review and confirm your bloodwork.";
interface UploadBloodworkModalProps extends ViewProps {
  viewAssessmentHandler: (assessmentId: string) => void;
  btnBackHandler: () => void;
}

const UploadBloodworkModal = (props: UploadBloodworkModalProps) => {
  let modalID = '';
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const [healthMarkerFileUploads, setHealthMarkerFileUploads] = useState<HealthMarkerFileUpload[]>(
    new Array<HealthMarkerFileUpload>()
  );
  const [intervalID, setIntervalID] = useState<NodeJS.Timer>();
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
      marginTop: uh.w2DP(6)
    },
    backdropStyle: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
  });

  const renderDoneModalContentElement = () => {
    return (
      <DoneModal
        caption="Bloodwork successfully uploaded"
        description={doneDes}
        btnDoneClick={() => {
          ModalService.hide(modalID);
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

  const tmpInvalidID = intervalID;
  const refreshData = React.useCallback(async () => {
    try {
      const response: AxiosResponse<HealthMarkerFileUpload[]> = await BackendApi.get('/health-markers/file-upload');
      if (response.status >= 200 && response.status <= 399) {
        setHealthMarkerFileUploads(new Array<HealthMarkerFileUpload>());
        setHealthMarkerFileUploads(response.data);
        clearInterval(tmpInvalidID as NodeJS.Timer);
      }
    } catch (error: any) {
      console.error(error);
    }
  }, [tmpInvalidID]);

  const uploadProgressCallback = async (progress: any) => {
    const progressPercentage = progress.loaded / progress.total;
    if (progress.loaded === progress.total) {
      setUploading(false);
      clearInterval(intervalID as NodeJS.Timer);
      setTimeout(() => {
        refreshData();
        showDoneModal();
      }, 1000);
    }
    setUploadProgress(progressPercentage);
  };

  //const tmpIntervalID = intervalID;
  const pickPdfDocument = async () => {
    const result: DocumentPicker.DocumentResult = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf'
    });

    if (result.type !== 'cancel') {
      const tmpIntervalID = setInterval(refreshData.bind(this), 5000);
      setIntervalID(tmpIntervalID);
      setUploadProgress(0);
      setUploading(true);
      await uploadUserFile(result.name, result.uri, result.type, 'biomarker', uploadProgressCallback);
      setUploading(false);
      clearInterval(intervalID as NodeJS.Timer);
      setTimeout(() => {
        refreshData();
        showDoneModal();
      }, 1000);
    }
  };

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
    refreshData();
  }, [moveUp, refreshData]);

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

  const UploadButton = () => {
    return (
      <View style={styles.button}>
        <Button onPress={() => pickPdfDocument()}>Select File</Button>
      </View>
    );
  };

  const UploadedFilesTable = () => {
    return (
      <ScrollView alwaysBounceVertical={true} style={{ marginTop: 16 }}>
        {healthMarkerFileUploads.map((value: HealthMarkerFileUpload) => {
          return (
            <FileUploadListItem
              style={styles.item}
              key={'fileUploadRow_' + value.id}
              item={value}
              onPress={() => {
                if (value.userHealthMarkerSourceId) {
                  props.viewAssessmentHandler(value.userHealthMarkerSourceId);
                }
              }}
            />
          );
        })}
      </ScrollView>
    );
  };

  if (uploading) {
    return (
      <Animated.View style={styles.animatedViewContainer}>
        <ModalHeader
          caption="Details"
          btnClickHandler={() => {
            moveDown(props.btnBackHandler);
          }}
        />
        <Layout style={styles.container}>
          <UploadButton />
          <Text style={styles.progressBarTitle}>Uploading ...</Text>
          <Progress.Bar progress={uploadProgress} style={styles.progressBar} width={uh.currentViewPort()} />
          <Divider />
          <UploadedFilesTable />
        </Layout>
      </Animated.View>
    );
  }
  return (
    <Animated.View style={styles.animatedViewContainer}>
      <ModalHeader
        caption="Upload Bloodwork Document"
        btnClickHandler={() => {
          moveDown(props.btnBackHandler);
        }}
      />
      <Layout style={styles.container}>
        <UploadButton />
        <Divider style={styles.divider} />
        <UploadedFilesTable />
      </Layout>
    </Animated.View>
  );
};

export default UploadBloodworkModal;
