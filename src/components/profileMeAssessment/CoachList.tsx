import { Text } from '@ui-kitten/components';
import React from 'react';
import { ViewProps, StyleSheet, View } from 'react-native';
import { CoachInfo } from 'src/core/types/CoachInfo';
import { UIHelper as uh } from '../../core';
import CoachListItem from './CoachListItem';

//props
interface ICoachListProps extends ViewProps {
  btnClickHandler: (coachId: string) => void;
  coaches: Array<CoachInfo>;
  caption: string;
  btnMessage: string;
}

const CoachList = (props: ICoachListProps) => {
  // styles
  const styleContainer = StyleSheet.create({
    item: { marginTop: uh.h2DP(16) }
  });

  const renderItems = () => {
    return props.coaches.map((item, index) => {
      return (
        <CoachListItem
          style={styleContainer.item}
          key={`item-index-${index}`}
          coach={item}
          btnMessage={props.btnMessage}
          btnClickHandler={props.btnClickHandler}
        />
      );
    });
  };

  // view
  return (
    <View style={[props.style]}>
      <Text category="c2" appearance="hint">
        {props.caption}
      </Text>
      {renderItems()}
      {/* 
      <View style={styleContainer.content}>
        <Avatar
          style={styleContainer.avatar}
          shape="rounded"
          size="medium"
          source={require('../../../assets/images/avatar.png')}
        />

        <View style={styleContainer.coachInfo}>
          <Text category="s1">
            {sh.capitalize(props.coachName)}
          </Text>
          <Text category="c1" appearance="hint">
            View access: {props.coachPermission}
          </Text>
        </View>
        <View style={styleContainer.btnContainer}>
          <Button status="basic" size="small">
            {props.btnMessage}
          </Button>
        </View>
      </View> */}
    </View>
  );
};

export default CoachList;
