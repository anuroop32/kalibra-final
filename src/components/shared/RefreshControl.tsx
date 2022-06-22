import React, { memo } from 'react';

import { Platform, RefreshControl as ReactNativeRefreshControl } from 'react-native';
import { useTheme } from '@ui-kitten/components';
import { RefreshControl as WebRefreshControl } from 'react-native-web-refresh-control';

type Props = React.ComponentProps<typeof ReactNativeRefreshControl>;

const RefreshControl = ({ refreshing, onRefresh, ...props }: Props) => {
  const th = useTheme();

  if (Platform.OS === 'web') {
    return (
      <WebRefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        colors={[th['color-primary-900']]}
        tintColor={th['color-primary-900']}
        {...props}
      />
    );
  }
  // Else use default native solution (iOS/Android)
  return (
    <ReactNativeRefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={[th['color-primary-900']]}
      tintColor={th['color-primary-900']}
      {...props}
    />
  );
};

export default memo(RefreshControl);
