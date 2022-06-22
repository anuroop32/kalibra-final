import React, { useState } from 'react';
import { Keyboard, SafeAreaView, StyleSheet } from 'react-native';
import { Button, Input, Layout } from '@ui-kitten/components';
import { settingStyles } from './_settingStyles';
import { useFocusEffect } from '@react-navigation/native';
import TenantDropdownList from '../../components/settings/TenantDropdownList';
import Spinner from 'react-native-loading-spinner-overlay';
import { Auth } from 'aws-amplify';
import { sendFeedback } from '../../api/slack';
import { AppContext, SlackPayload, UIHelper as uh } from 'src/core';

const FeedbackScreen = () => {
  //styles
  const appContext = React.useContext(AppContext);
  const styleContainer = StyleSheet.create({
    screenContainer: { flex: 1 },
    safeAreaView: { flex: 1 },
    input: { height: '80%', marginTop: uh.h2DP(16) },
    text: { minHeight: 300, maxHeight: '80%', textAlignVertical: 'top' },
    sendButton: {
      marginBottom: uh.h2DP(10)
    }
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [fullname, setFullname] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedReasonIndex, setSelectedReasonIndex] = useState(0);
  const reasons = ['Bug Report', 'App Feedback', 'Delete Account'];

  const loadUserData = async () => {
    try {
      setLoading(true);

      const result = await Auth.currentAuthenticatedUser();
      setFullname(result.attributes.name);
      setEmail(result.attributes.email);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

  const changeReason = (index: number) => {
    setSelectedReasonIndex(index);
  };

  const send = async () => {
    setIsSubmitted(true);
    const text = `Name: ${fullname}\nEmail: ${email}\nReason: ${reasons[selectedReasonIndex]}\n${feedback}`;
    const data: SlackPayload = { text: text };

    const result = await sendFeedback(data);
    setIsSubmitted(false);
    if (result && result.status === 200) {
      alert('Thank you! We will get back to you shortly.');
      try {
        appContext.logEvent('FeedbackSent');
      } catch (analyticsError) {
        console.error(analyticsError);
      }
      setFeedback('');
    } else {
      alert("Sorry! Can't send your feedback.");
    }
  };

  if (loading) {
    return <Spinner />;
  }

  //view
  return (
    <Layout level="2" style={[styleContainer.screenContainer, settingStyles.settingScreenContainer]}>
      <SafeAreaView style={styleContainer.screenContainer}>
        <TenantDropdownList
          caption="Reason"
          data={reasons}
          selectedIndex={selectedReasonIndex}
          selecItem={changeReason}
        ></TenantDropdownList>
        <Input
          multiline={true}
          size="large"
          style={styleContainer.input}
          textStyle={styleContainer.text}
          label="Comment"
          placeholder="Please let us know how we can help or make Kalibra better."
          value={feedback}
          onSubmitEditing={Keyboard.dismiss}
          keyboardType="default"
          returnKeyType="done"
          onChangeText={(text: string) => setFeedback(text)}
        />
        <Button
          status="primary"
          disabled={feedback.length <= 0 || isSubmitted === true ? true : false}
          onPress={() => send()}
          style={styleContainer.sendButton}
        >
          Send Feedback
        </Button>
      </SafeAreaView>
    </Layout>
  );
};

export default FeedbackScreen;
