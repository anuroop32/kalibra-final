import { Button } from '@ui-kitten/components';
import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { KaliQuote } from '../kalichat';
import { ChatMessage, ChatResponseDto, UIHelper as uh } from '../../core';
import Auth from '@aws-amplify/auth';
import { AxiosResponse } from 'axios';
import { BackendApi } from 'src/api/shared';
import { useFocusEffect } from '@react-navigation/native';

//data stub fetch from AI
const kalibraNBAContent = {
  heading: 'Good morning'
};

//props
interface IKaliNBAQuoteProps extends ViewProps {
  btnMessage: string;
  btnHandler: () => void;
  onLinkPress?: (url: string) => boolean;
}

const KaliNBAQuote = (props: IKaliNBAQuoteProps) => {
  // styles
  const styleContainer = StyleSheet.create({
    container: {},
    button: {
      minWidth: 168,
      // width: uh.w2DP(168),
      marginTop: uh.h2DP(16),
      padding: 0,
      marginHorizontal: 0,
      alignSelf: 'center'
    }
  });

  const [nickName, setNickName] = React.useState<string>('');
  const [lastMessage, setLastMessage] = React.useState<string>('');
  const isSubscribed = React.useRef(false);
  // fetch data from API and Load it
  const getUserInfo = React.useCallback(async () => {
    try {
      const result = await Auth.currentAuthenticatedUser();
      if (isSubscribed.current == false) {
        return;
      }
      setNickName(result.attributes.name);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const getLastChatMessage = React.useCallback(async () => {
    try {
      const response: AxiosResponse<ChatResponseDto> = await BackendApi.get('/surveys/start/');
      if (response.status >= 200 && response.status <= 399) {
        const newMessages: ChatMessage[] = response.data.messages;
        if (newMessages !== undefined && newMessages?.length > 0) {
          setLastMessage(newMessages[newMessages?.length - 1].text);
        }
      } else {
        console.error(response);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  React.useEffect(() => {
    isSubscribed.current = true;
    getUserInfo();
    return () => {
      isSubscribed.current = false;
    };
  }, [getUserInfo]);

  useFocusEffect(
    React.useCallback(() => {
      getLastChatMessage();
    }, [getLastChatMessage])
  );

  // view
  return (
    <View style={styleContainer.container}>
      <KaliQuote
        onLinkPress={props.onLinkPress}
        heading={`${kalibraNBAContent.heading} ${nickName}!`}
        caption={lastMessage}
      />
      <Button
        style={styleContainer.button}
        size="medium"
        appearance="outline"
        status="primary"
        onPress={props.btnHandler}
      >
        {props.btnMessage}
      </Button>
    </View>
  );
};

export default KaliNBAQuote;
