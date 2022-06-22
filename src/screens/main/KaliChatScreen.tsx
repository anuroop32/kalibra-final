import 'react-native-get-random-values';
import React, { memo, useCallback, useState } from 'react';
import { Linking, Platform, StyleSheet, View } from 'react-native';
import { Auth } from '@aws-amplify/auth';
import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { AxiosResponse } from 'axios';
import { GiftedChat, IMessage, Reply, User } from 'react-native-gifted-chat';
import TypingIndicator from 'react-native-gifted-chat/lib/TypingIndicator';
import { v4 as uuidv4 } from 'uuid';
import { BackendApi } from '../../api/shared';
import { useTheme, Layout } from '@ui-kitten/components';
import { AgendaItem, ChatMessage, ChatResponseDto, RootTabScreenProps, UIHelper as uh, AppContext } from '../../core';
import ChatBubble from '../../components/kalichat/ChatBubble';
import ChatQuickReplies from 'src/components/kalichat/ChatQuickReplies';
import ChatTextMessage from 'src/components/kalichat/ChatTextMessage';
import ChatFooter from 'src/components/kalichat/ChatFooter';
import Spinner from 'react-native-loading-spinner-overlay';

let debugEnabled = false;
let timeoutIds: any[] = [];
const KaliChatScreen = ({ route, navigation }: RootTabScreenProps<'Home'>) => {
  const appContext = React.useContext(AppContext);
  const messageDelayMaxMs = 2000;
  const timeDelayPerCharMs = 35;
  const readingTimeDelayPerCharMs = 25;
  const th = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadEarlierMessagesEnabled, setLoadEarlierMessagesEnabled] = useState<boolean>(false);
  const [loadingEarlierMessages, setLoadingEarlierMessages] = useState<boolean>(false);
  const [, setErrorModalVisible] = useState<boolean>(false);
  const [pressedMessageId, setPressedMessageId] = useState<string>('');
  const [messageReactions, setMessageReactions] = useState<any>({});
  const [bubbleWidths, setBubbleWidths] = useState<any>({});
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [messages, setMessages] = useState<IMessage[]>(new Array<IMessage>());
  const [user, setUser] = useState<User>({ _id: 0 });
  const [timeoutId, setTimeoutId] = useState<number>(0);
  const [isShowAllMsgsReaction, setIsShowAllMsgsReaction] = useState<boolean>(false);
  const [actionItemId, setActionItemId] = useState<string | undefined>(route.params?.actionItemId);
  const [actionItemCompleted, setActionItemCompleted] = useState<boolean | undefined>(route.params?.completed);

  const bot: User = React.useMemo(() => {
    return { _id: 'kalibra-assistant-id', name: 'Kalibra Assistant' };
  }, []);
  const sendActionItemUpdate = async (id: string, completed: boolean, startTyping = false): Promise<number> => {
    setIsTyping(startTyping);
    const startTimeMs: number = new Date().getTime();
    try {
      const response: AxiosResponse = await BackendApi.put('/surveys/action-item/' + id, {
        completed: Boolean(completed)
      });
      if (!(response.status >= 200 && response.status <= 399)) {
        console.error(response);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
    const endTimeMs: number = new Date().getTime();
    const latencyMs: number = endTimeMs - startTimeMs;
    return latencyMs;
  };

  const getAgendaItem = async (id: string, startTyping = false): Promise<AgendaItem | undefined> => {
    setIsTyping(startTyping);
    try {
      const response: AxiosResponse<AgendaItem> = await BackendApi.get('/surveys/action-item/' + id);
      if (response.status >= 200 && response.status <= 399) {
        const agendaItem: AgendaItem = response.data;
        return agendaItem;
      } else {
        console.error(response);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const maybeFilterDebugMessages = (messagesToFilter: ChatMessage[] = []): ChatMessage[] => {
    if (!debugEnabled) {
      const filterMessages: ChatMessage[] = messagesToFilter.filter(
        (message: ChatMessage) => message.user._id !== 'kalibra-debug-assistant-id'
      );
      return filterMessages;
    }
    return messagesToFilter;
  };

  const preProcessNewMessage = (newMessage: ChatMessage): ChatMessage => {
    newMessage.user.avatar = require('../../../assets/images/kali.png');
    //require('../../../assets/images/gradient_logo.png');
    if (newMessage.reaction) {
      const newMessageReactions = messageReactions;
      newMessageReactions[newMessage._id] = newMessage.reaction;
      setMessageReactions(newMessageReactions);
    }
    return newMessage;
  };

  const preProcessNewMessages = (newMessages: ChatMessage[]): ChatMessage[] => {
    for (const message of newMessages) {
      preProcessNewMessage(message);
    }
    return newMessages;
  };

  const forceRedrawMessages = () => {
    setMessages((previousMessages: IMessage[]) => {
      const newMessages: IMessage[] = JSON.parse(JSON.stringify(previousMessages));
      return newMessages;
    });
  };

  const showAllMessageReactions = useCallback(() => {
    const timeout = setTimeout(() => {
      setIsShowAllMsgsReaction(true);
      forceRedrawMessages();
    }, 200);
    timeoutIds.push(timeout);
  }, []);

  const onLoadEarlierMessages = async (): Promise<void> => {
    try {
      if (messages === undefined || messages?.length === 0) {
        return;
      }
      setLoadingEarlierMessages(true);
      const oldestMessage: IMessage = messages[messages.length - 1];
      const response: AxiosResponse<ChatMessage[]> = await BackendApi.get(`/messages/history/${oldestMessage._id}`);

      if (response.status >= 200 && response.status <= 399) {
        const newMessages: ChatMessage[] = response.data;
        if (newMessages !== undefined && newMessages?.length > 0) {
          const filteredNewMessages: ChatMessage[] = maybeFilterDebugMessages(newMessages);
          const history: ChatMessage[] = preProcessNewMessages(filteredNewMessages);

          // Are there more messages available in history
          if (newMessages.length < 10) {
            setLoadEarlierMessagesEnabled(false);
          }

          setMessages((previousMessages) => GiftedChat.prepend(previousMessages, history));
          showAllMessageReactions();
        }
      } else {
        console.error(response);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingEarlierMessages(false);
    }
  };

  const animateNewMessage = (newMessage: IMessage, stopTyping: boolean): void => {
    // Override server create date so messages are rendered in correct order
    setMessages((previousMessages) => GiftedChat.append(previousMessages, [newMessage]));
    setIsTyping(!stopTyping);
  };

  const appendNewMessages = (
    newMessages: ChatMessage[] = [],
    latencyMs = 0,
    stopTypingOnLastMsg = true,
    startTypingOnFirstMsg = true
  ): void => {
    const filteredNewMessages: ChatMessage[] = maybeFilterDebugMessages(newMessages);

    // No messages received.
    if (filteredNewMessages?.length === 0) {
      setIsTyping(false);
      return;
    }

    let delayMs = 0;
    let firstProcessedMsg = true;
    for (const [i, newMessage] of filteredNewMessages.entries()) {
      const waitPeriodMs: number = Math.min(newMessage.text.length * timeDelayPerCharMs, messageDelayMaxMs);
      const readingDelayMs: number = Math.min(newMessage.text.length * readingTimeDelayPerCharMs, messageDelayMaxMs);

      preProcessNewMessage(newMessage);

      if (newMessage.quickReplies) {
        newMessage.quickReplies.keepIt = true;
      }

      if (newMessage.seen) {
        animateNewMessage(newMessage, true);
        continue;
      }

      // If 1st message, take in to account network latency
      if (firstProcessedMsg) {
        setIsTyping(startTypingOnFirstMsg);
        delayMs += Math.max(waitPeriodMs - latencyMs, 0);
        firstProcessedMsg = false;
        setIsTyping(true);
      } else {
        delayMs += waitPeriodMs;
      }

      const stopTyping: boolean = filteredNewMessages.length === i + 1 && stopTypingOnLastMsg;
      const timeOut = setTimeout(() => {
        animateNewMessage(newMessage, true);
        const readingTimeOut = setTimeout(() => {
          setIsTyping(!stopTyping);
        }, readingDelayMs);
        setTimeoutId(readingTimeOut);
      }, delayMs);
      setTimeoutId(timeOut);
      timeoutIds.push(timeOut);

      delayMs += readingDelayMs;
    }
  };

  const startSurvey = async (reset = false): Promise<void> => {
    setIsTyping(false);
    try {
      const startTimeMs: number = new Date().getTime();
      const response: AxiosResponse<ChatResponseDto> = await BackendApi.get('/surveys/start/');
      const endTimeMs: number = new Date().getTime();
      const latencyMs: number = endTimeMs - startTimeMs;
      if (response.status >= 200 && response.status <= 399) {
        const newMessages: ChatMessage[] = response.data.messages;
        if (newMessages !== undefined && newMessages?.length > 0) {
          if (newMessages.length === 10) {
            setLoadEarlierMessagesEnabled(true);
          }

          if (reset) {
            for (const timeout of timeoutIds) {
              clearTimeout(timeout);
            }
            timeoutIds = [];
            setMessages(new Array<IMessage>());
          }
          appendNewMessages(newMessages, latencyMs);
        }
      } else {
        console.error(response);
        setErrorModalVisible(true);
      }
    } catch (error) {
      console.error(error);
      setErrorModalVisible(true);
    } finally {
      setIsTyping(false);
    }
  };

  const sendMessageReaction = async (messageId: string, reactionTypeId: number): Promise<void> => {
    try {
      const response: AxiosResponse = await BackendApi.put('/surveys/feedback/' + messageId, {
        reaction: reactionTypeId
      });
      if (!(response.status >= 200 && response.status <= 399)) {
        console.error(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAuthenticatedUser = async (): Promise<User> => {
    const authUser = await Auth.currentAuthenticatedUser();
    const localUser: User = {
      _id: authUser.attributes.sub,
      name: authUser.attributes.nickname
    };
    setUser(localUser);
    return localUser;
  };

  const isDebugEnabled = async (): Promise<boolean> => {
    // if (Config.DEBUG_MODE) {
    //   // const debugModeString: string = await getValue(
    //   //   Preferences.DEBUG_MODE_KEY
    //   // );
    //   // return debugModeString === 'true';
    //   return false;
    // }
    return false;
  };

  const initialize = async (): Promise<void> => {
    try {
      setLoading(true);
      setMessages(new Array<IMessage>());
      const localUser: User = await getAuthenticatedUser();
      debugEnabled = await isDebugEnabled();
      if (actionItemId !== undefined) {
        const agendaItem: AgendaItem | undefined = await getAgendaItem(actionItemId);
        if (agendaItem === undefined) {
          setActionItemId(undefined);
          setActionItemCompleted(undefined);
          await startSurvey(true);
          return;
        }
        if (actionItemCompleted !== undefined) {
          const latencyMs: number = await sendActionItemUpdate(actionItemId, actionItemCompleted);

          const actionItemMessages: ChatMessage[] = [
            {
              _id: uuidv4(),
              text: actionItemCompleted ? 'Yes' : 'No',
              createdAt: new Date(),
              user: localUser
            },
            {
              _id: uuidv4(),
              text: agendaItem.validationText,
              createdAt: new Date(),
              user: bot
            }
          ];
          appendNewMessages(actionItemMessages, latencyMs, false);
          setActionItemId(undefined);
          setActionItemCompleted(undefined);
          await startSurvey(true);
        } else {
          const actionItemMessages: ChatMessage[] = [
            {
              _id: uuidv4(),
              text: agendaItem.validationText,
              createdAt: new Date(),
              user: bot,
              quickReplies: {
                type: 'radio',
                keepIt: false,
                values: [
                  {
                    title: 'Yes',
                    value: 'true'
                  },
                  {
                    title: 'No',
                    value: 'false'
                  }
                ]
              }
            }
          ];
          appendNewMessages(actionItemMessages, 0, true, false);
        }
      } else {
        await startSurvey(true);
      }
      showAllMessageReactions();
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const send = async (messageId: string, messageText: string, payload: any): Promise<void> => {
    setIsTyping(true);

    try {
      const startTimeMs: number = new Date().getTime();
      const response: AxiosResponse<ChatResponseDto> = await BackendApi.post('/surveys/answer/', {
        messageId: messageId,
        messageText: messageText,
        payload: payload
      });
      const endTimeMs: number = new Date().getTime();
      const latencyMs: number = endTimeMs - startTimeMs;

      // need to reload action items
      appContext.setRefreshActionItemsFlag(true);

      if (response.status >= 200 && response.status <= 399) {
        const newMessages: ChatMessage[] = response.data.messages;
        if (newMessages !== undefined && newMessages?.length > 0) {
          appendNewMessages(newMessages, latencyMs);
        } else {
          setIsTyping(false);
        }
      } else {
        console.error(response);
        setIsTyping(false);
        setErrorModalVisible(true);
      }
    } catch (error) {
      console.error(error);
      setIsTyping(false);
      setErrorModalVisible(true);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSend = async (): Promise<void> => {
    // Text Input received, but we don't support this yet!
  };

  const onQuickReply = async (replies: Reply[] = []): Promise<void> => {
    const messageId: string = uuidv4();
    const messageText: string = replies[0].title;
    const replyPayload: any = replies[0].value;
    const replyMessageId: string = replies[0].messageId;
    if (messages.length > 0 && messages[0]._id !== replyMessageId) {
      return;
    }

    const userMsgs: IMessage = {
      _id: messageId,
      text: messageText,
      createdAt: new Date(),
      user: user
    };

    // Publish users quick reply selection to chat window
    animateNewMessage(userMsgs, false);

    if (actionItemId !== undefined) {
      sendActionItemUpdate(actionItemId, replyPayload === 'true' ? true : false, true);
      setActionItemId(undefined);
      setActionItemCompleted(undefined);
      await startSurvey();
    } else {
      // Retrieve the next message(s)
      send(messageId, messageText, replyPayload);
      clearTimeout(timeoutId);
    }
  };

  useFocusEffect(
    useCallback(() => {
      initialize();
      // eslint-disable-next-line
    }, [])
  );

  // calculate width of bubble
  const setBubbleWidth = (messageId: string, width: number) => {
    const newBubbleWidths: any = bubbleWidths;
    newBubbleWidths[messageId] = width;
    setBubbleWidths(newBubbleWidths);
  };

  const onScreenLayout = () => {
    const timeout = setTimeout(() => {
      forceRedrawMessages();
    }, 50);
    timeoutIds.push(timeout);
  };

  const renderFooter = () => {
    return (
      <View style={{ height: isTyping ? uh.h2DP(40) : 0, left: uh.w2DP(10) }}>
        <TypingIndicator isTyping={isTyping} />
      </View>
    );
  };

  const renderChatEmpty = () => {
    // Hack to trigger typing animation after Gift Chat has been initialized
    // Setting setIsTyping(true) before initialized, will not trigger the animation
    // We initialize our code on page focus, but Gifted Chat is usually completes
    // initialization after this callback.
    // File issue with library owner:
    // https://github.com/FaridSafi/react-native-gifted-chat/issues/2020
    setIsTyping(true);
    return <TypingIndicator isTyping={false} />;
  };

  const renderLoading = () => {
    return <></>;
  };

  const pressEmoji = (emojiId: number) => {
    sendMessageReaction(pressedMessageId, emojiId);
    const newMessageReactions = messageReactions;
    newMessageReactions[pressedMessageId] = emojiId;
    setMessageReactions(newMessageReactions);
    setPressedMessageId('');
    forceRedrawMessages();
  };

  const onLinkPress = (url: string) => {
    if (url === undefined) {
      return;
    }
    const index = url.indexOf('kalibra.ai/');
    if (index > -1) {
      const routeName = url.substr(index + 11);
      navigation.navigate(routeName);
    } else {
      if (Platform.OS === 'web') {
        // Open link in new tab
        window.open(url, '_blank');
      } else {
        Linking.openURL(url);
      }
    }
  };

  const scrollToBottomComponent = (): React.ReactNode => {
    return <AntDesign name="downcircleo" size={31} color={th['color-primary-500']} />;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    url: {
      color: 'blue',
      textDecorationLine: 'underline'
    },
    time: { height: 0 },
    quickReply: {
      fontSize: 14,
      fontWeight: '400',
      fontFamily: 'Poppins-Regular',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      maxWidth: 200,
      paddingVertical: uh.h2DP(5),
      paddingHorizontal: uh.w2DP(5),
      minHeight: 37,
      borderRadius: 13,
      margin: uh.h2DP(3),
      backgroundColor: th['color-primary-transparent-100']
    },
    longPressHint: {
      marginBottom: 5,
      fontStyle: 'italic',
      textAlign: 'center',
      marginTop: uh.h2DP(10),
      height: 30,
      backgroundColor: 'transparent'
    },
    avatarContainer: {
      height: 28,
      width: 36,
      backgroundColor: 'transparent'
    }
  });

  if (loading) {
    return (
      <Layout level="2" style={styles.container}>
        <Spinner visible={true} />
      </Layout>
    );
  }

  return (
    <Layout level="2" style={styles.container} onLayout={() => onScreenLayout()}>
      <GiftedChat
        messages={messages}
        inverted={true}
        onSend={(newMessages: IMessage[]) => onSend(newMessages)}
        onQuickReply={(replies: Reply[]) => onQuickReply(replies)}
        user={user}
        scrollToBottom
        renderLoading={renderLoading}
        renderBubble={(props: any) => {
          return (
            <ChatBubble
              pressedMessageId={pressedMessageId}
              message={props}
              bubbleWidth={bubbleWidths[props.currentMessage._id]}
              reactionId={messageReactions[props.currentMessage._id]}
              isShowAllMsgsReaction={isShowAllMsgsReaction}
              pressEmoji={pressEmoji}
            />
          );
        }}
        renderMessageText={(props: any) => {
          return <ChatTextMessage data={props} onLinkPress={onLinkPress} setBubbleWidth={setBubbleWidth} />;
        }}
        minComposerHeight={0}
        maxComposerHeight={0}
        minInputToolbarHeight={0}
        renderInputToolbar={() => null} // Hide the text input
        isTyping={isTyping}
        scrollToBottomComponent={scrollToBottomComponent}
        scrollToBottomStyle={{
          right: Platform.OS === 'web' ? 25 : 8,
          width: Platform.OS === 'web' ? 27 : 30,
          height: Platform.OS === 'web' ? 27 : 30,
          backgroundColor: 'transparent'
        }}
        onLongPress={(context, message) => {
          setPressedMessageId(message._id);
          forceRedrawMessages();
        }}
        renderQuickReplies={(props: any) => <ChatQuickReplies data={props} screenWidth={uh.currentViewPort()} />}
        renderTime={() => <View style={styles.time} />}
        renderAvatar={() => <View style={styles.avatarContainer} />}
        renderFooter={renderFooter}
        renderChatFooter={() => <ChatFooter />}
        renderChatEmpty={renderChatEmpty}
        quickReplyStyle={styles.quickReply}
        bottomOffset={0}
        loadEarlier={loadEarlierMessagesEnabled}
        isLoadingEarlier={loadingEarlierMessages}
        onLoadEarlier={onLoadEarlierMessages}
        wrapInSafeArea={false}
      />
    </Layout>
  );
};

export default memo(KaliChatScreen);
