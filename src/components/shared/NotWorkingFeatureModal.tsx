import React from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import { Button, Card, Modal, Text } from '@ui-kitten/components';

interface INotWorkingFeatureModalProps extends ViewProps {
  visible: boolean;
  closeClick: () => void;
}

export const NotWorkingFeatureModal = (props: INotWorkingFeatureModalProps) => {
  const styles = StyleSheet.create({
    backdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    button: { width: 80, alignSelf: 'center', marginTop: 20, marginLeft: 80, marginRight: 60 }
  });

  return (
    <Modal visible={props.visible} backdropStyle={styles.backdrop} onBackdropPress={() => props.closeClick()}>
      <Card>
        <Text>This functionality is coming very soon</Text>
        <Button style={styles.button} size="small" onPress={() => props.closeClick()}>
          OK
        </Button>
      </Card>
    </Modal>
  );
};
