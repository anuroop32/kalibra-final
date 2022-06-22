import { Layout, useTheme, ModalService } from '@ui-kitten/components';
import React from 'react';
import { ViewProps, StyleSheet } from 'react-native';
import { PillarScore, UIHelper as uh } from '../../core';
import KalibraScoreChart from './kalibraScore/KalibraScoreChart';
import InformationButton from './kalibraScore/InformationButton';
import KalibraScoreList from './kalibraScore/KalibraScoreList';
import KalibraScoreHeader from './kalibraScore/KalibraScoreHeader';
import ScoreDetailModal from './modal/ScoreDetailModal';
import { BackendApi } from 'src/api/shared';
import Spinner from 'react-native-loading-spinner-overlay';

//props
interface IKalibraScoreProps extends ViewProps {
  learnMoreClickHandler: () => void;
  scoreHistoryClickHandler: () => void;
  kalibraScoreSummaryText: string;
  learnMoreAccuracyText: string;
  refreshing: boolean;
  finishRefreshing: () => void;
}

const KalibraScore = (props: IKalibraScoreProps) => {
  let modalID = '';
  const th = useTheme();
  // styles
  const styleContainer = StyleSheet.create({
    container: {
      marginTop: uh.h2DP(16),
      borderRadius: 8,
      flex: 1
    },
    scoreList: { marginTop: uh.h2DP(16) },
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
      const response = await BackendApi.get('/scores');
      if (isSubscribed.current == false) {
        return;
      }
      if (response.status >= 200 && response.status <= 399) {
        const report = response.data;
        const scores: Array<PillarScore> = [];
        scores.push({
          id: '0', // set this is default for the total score
          type: 'kalibra',
          name: 'Kalibra',
          summary:
            'This is a basic description of the score. What it’s all about and what’s involved in calculating it.',
          score: report.scores[0].score,
          currentValueIndex: 10,
          accuracy: report.scores[0].nominalTotalAccuracy
        } as PillarScore);

        report.categories.forEach((item: any) => {
          scores.push({
            id: item.id,
            type: item.name.toLowerCase(),
            name: item.name,
            summary:
              'This is a basic description of the score. What it’s all about and what’s involved in calculating it.',
            score: item.scores[0].score,
            currentValueIndex: 10,
            accuracy: item.scores[0].nominalTotalAccuracy
          } as PillarScore);
        });
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

  React.useEffect(() => {
    isSubscribed.current = true;
    getData();
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

  if (isLoading == true && props.refreshing == false) {
    return <Spinner visible={true} />;
  }

  if (kalibraScores.length == 0) {
    return <></>;
  }

  // view
  return (
    <Layout style={styleContainer.container}>
      <KalibraScoreHeader btnClickHandler={() => showModal(kalibraScores[0])} summary={props.kalibraScoreSummaryText} />
      <KalibraScoreChart pillarScores={kalibraScores.slice(1)} />
      <InformationButton
        onPress={props.learnMoreClickHandler}
        title={props.learnMoreAccuracyText}
        color={th['color-secondary-500']}
      />
      <KalibraScoreList
        btnClickHandler={(item) => showModal(item)}
        style={styleContainer.scoreList}
        pillarScores={kalibraScores.slice(1)}
      />
    </Layout>
  );
};

export default KalibraScore;
