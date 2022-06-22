import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { AppContext, UIHelper as uh } from '../../core';
import { Button, Text, useTheme } from '@ui-kitten/components';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import MarkdownText from '../kalichat/MarkdownText';

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
      'Kali will make sure your every effort is building towards the same goal by connecting your actions across **6 core health needs:** Move, Nourish, Reflect, Connect, Rest, Grow. You can keep track of progress with your unique **Kalibra Score.** \n\nYou can also **upload your latest bloodwork** or sign up for a **biomarker assessment.** \n\nIf you have been **invited by a coach**, you can  connect to them and share your fitness tracker data.\n\n  You can learn more at **www.kalibra.ai**',
    buttonTitle: 'I want to meet Kali!'
  }
];

//props
interface IPreSignUpProps extends ViewProps {
  finalActionHandler: () => void;
}

const PreSignUp = (props: IPreSignUpProps) => {
  //TODO: fetch data, call useEffect add Json call for Data and UseEffect Hook and add loading screen
  // App Context
  const appContext = React.useContext(AppContext);

  //styles
  const th = useTheme();
  const ctTheme = appContext.getTheme();
  const condColors = {
    backgroundColor: uh.getHex(th, ctTheme, 'color-basic-400', 'color-basic-800')
  };

  const styleContainer = StyleSheet.create({
    imageContainer: { maxWidth: '100%', alignItems: 'center', alignContent: 'center', justifyContent: 'center' },
    spinnerContainer: {
      flex: 1,
      maxWidth: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 5
    },
    image: { width: uh.h2DP(148), height: uh.h2DP(144) },
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
    body: {
      fontFamily: 'Poppins-Regular',
      color: th['text-basic-color'],
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 10
    },

    // Emphasis
    strong: {
      fontFamily: 'Poppins-Bold'
    },

    // Links
    link: {
      textDecorationLine: 'underline'
    },

    // Text Output
    text: { textAlign: 'center' }
  };

  // properties
  const [currentItem, setCurrentItem] = React.useState<any>(() => {
    return kalibraCollection.length > 0 ? kalibraCollection.reverse().pop() : {};
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const opacity = useSharedValue(0);

  // handlers and conditionals
  //===> add the api call to get the data here
  const getNextItemHandler = () => {
    if (kalibraCollection.length == 0) {
      props.finalActionHandler();
      return;
    }
    setIsLoading(true);
    setCurrentItem(kalibraCollection.pop());
    opacity.value = 0;
  };

  const fadeIn = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, { duration: 350 })
    };
  });
  const onLoad = () => {
    opacity.value = 1;
    setIsLoading(false);
  };

  // return View
  return (
    <>
      <Animated.View
        key={currentItem.id}
        style={[styleContainer.imageContainer, isLoading && { backgroundColor: condColors.backgroundColor }]}
      >
        <Animated.Image
          resizeMode="cover"
          source={currentItem.img}
          style={[fadeIn, styleContainer.image]}
          onLoadEnd={onLoad}
        />
      </Animated.View>
      <View>
        <Text category="h6" style={styleContainer.imageTitle}>
          {currentItem.title}
        </Text>
        <MarkdownText style={markdownStyles}>{currentItem.description}</MarkdownText>
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
      </View>
    </>
  );
};

export default PreSignUp;
