import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { Button, Card, Modal, Text } from '@ui-kitten/components';
import { UIHelper as uh } from '../../core';

interface IInfoModalProps extends ViewProps {
  visible: boolean;
  message: string;
  closeBtnClick: () => void;
}

export const InfoModal = (props: IInfoModalProps) => {
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
    <Modal visible={props.visible} backdropStyle={styles.backdrop} onBackdropPress={() => props.noBtnClick()}>
      <Card style={styles.card}>
        <Text style={styles.message}>{props.message}</Text>
        <View style={styles.buttonArea}>
          <Button style={styles.buttonStyle} size="small" onPress={() => props.closeBtnClick()}>
            OK
          </Button>
        </View>
      </Card>
    </Modal>
  );
};
