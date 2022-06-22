import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { Button, Card, Text } from '@ui-kitten/components';
import { UIHelper as uh } from '../../../../core';

interface IDeleteHealthMarkerConfirmationModalProps extends ViewProps {
  message: string;
  noBtnClick: () => void;
  yesBtnClick: () => void;
}

export const DeleteHealthMarkerConfirmationModal = (props: IDeleteHealthMarkerConfirmationModalProps) => {
  const styles = StyleSheet.create({
    backdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    button: { width: 80, alignSelf: 'center', marginTop: 20, marginLeft: 80, marginRight: 60 },
    buttonStyle: {
      width: 140,
      marginHorizontal: 10
    },
    message: {
      maxWidth: uh.currentViewPort() - 32,
      textAlign: 'center'
    },
    card: { maxWidth: uh.currentViewPort() - 32 },
    buttonArea: { justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: 40 }
  });

  return (
    <View
      style={{
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        height: 500
      }}
    >
      <Card style={styles.card}>
        <Text style={styles.message}>{props.message}</Text>
        <View style={styles.buttonArea}>
          <Button style={styles.buttonStyle} size="small" onPress={() => props.yesBtnClick()}>
            Yes
          </Button>
          <Button style={styles.buttonStyle} size="small" onPress={() => props.noBtnClick()}>
            No
          </Button>
        </View>
      </Card>
    </View>
  );
};
