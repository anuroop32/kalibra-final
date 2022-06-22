import React from 'react';
import { View, StyleSheet, ViewProps, Animated } from 'react-native';
import { UIHelper as uh } from '../../core';
import { Button, Spinner, Text, useTheme } from '@ui-kitten/components';
import { MarkdownText } from '../kalichat';

//dummy data
const kalibraCollection = [
  {
    id: 1,
    img: require('../../../assets/images/kali_icon.png'),
    title: 'It’s your health. Be intentional.',
    description:
      'Kalibra is the first app to connect your complete health needs in a **single conversation**, delivering personalised insights and actions to create positive habits. \n\n Meet Kali, your **personal health coach.** We all need a coach to set our direction and keep us on track.',
    buttonTitle: 'Next'
  },
  {
    id: 2,
    img: require('../../../assets/images/big_kali.png'),
    title: 'Kali’s got your back.',
    description:
      'Kali will make sure your every effort is building towards the same goal by connecting your actions across **6 core health needs:** Move, Nourish, Reflect, Connect, Rest, Grow. You can keep track of progress with your unique **Kalibra Score.** \n\nYou can also **upload your latest bloodwork** or sign up for a **biomarker assessment.** \n\nIf you have been **invited by a coach**, you can  connect to them and share your fitness tracker data.\n\nYou can learn more at **www.kalibra.ai**',
    buttonTitle: 'I want to meet Kali!'
  }
];

interface IPreSignUpAltProps extends ViewProps {
  finalActionHandler: () => void;
}

const PreSignUpAlt = (props: IPreSignUpAltProps) => {
  const th = useTheme();
  //styles
  const styleContainer = StyleSheet.create({
    imageContainer: { maxWidth: '100%', alignItems: 'center', alignContent: 'center', justifyContent: 'center' },
    imageLoading: { position: 'absolute', zIndex: -1 },
    spinnerContainer: {
      flex: 1,
      maxWidth: '100%',
      alignItems: 'center',
      justifyContent: 'center'
    },
    image: { width: uh.h2DP(148), height: uh.h2DP(144) },
    imageOpacity: { opacity: 1 },
    imageTitle: {
      textAlign: 'center',
      paddingTop: uh.h2DP(32),
      paddingBottom: uh.h2DP(24)
    },
    imageDescription: { textAlign: 'center', paddingBottom: uh.h2DP(32) },
    button: { width: '100%' }
  });

  const markdownStyles = {
    // The main container
    root: {
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center'
    },
    body: {
      fontFamily: 'Poppins-Regular',
      color: th['text-basic-color'],
      fontSize: 14,
      flexDireaction: 'center',
      marginBottom: 10
    },
    // Emphasis
    strong: {
      fontSize: 14
    },
    // Links
    link: {
      textDecorationLine: 'underline',
      fontSize: 14
    },
    // Text Output
    text: {}
  };

  // properties
  const [currentItem, setCurrentItem] = React.useState<any>(() => {
    return kalibraCollection.length > 0 ? kalibraCollection.reverse().pop() : {};
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const opacity = React.useRef(new Animated.Value(0)).current;

  //handlers and conditional
  //===> add the api call to get the data here
  const getNextItemHandler = () => {
    if (kalibraCollection.length == 0) {
      props.finalActionHandler();
      return;
    }
    setIsLoading(true);
    setCurrentItem(kalibraCollection.pop());
    opacity.setValue(0);
  };
  const onLoad = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 350,
      useNativeDriver: false
    }).start();
    setIsLoading(false);
  };

  return (
    <>
      <Animated.View key={currentItem.id} style={[styleContainer.imageContainer]}>
        {isLoading && (
          <View style={[styleContainer.spinnerContainer]}>
            <Spinner status="primary" size="giant" />
          </View>
        )}
        <Animated.Image
          resizeMode="cover"
          source={{ uri: currentItem.img }}
          style={[{ opacity: opacity }, isLoading && styleContainer.imageLoading, styleContainer.image]}
          onLoadEnd={onLoad}
        />
      </Animated.View>
      <View>
        <Text category="h6" style={[styleContainer.imageTitle]}>
          {currentItem.title}
        </Text>
        <View
          style={{
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center',
            flexDirection: 'center',
            textAlign: 'center'
          }}
        >
          <MarkdownText style={markdownStyles}>{currentItem.description}</MarkdownText>
        </View>
      </View>
      <Button
        style={styleContainer.button}
        size="giant"
        status="primary"
        onPress={getNextItemHandler}
        disabled={isLoading}
      >
        <Text status="primary" category="s2">
          {currentItem.buttonTitle}
        </Text>
      </Button>
    </>
  );
};

export default PreSignUpAlt;
