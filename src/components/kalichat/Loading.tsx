import { Spinner } from '@ui-kitten/components';
import React, { memo } from 'react';

import { View } from 'react-native';

const Loading = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Spinner size="large" status="primary" />
    </View>
  );
};

export default memo(Loading);
