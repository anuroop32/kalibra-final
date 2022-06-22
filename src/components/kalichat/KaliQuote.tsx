import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import KaliIcon from '../../../assets/images/kali.svg';
import { Text, useTheme } from '@ui-kitten/components';
import { AppContext, UIHelper as uh } from '../../core';
import MarkdownText from './MarkdownText';

//props
interface IKaliQuoteProps extends ViewProps {
  heading: string;
  caption: string;
  onLinkPress?: (url: string) => boolean;
}

const KaliQuote = (props: IKaliQuoteProps) => {
  //styles
  const th = useTheme();
  const ct = React.useContext(AppContext).getTheme();
  const condColors = {
    quote: uh.getHex(th, ct, 'color-basic-400', 'color-basic-800')
  };

  const styleContainer = StyleSheet.create({
    icon: { width: 40, height: 40, marginRight: 8 },
    quote: {
      flex: 1,
      padding: 16,
      backgroundColor: condColors.quote,
      borderRadius: 16,
      borderTopLeftRadius: 0
    },
    caption: { paddingTop: 4 }
  });

  const markdownStyles = {
    body: {
      marginTop: -8,
      marginBottom: -14,
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

  //views
  return (
    <View style={[tw`flex-row`, props.style]}>
      <View style={styleContainer.icon}>
        <KaliIcon />
      </View>
      <View style={styleContainer.quote}>
        <Text category="h6">{props.heading}</Text>
        <MarkdownText style={markdownStyles} onLinkPress={props.onLinkPress}>
          {props.caption}
        </MarkdownText>
      </View>
    </View>
  );
};

export default KaliQuote;
