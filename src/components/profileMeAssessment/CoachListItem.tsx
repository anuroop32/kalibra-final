import { Text, Avatar } from '@ui-kitten/components';
import React from 'react';
import { ViewProps, StyleSheet, View } from 'react-native';
import { CoachInfo } from 'src/core/types/CoachInfo';
import { UIHelper as uh, StringHelper as sh } from '../../core';

//props
interface ICoachListItemProps extends ViewProps {
  btnClickHandler: (coachId: string) => void;
  coach: CoachInfo;
  btnMessage: string;
}

const CoachListItem = (props: ICoachListItemProps) => {
  // styles
  const styleContainer = StyleSheet.create({
    avatar: { marginRight: uh.w2DP(8) },
    content: { marginTop: uh.h2DP(12), borderRadius: 8, flexDirection: 'row' },
    coachInfo: { flex: 3, justifyContent: 'center' },
    btnContainer: { flex: 2, alignItems: 'flex-end', justifyContent: 'center' }
  });

  // view
  return (
    <View style={[props.style]}>
      <View style={styleContainer.content}>
        <Avatar
          style={styleContainer.avatar}
          shape="rounded"
          size="medium"
          source={require('../../../assets/images/avatar.png')}
        />

        <View style={styleContainer.coachInfo}>
          <Text category="s1">{sh.capitalize(props.coach.name)}</Text>
          <Text category="c1" appearance="hint">
            View access: {props.coach.permission}
          </Text>
        </View>
        {/* <View style={styleContainer.btnContainer}>
          <Button status="basic" size="small" onPress={() => props.btnClickHandler(props.coach.id as string)}>
            {props.btnMessage}
          </Button>
        </View> */}
      </View>
    </View>
  );
};

export default CoachListItem;
