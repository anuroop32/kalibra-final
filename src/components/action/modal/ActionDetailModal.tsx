import React, { useRef } from 'react';
import { StyleSheet, Animated, ViewProps } from 'react-native';
import { Layout, Text, CheckBox, Divider, useTheme } from '@ui-kitten/components';
import DontLikeFlag from '../actionDetail/DontLikeFlag';
import ActionGoals from '../actionDetail/ActionGoals';
import ActionPillars from '../actionDetail/ActionPillars';
import ActionRepeat from '../actionDetail/ActionRepeat';
import ActionSummary from '../actionDetail/ActionSummary';
import { UIHelper as uh, Pillar, AgendaItem, AgendaItemDetail } from '../../../core';
import { KeyboardAvoidingView } from '../../shared';
import ActionHeader from '../actionDetail/ActionHeader';
import { BackendApi } from 'src/api/shared';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';

//props
interface IActionDetailProps extends ViewProps {
  action: AgendaItem;
  dontLikeMsg: string;
  btnBackHandler: () => void;
  btnLearnMoreHandler: () => void;
  btnChatMoreHandler: () => void;
  checkHandler: (id: string, checked: boolean) => void;
}

const ActionDetailModal = (props: IActionDetailProps) => {
  const moveAnim = useRef(new Animated.Value(uh.height())).current;
  const width = uh.currentViewPort();
  const th = useTheme();

  //styles
  const [activeChecked, setActiveChecked] = React.useState(props.action.userCompleted);
  const [actionDetail, setActionDetail] = React.useState<AgendaItemDetail>();
  const [isLoading, setIsLoading] = React.useState(false);
  const styleContainer = StyleSheet.create({
    screenContainer: {
      padding: uh.h2DP(16),
      paddingTop: 0
    },
    animatedViewContainer: {
      height: uh.height() - uh.topPos(),
      position: 'absolute',
      alignSelf: 'center',
      width: width,
      transform: [
        {
          translateY: moveAnim as any
        }
      ]
    },
    checkbox: { marginRight: uh.h2DP(60), marginTop: uh.h2DP(26) },
    divider: { marginTop: uh.h2DP(16), backgroundColor: th['border-basic-color-3'] },
    summary: { marginTop: uh.h2DP(13), marginLeft: uh.h2DP(32) },
    pillars: { marginLeft: uh.h2DP(32), marginTop: uh.h2DP(16) },
    goals: { marginLeft: uh.h2DP(32), marginTop: uh.h2DP(16) }
  });

  const moveUp = React.useCallback(() => {
    // Will decrease value to 30 in 500 milliseconds
    Animated.timing(moveAnim, {
      toValue: uh.topPos(),
      duration: 500,
      useNativeDriver: true
    }).start();
  }, [moveAnim]);

  React.useEffect(() => {
    moveUp();
  }, [moveUp]);

  const moveDown = (callBackFnc: () => void) => {
    // Will increase value to windowHeight in 500 milliseconds
    Animated.timing(moveAnim, {
      toValue: uh.height(),
      duration: 500,
      useNativeDriver: true
    }).start(() => {
      callBackFnc();
    });
  };

  //properties and handlers
  const btnChatMoreClick = () => {
    moveDown(props.btnChatMoreHandler);
  };

  //properties and handlers
  const btnTellMoreClick = () => {
    moveDown(props.btnLearnMoreHandler);
  };

  //properties and handlers
  const btnDontLikeClick = () => {
    moveDown(props.btnBackHandler);
  };

  //properties and handlers
  const btnMarkAsHabitClick = () => {};

  const pillars: Array<Pillar> = [{ name: props.action.pillar, type: props.action.pillar.toLowerCase() }];

  const tmpProps = props;
  const getData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await BackendApi.get(`/surveys/action-item-new/${tmpProps.action.id}`);
      if (response.status >= 200 && response.status <= 399) {
        if (response.data !== undefined) {
          setIsLoading(false);
          setActionDetail(response.data);
        }
      } else {
        console.error(response);
        setIsLoading(false);
      }
    } catch (loadingError) {
      console.error(loadingError);
      setIsLoading(false);
    }
  }, [tmpProps]);

  React.useEffect(() => {
    getData();
  }, [getData]);

  const completeAction = async (nextChecked: boolean) => {
    const response = await BackendApi.put(`/surveys/action-item/${props.action.id}`, {
      completed: nextChecked
    });
    props.checkHandler(props.action.id, nextChecked);

    if (response.status >= 200 && response.status <= 399) {
      setActiveChecked(nextChecked);
    }
  };

  return (
    <Animated.View style={styleContainer.animatedViewContainer}>
      <ActionHeader
        caption="Details"
        btnClickHandler={() => {
          moveDown(props.btnBackHandler);
        }}
      />

      {isLoading == true && <Spinner visible={true} />}

      <KeyboardAvoidingView>
        <Layout level="2" style={[styleContainer.screenContainer]}>
          <CheckBox
            style={styleContainer.checkbox}
            checked={activeChecked}
            onChange={(nextChecked) => completeAction(nextChecked)}
          >
            <Text category="h6">{props.action.validationText}</Text>
          </CheckBox>
          <ActionSummary
            summary={props.action.text as string}
            style={styleContainer.summary}
            btnHandler={btnChatMoreClick}
          />
          <Divider style={styleContainer.divider} />
          <ActionPillars pillars={pillars} style={styleContainer.pillars} />

          <Divider style={styleContainer.divider} />
          <ActionGoals style={styleContainer.goals} totalTimes={5} doneTimes={1} />

          <Divider style={styleContainer.divider} />
          <ActionRepeat
            repeatFrequencyDays={actionDetail?.repeatFrequencyDays as number}
            date={moment(props.action.when).add(actionDetail?.durationDays, 'days').toDate()}
            btnClickHandler={btnTellMoreClick}
            btn2ClickHandler={btnMarkAsHabitClick}
          />
          <DontLikeFlag title={props.dontLikeMsg} btnClickHandler={btnDontLikeClick} style={{ marginTop: 20 }} />
        </Layout>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

export default ActionDetailModal;
