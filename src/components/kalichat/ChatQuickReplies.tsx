import 'react-native-get-random-values';
import React, { memo } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import QuickReplies from 'react-native-gifted-chat/lib/QuickReplies';
import { useTheme } from '@ui-kitten/components';

//props
interface IChatQuickRepliesProps extends ViewProps {
  data: any;
  screenWidth: number;
}

const ChatQuickReplies = (props: IChatQuickRepliesProps) => {
  const th = useTheme();
  const styles = StyleSheet.create({
    container: {
      width: props.screenWidth - 92,
      alignItems: 'center'
    }
  });

  return (
    <View style={styles.container}>
      {props.data.currentMessage.quickReplies && <View style={{ height: 20 }} />}
      <QuickReplies {...props.data} color={th['color-primary-500']}></QuickReplies>
    </View>
  );
};

export default memo(ChatQuickReplies);
