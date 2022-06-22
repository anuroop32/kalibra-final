import { Button } from '@ui-kitten/components';
import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { ActionIcons } from '../ActionIcons';

//props
interface IDontLikeFlagProps extends ViewProps {
  title: string;
  btnClickHandler: () => void;
}
const DontLikeFlag = (props: IDontLikeFlagProps) => {
  // styles
  const styleContainer = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    }
  });

  // view
  return (
    <View style={[styleContainer.container, props.style]}>
      <Button
        accessoryLeft={ActionIcons.FlagIcon}
        size="large"
        appearance="ghost"
        status="primary"
        onPress={props.btnClickHandler}
      >
        {props.title}
      </Button>
    </View>
  );
};

export default DontLikeFlag;
