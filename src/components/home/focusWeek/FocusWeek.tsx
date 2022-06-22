import { Text, Layout, ModalService } from '@ui-kitten/components';
import React from 'react';
import { ViewProps, StyleSheet } from 'react-native';
import { BackendApi } from 'src/api/shared';
import { ScoreDetailModal } from 'src/components/profileMe';
import { UIHelper as uh, PillarScore, AppContext } from '../../../core';
import FocusWeekItem from './FocusWeekItem';
import Spinner from 'react-native-loading-spinner-overlay';
import { useFocusEffect } from '@react-navigation/native';

//props
interface IFocusWeekProps extends ViewProps {
  title: string;
  summary: string;
  learnMoreClickHandler: () => void;
  refreshing: boolean;
  finishRefreshing: () => void;
}

const FocusWeek = (props: IFocusWeekProps) => {
  let modalID = '';
  const appContext = React.useContext(AppContext);
  // styles
  const styleContainer = StyleSheet.create({
    container: {
      marginTop: uh.h2DP(16),
      padding: uh.h2DP(16),
      borderRadius: 8,
      flexDirection: 'column'
    },
    summary: {
      marginTop: uh.h2DP(4)
    },
    item: {
      marginTop: uh.h2DP(16),
      height: 32
    },
    backdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [kalibraScores, setKalibraScores] = React.useState<PillarScore[]>([]);
  const isSubscribed = React.useRef(false);

  const renderModalContentElement = (item: PillarScore) => {
    return (
      <ScoreDetailModal
        btnBackHandler={() => {
          ModalService.hide(modalID);
        }}
        btnLearnMoreHandler={() => {
          ModalService.hide(modalID);
          props.learnMoreClickHandler();
        }}
        btnScoreHistoryHandler={() => {
          ModalService.hide(modalID);
          props.scoreHistoryClickHandler();
        }}
        data={item}
      />
    );
  };

  const showModal = (item: PillarScore) => {
    const contentElement = renderModalContentElement(item);
    modalID = ModalService.show(contentElement, {
      backdropStyle: styleContainer.backdrop
    });
  };

  const tmpProp = props;
  const getData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await BackendApi.get('/scores/get-user-weekly-pillars-score');
      if (isSubscribed.current == false) {
        return;
      }
      if (response.status >= 200 && response.status <= 399) {
        const report = response.data;
        let scores: Array<PillarScore> = [];

        report.forEach((item: any) => {
          if (scores.find((it) => it.name == item.name) == undefined) {
            scores.push({
              id: item.id,
              type: item.name.toLowerCase(),
              name: item.name,
              summary:
                'This is a basic description of the score. What it’s all about and what’s involved in calculating it.',
              score: item.weeklyScore.score,
              currentValueIndex: 10,
              accuracy: item.weeklyScore.nominalTotalAccuracy
            } as PillarScore);
          }
        });
        scores = scores.sort((a, b) => b.score - a.score);
        setKalibraScores(scores);
        setIsLoading(false);
        tmpProp.finishRefreshing();
      } else {
        console.error(response);
        setIsLoading(false);
        tmpProp.finishRefreshing();
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      tmpProp.finishRefreshing();
    }
  }, [tmpProp]);

  const renderItems = () => {
    return kalibraScores.map((item, index) => {
      return (
        <FocusWeekItem
          key={`FocusWeekItem-${index}`}
          style={styleContainer.item}
          pillarName={item.name}
          pillarType={item.type}
          percentage={Number(item.score)}
          actionHandler={() => {
            showModal(item);
          }}
        />
      );
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      if (appContext.getRefreshActionItemsFlag() == true) {
        getData();
      }
    }, [getData, appContext])
  );

  React.useEffect(() => {
    if (props.refreshing == true) {
      isSubscribed.current = true;
      getData();
      return () => {
        isSubscribed.current = false;
      };
    }
  }, [props.refreshing, getData]);

  React.useEffect(() => {
    isSubscribed.current = true;
    getData();
    return () => {
      isSubscribed.current = false;
    };
  }, [getData]);

  if (isLoading == true && props.refreshing == false) {
    return <Spinner visible={true} />;
  }

  if (kalibraScores == undefined || kalibraScores.length == 0) {
    return <></>;
  }

  // view
  return (
    <Layout style={styleContainer.container}>
      <Text category="s1">{props.title}</Text>
      <Text category="c1" appearance="hint" style={styleContainer.summary}>
        {props.summary}
      </Text>
      {renderItems()}
    </Layout>
  );
};

export default FocusWeek;
