import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { UIHelper as uh } from '../../../../core';
import { Card, Text, Button, Icon, useTheme } from '@ui-kitten/components';

interface IDoneModalProps extends ViewProps {
  caption: string;
  description: string;
  btnViewAssessmentClick?: () => void;
  btnDoneClick: () => void;
}

const DoneModal = (props: IDoneModalProps) => {
  const th = useTheme();
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center',
      borderRadius: 16,
      padding: 16,
      maxWidth: uh.currentViewPort() - 32
    },
    btnView: { width: 160, marginTop: 40 },
    btnDone: { width: 80, marginTop: 8 },
    backdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
  });

  return (
    <View
      style={{
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        height: 500,
        marginTop: 50
      }}
    >
      <Card style={[styles.container]}>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon name="checkmark-circle-outline" style={{ width: 90, height: 90 }} fill={th['color-primary-500']}></Icon>
        </View>
        <Text category="s1" style={{ textAlign: 'center', marginBottom: 20, marginTop: 30 }}>
          {props.caption}
        </Text>
        <Text style={{ textAlign: 'center', marginBottom: 40 }}>{props.description}</Text>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center'
          }}
        >
          {props.btnViewAssessmentClick != undefined && (
            <Button
              size="small"
              style={styles.btnView}
              appearance="filled"
              status="primary"
              onPress={props.btnViewAssessmentClick}
            >
              View Assessment
            </Button>
          )}
          <Button size="small" style={styles.btnDone} appearance="ghost" status="basic" onPress={props.btnDoneClick}>
            <Text category="c1">Done</Text>
          </Button>
        </View>
      </Card>
    </View>
  );
};

export default DoneModal;
