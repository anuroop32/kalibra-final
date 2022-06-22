import 'react-native-get-random-values';
import React, { memo } from 'react';
import { LayoutChangeEvent, StyleSheet, View, ViewProps } from 'react-native';
import { MessageText, utils, Time, GiftedAvatar } from 'react-native-gifted-chat';
import MarkdownText from './MarkdownText';
import { useTheme } from '@ui-kitten/components';

interface IChatTextMessageProps extends ViewProps {
  data: any;
  setBubbleWidth: (messageId: string, width: number) => void;
  onLinkPress: (url: string) => void;
}

const ChatTextMessage = (props: IChatTextMessageProps) => {
  const th = useTheme();
  const { renderAvatarOnTop, position, currentMessage, previousMessage, nextMessage } = props.data;
  const markdownStyles = {
    body: {
      marginLeft: 10,
      marginRight: 10,
      marginTop: position == 'left' ? 9 : 0,
      marginBottom: position == 'left' ? 9 : 0,
      color: '',
      fontSize: 30,
      fontWeight: '400',
      fontFamily: 'Poppins-Regular'
    },
    strong: {
      fontSize: 16
    },
    paragraph: {
      fontSize: 16
    },
    link: {
      color: 'blue',
      fontSize: 16
    }
  };

  const avatarImageStyles = {
    height: 24,
    width: 24,
    borderRadius: 12,
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  };

  const timeStyles: any = {
    left: StyleSheet.create({
      container: {
        position: 'absolute',
        alignSelf: 'flex-start',
        height: 40,
        bottom: -29
      }
    }),
    right: StyleSheet.create({
      container: {
        alignSelf: 'flex-end',
        position: 'absolute',
        bottom: -29,
        height: 40
      }
    })
  };

  // calculate width of bubble
  const onLayout = (event: LayoutChangeEvent, messageId: string) => {
    const { width } = event.nativeEvent.layout;
    props.setBubbleWidth(messageId, width);
  };

  if (props.data.position === 'right') {
    markdownStyles.body.color = 'white';
  } else {
    markdownStyles.body.color = th['text-basic-color'];
  }

  const messageToCompare = renderAvatarOnTop ? previousMessage : nextMessage;
  const isShowDate = !(
    currentMessage &&
    messageToCompare &&
    utils.isSameUser(currentMessage, messageToCompare) &&
    utils.isSameDay(currentMessage, messageToCompare)
  );

  if (props?.data?.currentMessage?.text && props.data.currentMessage.text.length > 0) {
    return (
      <View style={{ backgroundColor: 'transparent' }}>
        <View onLayout={(event) => onLayout(event, props.data.currentMessage._id)}>
          <MarkdownText {...props.data} style={markdownStyles} onLinkPress={props.onLinkPress}>
            {props.data.currentMessage.text}
          </MarkdownText>
        </View>
        {isShowDate === true && position === 'left' && (
          <View style={{ position: 'absolute', left: -34, bottom: -3 }}>
            <GiftedAvatar {...props.data} user={props.data.currentMessage.user} avatarStyle={avatarImageStyles} />
          </View>
        )}

        {isShowDate === true && (
          <View style={timeStyles[position].container}>
            <Time
              {...props.data}
              timeTextStyle={{
                left: {
                  textAlign: 'left',
                  marginTop: 14,
                  fontSize: 10,
                  color: th['text-hint-color']
                },
                right: {
                  textAlign: 'right',
                  marginTop: 14,
                  fontSize: 10,
                  color: th['text-hint-color']
                }
              }}
            />
          </View>
        )}
      </View>
    );
  }
  return <MessageText {...props.data} />;
};

export default memo(ChatTextMessage);
