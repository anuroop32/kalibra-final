import { Text } from '@ui-kitten/components';
import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { AgendaItem, Pillar, UIHelper as uh, AppContext } from '../../core';
import { ActionCheckBox } from '../home';
import moment from 'moment';

//props
interface IActionListItemProps extends ViewProps {
  caption: string;
  date?: Date;
  actions: Array<AgendaItem>;
  actionClick: (action: AgendaItem) => void;
  type: 'today' | 'upcoming';
  clearedAllActionsMsg: string;
  noActionsMsg: string;
  noUpcomingActionsMsg: string;
}

const ActionListItem = (props: IActionListItemProps) => {
  // styles
  const appContext = React.useContext(AppContext);
  const styleContainer = StyleSheet.create({
    container: { flexDirection: 'column' },
    item: { marginTop: uh.h2DP(8) },
    message: { marginTop: uh.h2DP(16) }
  });

  const isTomorrow = (date: Date) => {
    const currenDate = moment(moment(new Date()).format('DD/MM/YYYY'), 'DD/MM/YYYY').toDate();
    if (moment(date).diff(currenDate, 'days') == 1) {
      return true;
    }

    return false;
  };
  const renderActions = () => {
    if (props.actions.length == 0) {
      return (
        <Text category="c1" appearance="hint" style={styleContainer.message}>
          {props.type == 'today' ? props.noActionsMsg + ` ${props.caption.toLowerCase()}.` : props.noUpcomingActionsMsg}
        </Text>
      );
    }

    // const isAllCleared = !props.actions.find((item) => item.status === 0);
    // if (isAllCleared) {
    //   return (
    //     <Text category="c1" appearance="hint" style={styleContainer.message}>
    //       {props.clearedAllActionsMsg + ` ${props.caption.toLowerCase()}.`}
    //     </Text>
    //   );
    // }

    return props.actions.map((item: AgendaItem, index: number) => {
      let pillars: Array<Pillar> = [];
      if (item.pillar.length > 0) {
        pillars = [{ name: item.pillar, type: item.pillar.toLowerCase() }];
      }
      const actionItems = appContext.getActionItems();
      if (actionItems == undefined) {
        return <></>;
      }

      const userCompleted = actionItems.find((it) => it.id == item.id)?.userCompleted;
      if (userCompleted) {
        return (
          <ActionCheckBox
            id={item.id}
            checked={userCompleted as boolean}
            key={index}
            style={styleContainer.item}
            actionName={item.text}
            // description="1 / 5 times"
            pillars={pillars}
            actionHandler={() => {
              props.actionClick(item);
            }}
            forceReload={() => {}}
          />
        );
      } else {
        return (
          <>
            <ActionCheckBox
              id={item.id}
              checked={userCompleted as boolean}
              key={index}
              style={styleContainer.item}
              actionName={item.text}
              // description="1 / 5 times"
              pillars={pillars}
              actionHandler={() => {
                props.actionClick(item);
              }}
              forceReload={() => {}}
            />
          </>
        );
      }
    });
  };

  const renderTodayActionItem = () => {
    return (
      <View style={[styleContainer.container, props.style]}>
        <Text category="s1">{props.caption}</Text>
        {renderActions()}
      </View>
    );
  };

  const renderUpcomingActionItem = () => {
    return (
      <View style={[styleContainer.container, props.style]}>
        <View style={{ flexDirection: 'row' }}>
          <Text category="s1">
            {isTomorrow(props.date as Date) == true ? 'Tomorrow' : moment(props.date).format('ddd')}
          </Text>
          {isTomorrow(props.date as Date) == false && (
            <Text category="p1" appearance="hint" style={{ marginLeft: 8 }}>
              {moment(props.date).format('D MMM')}
            </Text>
          )}
        </View>
        {renderActions()}
      </View>
    );
  };

  if (props.type == 'today') {
    return renderTodayActionItem();
  }
  return renderUpcomingActionItem();
};

export default ActionListItem;
