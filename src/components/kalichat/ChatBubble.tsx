import 'react-native-get-random-values';
import React, { memo } from 'react';
import { FlexAlignType, StyleSheet, TouchableOpacity, View, ViewProps } from 'react-native';
import { AntDesign, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { Bubble, utils } from 'react-native-gifted-chat';
import { useTheme, Card } from '@ui-kitten/components';
import { AppContext, UIHelper as uh } from '../../core';

//props
interface IChatBubbleProps extends ViewProps {
  bubbleWidth: number;
  message: any;
  reactionId: number;
  pressedMessageId: string;
  isShowAllMsgsReaction: boolean;
  pressEmoji: (i: number) => void;
}

const ChatBubble = (props: IChatBubbleProps) => {
  const th = useTheme();
  const ct = React.useContext(AppContext).getTheme();
  const condColors = {
    bubbleBg: uh.getHex(th, ct, 'color-basic-400', 'color-basic-800')
  };
  const reactionBgColor = '#D2D5D9';
  const reactionIconColor = '#4C4F56';
  const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    iconContainer: {
      height: uh.h2DP(40),
      width: uh.w2DP(40)
    },

    smallCircle1: {
      position: 'absolute',
      width: 10,
      height: 10,
      top: uh.h2DP(35),
      left: uh.w2DP(27),
      borderRadius: 10 / 2
    },
    smallCircle2: {
      position: 'absolute',
      width: 4,
      height: 4,
      top: uh.h2DP(47),
      left: uh.w2DP(35),
      borderRadius: 4 / 2
    },
    reactionContainer: {
      flexDirection: 'row',
      top: 0,
      zIndex: -1,
      borderRadius: 30,
      paddingHorizontal: 0,
      height: 40
    },
    listIconsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '90%',
      marginLeft: uh.w2DP(10),
      marginRight: uh.w2DP(20)
    },
    smallIconContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 35,
      height: 35
    },
    url: {
      color: 'blue',
      textDecorationLine: 'underline'
    }
  });

  const renderEmojiIcon = (iconId: number, iconColor: string, isLargeIcon = true) => {
    let iconSize = 30;
    if (isLargeIcon === false) {
      iconSize = 20;
    }

    switch (iconId) {
      case 1:
        return <MaterialCommunityIcons name="heart" size={iconSize} color={iconColor} />;
      case 2:
        return <AntDesign name="like1" size={iconSize} color={iconColor} />;

      case 3:
        return <AntDesign name="dislike1" size={iconSize} color={iconColor} />;

      case 4:
        return <FontAwesome5 name="laugh-squint" size={iconSize} color={iconColor} />;

      case 5:
        return (
          <View style={{ flexDirection: 'row' }}>
            <FontAwesome5 name="exclamation" size={iconSize} color={iconColor} style={{ marginRight: 0 }} />
            <FontAwesome5 name="exclamation" size={iconSize} color={iconColor} style={{ marginLeft: 0 }} />
          </View>
        );

      case 6:
        return <FontAwesome5 name="question" size={iconSize} color={iconColor} />;
    }
  };

  const renderListOfEmojiIcons = (iconColor: string) => {
    const emojiIcons: Array<number> = [];
    for (let i = 1; i <= 6; i++) {
      emojiIcons.push(i);
    }

    return emojiIcons.map((i) => {
      return (
        <TouchableOpacity key={`key ${i}`} onPress={() => props.pressEmoji(i)}>
          {renderEmojiIcon(i, iconColor, true)}
        </TouchableOpacity>
      );
    });
  };

  const slideInUp = {
    from: {
      translateY: 100
    },
    to: {
      translateY: 0
    }
  };

  const flexStyle: FlexAlignType = props.message.position === 'left' ? 'flex-start' : 'flex-end';
  const { currentMessage, previousMessage, nextMessage } = props.message;
  const isSameNextUser = currentMessage && nextMessage && utils.isSameUser(currentMessage, nextMessage);
  const isSameNextDay = currentMessage && nextMessage && utils.isSameDay(currentMessage, nextMessage);
  const isSamePreviousUser = currentMessage && previousMessage && utils.isSameUser(currentMessage, previousMessage);
  const isSamePreviousDay = currentMessage && previousMessage && utils.isSameDay(currentMessage, previousMessage);

  return (
    <View style={[styles.container, { marginRight: 12 }]}>
      <Animatable.View animation={slideInUp} duration={400} style={styles.container}>
        <View style={{ alignSelf: flexStyle, flex: 1 }}>
          {props.pressedMessageId === props.message.currentMessage._id && (
            <View
              style={[
                styles.reactionContainer,
                {
                  left: props.message.position === 'right' ? 0 : props.bubbleWidth < 250 ? 0 : props.bubbleWidth - 240,
                  width: 250,
                  backgroundColor: reactionBgColor
                }
              ]}
            >
              <View style={[styles.smallCircle1, { left: 230, backgroundColor: reactionBgColor }]} />
              <View style={[styles.smallCircle2, { left: 238, backgroundColor: reactionBgColor }]} />
              <View style={styles.listIconsContainer}>{renderListOfEmojiIcons(reactionIconColor)}</View>
            </View>
          )}

          {props.reactionId > 0 &&
            props.bubbleWidth != undefined &&
            props.isShowAllMsgsReaction === true &&
            props.pressedMessageId != props.message.currentMessage._id && (
              <View
                style={[
                  styles.reactionContainer,
                  {
                    left: props.message.position === 'right' ? 35 : props.bubbleWidth - 30,
                    width: 35,
                    height: 35,
                    backgroundColor: th['color-primary-500']
                  }
                ]}
              >
                <View>
                  <View
                    style={[
                      styles.smallCircle1,
                      {
                        left: 22,
                        top: 29,
                        backgroundColor: th['color-primary-500']
                      }
                    ]}
                  />
                  <Card
                    style={[
                      styles.smallCircle2,
                      {
                        left: 29,
                        top: 41,
                        backgroundColor: th['color-primary-500']
                      }
                    ]}
                  />
                  <View style={styles.smallIconContainer}>{renderEmojiIcon(props.reactionId, 'white', false)}</View>
                </View>
              </View>
            )}

          <View style={{ height: 5 }} />
          <Bubble
            {...props.message}
            wrapperStyle={{
              left: {
                backgroundColor: condColors.bubbleBg,
                borderRadius: 0,
                borderTopLeftRadius: isSamePreviousDay == false || isSamePreviousUser == false ? 16 : 2,
                borderTopRightRadius: isSamePreviousUser == false || isSamePreviousDay == false ? 16 : 2,
                borderBottomRightRadius: isSameNextDay == false || isSameNextUser == false ? 16 : 2
              },
              right: {
                backgroundColor: th['color-primary-500'],
                borderRadius: 0,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                borderBottomLeftRadius: 16
              }
            }}
          ></Bubble>

          <View style={{ height: 5 }} />
        </View>
      </Animatable.View>
    </View>
  );
};

export default memo(ChatBubble);
