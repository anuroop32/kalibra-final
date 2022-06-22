import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { Text, useTheme, Avatar } from '@ui-kitten/components';
import { UIHelper as uh } from '../../../core';

//props
interface ICoachMessageProps extends ViewProps {
  messages: Array<string>;
}

const CoachMessage = (props: ICoachMessageProps) => {
  //styles
  const th = useTheme();
  const condColors = {
    quote: th['color-secondary-transparent-200']
  };

  const styleContainer = StyleSheet.create({
    icon: {
      width: 40,
      marginRight: uh.h2DP(8),
      flexDirection: 'column',
      justifyContent: 'flex-end'
    },
    quote: {
      flex: 1,
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
      flex: 1,
      marginLeft: uh.w2DP(8)
    },
    avatar: { marginRight: uh.w2DP(8), width: 40 }
  });

  const renderMessages = () => {
    return props.messages.map((item, index) => {
      const borderBottomRightRadius = index == props.messages.length - 1 ? 8 : 0;
      const borderTopLeftRadius = index > 0 ? 0 : 8;
      const borderTopRightRadius = index > 0 ? 0 : 8;

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
          <Text category="p1">{item}</Text>
        </View>
      );
    });
  };

  //views
  return (
    <View style={[tw`flex-row`, props.style]}>
      <View style={styleContainer.icon}>
        <Avatar shape="rounded" size="large" source={require('../../../../assets/images/avatar.png')} />
      </View>
      <View style={styleContainer.messageContainer}>{renderMessages()}</View>
    </View>
  );
};

export default CoachMessage;
