import React from 'react';
import { ModalService } from '@ui-kitten/components';
import { View, ViewProps, StyleSheet } from 'react-native';
import { AgendaItem, AgendaItemGroup, UIHelper as uh, AppContext } from '../../core';
import ActionListItem from './ActionListItem';
import ActionDetailModal from '../../components/action/modal/ActionDetailModal';
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
import { BackendApi } from 'src/api/shared';
import { useFocusEffect } from '@react-navigation/native';

//props
interface IActionListProps extends ViewProps {
  chatWithKalibraClick: () => void;
  type: 'today' | 'upcoming';
  clearedAllActionsMsg: string;
  noActionsMsg: string;
  noUpcomingActionsMsg: string;
  dontLikeMsg: string;
  refreshing: boolean;
  finishRefreshing: () => void;
}

const ActionList = (props: IActionListProps) => {
  let modalID = '';
  const appContext = React.useContext(AppContext);
  // styles
  const styleContainer = StyleSheet.create({
    container: {
      flexDirection: 'column'
    },
    button: {
      marginTop: uh.h2DP(16)
    },
    item: {
      marginBottom: uh.h2DP(24)
    },
    backdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
  });

  const [todayActionGroups, setTodayActionGroups] = React.useState<Array<AgendaItemGroup>>([]);
  const [upcomingActionGroups, setUpcomingActionGroups] = React.useState<Array<AgendaItemGroup>>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [update, setUpdate] = React.useState(false);
  const tmpProps = props;

  const setData = React.useCallback(
    (actionItems: Array<AgendaItem>) => {
      const needRefresh = appContext.getRefreshActionItemsFlag();
      const itemGroups: AgendaItemGroup[] = [];
      const morningGroup: AgendaItemGroup = { title: 'Morning', subTitle: '', data: [] };
      const afternoonGroup: AgendaItemGroup = { title: 'Afternoon', subTitle: '', data: [] };
      const eveningGroup: AgendaItemGroup = { title: 'Evening', subTitle: '', data: [] };
      if (actionItems !== undefined && actionItems.length > 0) {
        if (props.refreshing == true || needRefresh == true) {
          appContext.setActionItems(actionItems);
        }
        let currentDate = Number(moment(new Date()).format('YYYYMMDD'));
        const today = Number(moment(new Date()).format('YYYYMMDD'));

        for (const agendaItem of actionItems) {
          const newDate = Number(moment(agendaItem.when).format('YYYYMMDD'));

          // Grouping together items from the same day
          if (currentDate !== newDate) {
            currentDate = newDate;

            const record: AgendaItemGroup = {
              title: '',
              subTitle: '',
              data: [agendaItem],
              date: agendaItem.when
            };
            itemGroups.push(record);
          } else {
            const hr = moment(agendaItem.when).hour();
            if (newDate == today) {
              if (hr < 12) {
                morningGroup.data.push(agendaItem);
              } else if (hr < 18) {
                afternoonGroup.data.push(agendaItem);
              } else if (hr < 24) {
                eveningGroup.data.push(agendaItem);
              }
            } else {
              itemGroups[itemGroups.length - 1].data.push(agendaItem);
            }
          }
        }
      }
      setTodayActionGroups([morningGroup, afternoonGroup, eveningGroup]);
      setUpcomingActionGroups(itemGroups);
    },
    [appContext, props.refreshing]
  );

  const getData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await BackendApi.get('/surveys/action-items-new');
      if (response.status >= 200 && response.status <= 399) {
        if (response.data !== undefined) {
          const actionItems: Array<AgendaItem> = response.data.actionItems;
          setData(actionItems);
          setIsLoading(false);
          tmpProps.finishRefreshing();
        }
        appContext.setRefreshActionItemsFlag(false);
      } else {
        console.error(response);
        setIsLoading(false);
        tmpProps.finishRefreshing();
      }
    } catch (loadingError) {
      console.error(loadingError);
      setIsLoading(false);
      tmpProps.finishRefreshing();
    }
  }, [tmpProps, setData, appContext]);

  const checkHandler = (id: string, checked: boolean) => {
    try {
      const actionItems = appContext.getActionItems();
      const index = actionItems.findIndex((item) => item.id == id);
      actionItems[index].userCompleted = checked;
      appContext.setActionItems(actionItems);
    } catch (error) {
      console.error(error?.message);
    }
  };

  const chatWithKalibraClick = () => {
    ModalService.hide(modalID);
    props.chatWithKalibraClick();
  };

  useFocusEffect(
    React.useCallback(() => {
      setUpdate(true);
      if (appContext.getRefreshActionItemsFlag() == true) {
        getData();
      } else {
        setTimeout(() => {
          setUpdate(false);
          const actionItems = appContext.getActionItems();
          if (actionItems != undefined) {
            setData(actionItems);
          }
        }, 20);
      }
    }, [getData, appContext, setData])
  );

  React.useEffect(() => {
    getData();
  }, [getData]);

  React.useEffect(() => {
    if (props.refreshing == true) {
      getData();
    }
  }, [props.refreshing, getData]);

  const renderModalContentElement = (action: AgendaItem) => {
    return (
      <ActionDetailModal
        action={action}
        btnBackHandler={() => {
          ModalService.hide(modalID);
          const actionItems = appContext.getActionItems();
          setData(actionItems);
        }}
        btnChatMoreHandler={chatWithKalibraClick}
        btnLearnMoreHandler={chatWithKalibraClick}
        dontLikeMsg={props.dontLikeMsg}
        checkHandler={checkHandler}
      />
    );
  };

  const showModal = (action: AgendaItem) => {
    const contentElement = renderModalContentElement(action);
    modalID = ModalService.show(contentElement, {
      backdropStyle: styleContainer.backdrop
    });
  };

  const renderActions = () => {
    const data = props.type == 'today' ? todayActionGroups : upcomingActionGroups;
    return data.map((item: AgendaItemGroup, index: number) => {
      return (
        <ActionListItem
          key={`action-${index}`}
          style={styleContainer.item}
          date={props.type == 'upcoming' ? item.date : undefined}
          caption={props.type == 'upcoming' ? '' : item.title}
          actions={item.data}
          actionClick={(action) => {
            ModalService.hide(modalID);
            showModal(action);
          }}
          type={props.type}
          clearedAllActionsMsg={props.clearedAllActionsMsg}
          noActionsMsg={props.noActionsMsg}
          noUpcomingActionsMsg={props.noUpcomingActionsMsg}
        />
      );
    });
  };

  if (isLoading == true && props.refreshing == false) {
    return <Spinner visible={true} />;
  }

  // view
  return (
    <>
      <View style={[styleContainer.container, props.style]}>
        {update == false ? renderActions() : <View>{renderActions()}</View>}
      </View>
    </>
  );
};

export default ActionList;
