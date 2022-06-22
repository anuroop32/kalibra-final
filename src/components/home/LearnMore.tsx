import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { Button } from '@ui-kitten/components';
import { UIHelper as uh } from '../../core';
import KaliChatQuote from './KaliChatQuote';

//props
interface ILearnMoreProps extends ViewProps {
  messages: Array<string>;
  btnMessage?: string;
  btn2Message?: string;
  btnHandler: () => void;
  btn2Handler?: () => void;
  useRender?: boolean;
}

const LearnMore = (props: ILearnMoreProps) => {
  //styles
  const styleContainer = StyleSheet.create({
    button: {
      minWidth: uh.h2DP(110),
      marginTop: uh.h2DP(16),
      padding: 0,
      marginHorizontal: 0,
      alignSelf: 'center'
    }
  });

  //views
  const hasTextMessage = props.messages.find((item) => item != undefined && item.length > 0) != undefined;
  return (
    <View style={props.style}>
      {hasTextMessage && <KaliChatQuote messages={props.messages} useRender={props.useRender} />}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          alignContent: 'center',
          marginLeft: uh.h2DP(24)
        }}
      >
        {props.btnMessage != undefined && (
          <Button
            style={styleContainer.button}
            size="medium"
            appearance="outline"
            status="primary"
            onPress={props.btnHandler}
          >
            {props.btnMessage}
          </Button>
        )}
        {props.btn2Message != undefined && (
          <>
            <View style={{ width: 8 }} />
            <Button
              style={styleContainer.button}
              size="medium"
              appearance="outline"
              status="primary"
              onPress={props.btn2Handler}
            >
              {props.btn2Message}
            </Button>
          </>
        )}
      </View>
    </View>
  );
};

export default LearnMore;
