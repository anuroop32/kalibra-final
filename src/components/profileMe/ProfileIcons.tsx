import React from 'react';
import { Icon, IconProps } from '@ui-kitten/components';

export const ProfileIcons = {
  AppleWatchIcon: (props: IconProps) => {
    return <Icon {...props} name="apple-watch" pack="kalibraCustomIconPack" />;
  },
  HeadspaceIcon: (props: IconProps) => {
    return <Icon {...props} name="headspace" pack="kalibraCustomIconPack" />;
  },
  DownIcon: (props: IconProps) => {
    return <Icon {...props} name="chevron-down-outline" />;
  },
  UpIcon: (props: IconProps) => {
    return <Icon {...props} name="chevron-up-outline" />;
  },
  ForwardIcon: (props: IconProps) => {
    return <Icon {...props} name="chevron-right-outline" />;
  },
  SearchIcon: (props: IconProps) => {
    return <Icon {...props} name="search-outline" />;
  }
};
