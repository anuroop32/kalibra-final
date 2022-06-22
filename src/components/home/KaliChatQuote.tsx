import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import KaliSmallIcon from '../../../assets/images/kali-small.svg';
import { Text, useTheme } from '@ui-kitten/components';
import { UIHelper as uh } from '../../core';
import MarkdownText from '../kalichat/MarkdownText';

//props
interface IKaliChatQuoteProps extends ViewProps {
  messages: Array<string>;
  useRender?: boolean;
}

const KaliChatQuote = (props: IKaliChatQuoteProps) => {
  //styles
  const th = useTheme();
  const condColors = {
    quote: th['quote-background-color']
  };

  const styleContainer = StyleSheet.create({
    icon: {
      width: 24,
      marginRight: uh.h2DP(8),
      flexDirection: 'column',
      justifyContent: 'flex-end'
    },
    quote: {
      paddingBottom: uh.h2DP(6),
      paddingTop: uh.h2DP(6),
      paddingStart: uh.h2DP(10),
      paddingEnd: uh.h2DP(10),
      backgroundColor: condColors.quote,
      borderRadius: 8,
      borderBottomLeftRadius: 0,
      marginTop: uh.h2DP(4)
    },
    messageContainer: {
      flex: 1
    }
  });

  const markdownStyles = {
    body: {
      marginTop: -8,
      marginBottom: -6,
      color: th['text-basic-color'],
      fontSize: 14,
      fontWeight: '400',
      fontFamily: 'Poppins-Regular'
    },
    strong: {
      fontSize: 14
    },
    paragraph: {
      fontSize: 14
    },
    link: {
      color: 'blue',
      fontSize: 14
    }
  };

  const renderMessages = () => {
    return props.messages.map((item, index) => {
      const borderBottomRightRadius = index == props.messages.length - 1 ? 8 : 2;
      const borderTopLeftRadius = index > 0 ? 2 : 8;
      const borderTopRightRadius = index > 0 ? 2 : 8;

      return (
        <View
          key={`message-${index}`}
          style={[
            styleContainer.quote,
            {
              borderBottomRightRadius: borderBottomRightRadius,
              borderTopLeftRadius: borderTopLeftRadius,
              borderTopRightRadius: borderTopRightRadius
            }
          ]}
        >
          {props.useRender == true ? (
            <MarkdownText
              style={markdownStyles}
              onLinkPress={() => {
                return true;
              }}
            >
              {item}
            </MarkdownText>
          ) : (
            <Text category="p2">{item}</Text>
          )}
        </View>
      );
    });
  };

  //views
  return (
    <View style={[tw`flex-row`, props.style]}>
      <View style={styleContainer.icon}>
        <KaliSmallIcon />
      </View>
      <View style={styleContainer.messageContainer}>{renderMessages()}</View>
    </View>
  );
};

export default KaliChatQuote;
