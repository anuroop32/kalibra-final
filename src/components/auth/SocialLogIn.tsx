import React from 'react';
import { Button, Text } from '@ui-kitten/components';
import { View, StyleSheet, ViewProps } from 'react-native';
import { SocialIcons as icons } from './AuthIcons';
import { AppContext, LoginVariant, UIHelper as uh } from '../../core';
import { NotWorkingFeatureModal } from '../shared/NotWorkingFeatureModal';

//props
enum SocialVariant {
  fbauth = 'fbauth',
  googauth = 'googauth',
  twitauth = 'twitauth',
  appleAuth = 'appleAuth'
}
interface ISocialLoginProps extends ViewProps {
  message: string;
  type: LoginVariant;
  afterSignInUpHandler: () => void;
}

const SocialLogIn = (props: ISocialLoginProps) => {
  // App Context
  const appContext = React.useContext(AppContext);
  const [visible, setVisible] = React.useState(false);

  // styles
  const styleContainer = StyleSheet.create({
    signUpText: { textAlign: 'center' },
    btnContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      paddingTop: uh.h2DP(8)
    },
    button: {
      minHeight: 0,
      minWidth: 0,
      padding: 0,
      borderWidth: 0,
      height: uh.h2DP(56),
      width: uh.w2DP(56),
      maxWidth: 56,
      maxHeight: 56
    }
  });

  //handlers
  const btnClickHandler = (socialType: SocialVariant): void => {
    if (socialType != null) {
      // todo: update this line of codes when implement social login
      setVisible(true);
    } else {
      let token = '';
      // call the social login services and get token
      token = props.type + 'With' + socialType;
      //set token and then call the specific next action
      appContext.setUserToken(token);
      props.afterSignInUpHandler();
    }
  };

  // View
  return (
    <View style={props.style}>
      <Text category="c1" appearance="hint" style={styleContainer.signUpText}>
        {props.message}
      </Text>
      <View style={styleContainer.btnContainer}>
        <Button
          appearance="filled"
          size="giant"
          status="control"
          style={styleContainer.button}
          accessoryLeft={icons.FacebookIcon}
          onPress={() => btnClickHandler(SocialVariant.fbauth)}
        />
        <Button
          appearance="filled"
          size="giant"
          status="control"
          style={styleContainer.button}
          accessoryLeft={icons.GoogleIcon}
          onPress={() => btnClickHandler(SocialVariant.googauth)}
        />
        <Button
          appearance="filled"
          size="giant"
          status="control"
          style={styleContainer.button}
          accessoryLeft={icons.TwitterIcon}
          onPress={() => btnClickHandler(SocialVariant.twitauth)}
        />
        <Button
          appearance="filled"
          size="giant"
          status="control"
          style={styleContainer.button}
          accessoryLeft={icons.AppleLightIconCtm}
          onPress={() => btnClickHandler(SocialVariant.appleAuth)}
        />
        <NotWorkingFeatureModal
          visible={visible}
          closeClick={() => {
            setVisible(false);
          }}
        />
      </View>
    </View>
  );
};

export default SocialLogIn;
