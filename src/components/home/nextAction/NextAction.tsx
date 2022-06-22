import { Text, Button, Layout, ModalService } from '@ui-kitten/components';
import React from 'react';
import { ViewProps, StyleSheet, View } from 'react-native';
import { UIHelper as uh, AgendaItem, AppContext } from '../../../core';
import ActionCheckBox from './ActionCheckBox';
import { HomeIcons } from '../HomeIcons';
import ActionDetailModal from 'src/components/action/modal/ActionDetailModal';
import { BackendApi } from 'src/api/shared';
import Spinner from 'react-native-loading-spinner-overlay';
import { useFocusEffect } from '@react-navigation/native';
// import moment from 'moment';

//props
interface INextActionProps extends ViewProps {
  title: string;
  btnMessage: string;
  btnHandler: () => void;
  itemClick: (id: number) => void;
  chatWithKalibraClick: () => void;
  dontLikeMsg: string;
  refreshing: boolean;
  finishRefreshing: () => void;
}

const NextAction = (props: INextActionProps) => {
  // styles
  let modalID = '';
  const appContext = React.useContext(AppContext);
  const styleContainer = StyleSheet.create({
    container: {
      padding: uh.h2DP(16),
      marginTop: uh.h2DP(40),
      borderRadius: 8,
      flexDirection: 'column'
    },
    button: {
      marginTop: uh.h2DP(16)
    },
    item: {
      marginTop: uh.h2DP(8)
    },
    backdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [update, setUpdate] = React.useState(false);
  const isSubscribed = React.useRef(false);

  const chatWithKalibraClick = () => {
    ModalService.hide(modalID);
    props.chatWithKalibraClick();
  };

  const checkHandler = (id: string, checked: boolean) => {
    try {
      const actionItems = appContext.getActionItems();
      const index = actionItems.findIndex((item) => item.id == id);
      actionItems[index].userCompleted = checked;
      appContext.setActionItems(actionItems);
    } catch (error) {
      console.error(error);
    }
  };

  const renderModalContentElement = (action: AgendaItem) => {
    return (
      <ActionDetailModal
        action={action}
        btnBackHandler={() => {
          setUpdate(true);
          setTimeout(() => {
            setUpdate(false);
          }, 2);
          ModalService.hide(modalID);
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

  const tmpProp = props;
  const getData = React.useCallback(async () => {
    const needRefresh = appContext.getRefreshActionItemsFlag();
    try {
      setIsLoading(true);
      const response = await BackendApi.get('/surveys/action-items-new');
      if (response.status >= 200 && response.status <= 399) {
        if (response.data !== undefined && response.data.actionItems.length >= 0) {
          const actions = appContext.getActionItems();
          if (actions == undefined || tmpProp.refreshing == true || needRefresh) {
            appContext.setActionItems(response.data.actionItems);
          }
        }
        setIsLoading(false);
        appContext.setRefreshActionItemsFlag(false);
        tmpProp.finishRefreshing();
      } else {
        console.error(response);
        setIsLoading(false);
        tmpProp.finishRefreshing();
      }
    } catch (loadingError) {
      console.error(loadingError);
      setIsLoading(false);
      tmpProp.finishRefreshing();
    }
  }, [tmpProp, appContext]);

  useFocusEffect(
    React.useCallback(() => {
      if (appContext.getRefreshActionItemsFlag() == true) {
        getData();
      } else {
        setUpdate(true);
        setTimeout(() => {
          setUpdate(false);
        }, 100);
      }
    }, [getData, appContext])
  );

  React.useEffect(() => {
    getData();
    isSubscribed.current = true;
    return () => {
      isSubscribed.current = false;
    };
  }, [getData]);

  React.useEffect(() => {
    if (props.refreshing == true) {
      isSubscribed.current = true;
      getData();
      return () => {
        isSubscribed.current = false;
      };
    }
  }, [props.refreshing, getData]);

  const getNextData = () => {
    setUpdate(true);
    setTimeout(() => {
      setUpdate(false);
    }, 50);
  };

  // render list of actions
  const renderItems = () => {
    const actionItems = appContext.getActionItems();
    if (actionItems == undefined) {
      return <></>;
    }
    // same date
    // const strCurrentDate = moment().format('DD/MM/YYYY');
    // && moment(item.when).format('DD/MM/YYYY') == strCurrentDate
    const item = actionItems?.find((it) => it.userCompleted == false);
    if (actionItems && actionItems?.length > 0 && item != undefined) {
      const userCompleted = item.userCompleted;
      return (
        <ActionCheckBox
          key={item.id}
          id={item.id}
          checked={userCompleted as boolean}
          style={styleContainer.item}
          actionName={item.text}
          //description={item.validationText}
          pillars={[{ name: item.pillar, type: item.pillar.toLowerCase() }]}
          actionHandler={() => {
            showModal(item);
          }}
          forceReload={() => getNextData()}
        />
      );
    } else {
      return (
        <Text category="c1" appearance="hint">
          No Action
        </Text>
      );
    }
  };

  if (isLoading == true) {
    return <Spinner visible={true} />;
  }
  // view
  return (
    <Layout style={styleContainer.container}>
      <Text category="s1">{props.title}</Text>
      {update == false ? renderItems() : <View>{renderItems()}</View>}
      <Button
        style={styleContainer.button}
        status="primary"
        size="large"
        accessoryRight={HomeIcons.ForwardIcon}
        onPress={props.btnHandler}
      >
        {props.btnMessage}
      </Button>
    </Layout>
  );
};

export default NextAction;
