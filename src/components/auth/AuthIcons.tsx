import React from 'react';
import { Icon, IconProps } from '@ui-kitten/components';
import AppleIcon from '../../../assets/images/icon-apple.svg';
import { View } from 'react-native';

export const SocialIcons = {
  FacebookIcon: (props: IconProps) => {
    return <Icon {...props} name="facebook" />;
  },
  GoogleIcon: (props: IconProps) => {
    return <Icon {...props} name="google" />;
  },
  TwitterIcon: (props: IconProps) => {
    return <Icon {...props} name="twitter" />;
  },
  // this is work around to import custom svg icons
  AppleLightIconCtm: (props: any) => {
    return (
      <View {...props} style={{ maxHeight: 24, maxWidth: 24, marginBottom: 2 }}>
        <AppleIcon />
      </View>
    );
  }
};
