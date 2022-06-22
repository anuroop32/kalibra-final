import { Text, Avatar, Layout } from '@ui-kitten/components';
import React from 'react';
import { ViewProps, StyleSheet, View } from 'react-native';
import { CoachInfo } from 'src/core/types/CoachInfo';
import { UIHelper as uh, StringHelper as sh } from '../../../core';

//props
interface IAssessmentCoachProps extends ViewProps {
  coach: CoachInfo;
  caption: string;
  btnMessage: string;
}

const AssessmentCoach = (props: IAssessmentCoachProps) => {
  // styles
  const styleContainer = StyleSheet.create({
    avatar: { marginRight: uh.w2DP(16) },
    content: { marginTop: uh.h2DP(4), borderRadius: 8, flexDirection: 'row', padding: uh.h2DP(16) },
    coachInfo: { flex: 3, justifyContent: 'center' },
    description: { marginTop: uh.h2DP(4) },
    btnContainer: { flex: 2, alignItems: 'flex-end', justifyContent: 'center' }
  });

  // view
  return (
    <View style={[props.style]}>
      <Text category="c2" appearance="hint">
        {props.caption}
      </Text>

      <Layout style={styleContainer.content}>
        <Avatar
          style={styleContainer.avatar}
          shape="rounded"
          size="large"
          source={require('../../../../assets/images/avatar.png')}
        />

        <View style={styleContainer.coachInfo}>
          <Text category="s1">{sh.capitalize(props.coach.name)}</Text>
          <Text category="c1" appearance="hint" style={styleContainer.description}>
            View access: {props.coach.permission}
          </Text>
        </View>
      </Layout>
    </View>
  );
};

export default AssessmentCoach;
