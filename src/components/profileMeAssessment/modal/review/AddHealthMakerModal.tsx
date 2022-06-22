import React, { useState } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { UIHelper as uh } from '../../../../core';
import { Card, Text, Button } from '@ui-kitten/components';
import EditHealthMakerListItem from './EditHealthMakerListItem';
import { BiomarkerItem, HealthMarker } from 'src/core/types/Bloodwork';
import BackendApi from 'src/api/shared/BackendApi';
import { ErrorMessage } from 'src/components/shared/ErrorMessage';
import Spinner from 'react-native-loading-spinner-overlay';

interface IAddHealthMarkerModalProps extends ViewProps {
  documentId: string;
  btnCancelClick: () => void;
  addMoreHealthMarker: (healthMarkerId: number, unitId: number, value: string) => void;
  allHealthMarkers: Array<HealthMarker>;
  dropdownBGColor: string;
  intputColor: string;
}

const AddHealthMarkerModal = (props: IAddHealthMarkerModalProps) => {
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center',
      borderRadius: 16,
      padding: 16,
      maxWidth: uh.currentViewPort() - 32
    },
    btnAdd: { width: 80, marginTop: 40 },
    btnCancel: { width: 80, marginTop: 8 },
    backdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
  });

  const [value, setValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [unitId, setUnitId] = React.useState(0);
  const [healthMarkerId, setHealthMarkerId] = React.useState(0);
  const [error, setError] = React.useState<string>('');

  const biomarkerItem: BiomarkerItem = {
    bloodworkDataId: '',
    value: '',
    unitId: props.allHealthMarkers[0].healthMarkerUnitId,
    unit: props.allHealthMarkers[0].healthMarkerUnit,
    healthmarker: props.allHealthMarkers[0].healthMarkerName,
    healthMarkerId: props.allHealthMarkers[0].healthMarkerId
  };

  const updateValue = (newId: string, newValue: string, newUnitId: number, newHealthMarkerId?: number): void => {
    setValue(newValue);
    setUnitId(newUnitId);
    setHealthMarkerId(newHealthMarkerId as number);
  };

  const addHealthMarker = async (): Promise<any> => {
    try {
      const parameters = {
        documentId: props.documentId,
        healthMarkerId: healthMarkerId,
        value: value,
        unitId: unitId
      };

      const response = await BackendApi.post('/health-markers/bloodwork-add-new-marker', parameters);
      if (response.status >= 200 && response.status <= 399) {
        if (response.data !== undefined) {
          return {};
        }
      } else {
        console.error(response);
        return { errorMessage: 'Something went wrong' };
      }
    } catch (loadingError) {
      console.error(loadingError);
      return { errorMessage: 'Something went wrong' };
    }
  };

  const btnAddClick = async () => {
    try {
      setIsLoading(true);
      const result = await addHealthMarker();
      if (result?.errorMessage != undefined) {
        setError(result?.errorMessage);
      } else {
        props.addMoreHealthMarker(healthMarkerId, unitId, value);
        props.btnCancelClick();
      }
      setIsLoading(false);
    } catch (err) {
      setError(err?.message);
      setIsLoading(false);
    }
  };

  const healthMarker = props.allHealthMarkers.find((hm) => hm.healthMarkerId == healthMarkerId);
  const disableButton =
    Number.isNaN(Number(value)) ||
    value.trim().length == 0 ||
    Number(value) > healthMarker?.healthMarkerMaxRange ||
    Number(value) < healthMarker?.healthMarkerMinRange;

  return (
    <View
      style={{
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        height: 500,
        padding: 16,
        marginTop: 50
      }}
    >
      {isLoading == true && <Spinner visible={true}></Spinner>}
      <Card style={[styles.container]}>
        <ErrorMessage message={error} />
        <Text style={{ textAlign: 'center', marginBottom: 40 }}>Add Marker</Text>
        <EditHealthMakerListItem
          style={{ marginTop: 8 }}
          item={biomarkerItem}
          updateValue={updateValue}
          editable={true}
          allHealthMarkers={props.allHealthMarkers}
          inputColor={props.intputColor}
          dropdownBGColor={props.dropdownBGColor}
        />
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center'
          }}
        >
          <Button
            size="small"
            style={styles.btnAdd}
            appearance="filled"
            status="primary"
            disabled={disableButton}
            onPress={btnAddClick}
          >
            Add
          </Button>
          <Button
            size="small"
            style={styles.btnCancel}
            appearance="outline"
            status="primary"
            onPress={props.btnCancelClick}
          >
            Cancel
          </Button>
        </View>
      </Card>
    </View>
  );
};

export default AddHealthMarkerModal;
