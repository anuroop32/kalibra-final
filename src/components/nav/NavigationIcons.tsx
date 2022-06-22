import React from 'react';
import { Icon, IconProps } from '@ui-kitten/components';

export const NavigationIcons = {
  HomeIcon: (props: IconProps) => {
    return <Icon {...props} name="home-outline" />;
  },
  KaliIcon: (props: IconProps) => {
    return <Icon {...props} name="message-circle-outline" />;
  },
  ActionsIcon: (props: IconProps) => {
    return <Icon {...props} name="calendar-outline" />;
  },
  ProfileIcon: (props: IconProps) => {
    return <Icon {...props} name="person-outline" />;
  },
  ForwardIcon: (props: any) => {
    return <Icon {...props} name="arrow-ios-forward" />;
  },
  GetIcon: (name: string) => {
    switch (name) {
      case 'Home':
        return NavigationIcons.HomeIcon;
      case 'Kali':
        return NavigationIcons.KaliIcon;
      case 'Actions':
        return NavigationIcons.ActionsIcon;
      case 'Profile':
        return NavigationIcons.ProfileIcon;
    }
  }
};
