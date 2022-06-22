import React from 'react';
import { ScrollViewProps } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

/**
 * https://github.com/APSL/react-native-keyboard-aware-scroll-view
 */
export const KeyboardAvoidingView = (props: ScrollViewProps): React.ReactElement => {
  const defaultProps: ScrollViewProps = {
    style: { flex: 1 },
    contentContainerStyle: { flexGrow: 1 },
    bounces: false,
    bouncesZoom: false,
    alwaysBounceVertical: false,
    alwaysBounceHorizontal: false
  };

  return React.createElement(KeyboardAwareScrollView, {
    enableOnAndroid: true,
    ...defaultProps,
    ...props
  });
};
