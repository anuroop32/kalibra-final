import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewProps } from 'react-native';
import { Text } from '@ui-kitten/components';

//props
interface ITextAuthLinkProps extends ViewProps {
  clickHandler: () => void;
  message: string;
}

const TextAuthLink = (props: ITextAuthLinkProps) => {
  //style
  const styleContainer = StyleSheet.create({
    textCenter: { alignItems: 'center' },
    clickBtn: { alignSelf: 'center' },
    textAlign: { textAlign: 'center' }
  });

  //view
  return (
    <View style={[styleContainer.textCenter, props.style]}>
      <TouchableOpacity style={styleContainer.clickBtn} onPress={props.clickHandler}>
        <Text style={styleContainer.textAlign} status="primary" category="s2">
          {props.message}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TextAuthLink;
