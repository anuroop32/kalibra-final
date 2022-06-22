import React, { useRef } from 'react';
import { StyleSheet, Animated, ViewProps } from 'react-native';
import { Layout, Divider } from '@ui-kitten/components';
import ScoreSummary from '../scoreDetail/scoreSummary/ScoreSummary';
import ScoreOverTime from '../scoreDetail/scoreOvertime/ScoreOverTime';
import ModalHeader from './ModalHeader';
import TrackerData from '../scoreDetail/connectData/TrackerData';
import ConnectAppData from '../scoreDetail/connectData/ConnectAppData';
import { Biomarker, ConnectData, PillarScore, ScoreItem, UIHelper as uh } from '../../../core';
import { KeyboardAvoidingView } from '../../shared';
import moment from 'moment';
import { BackendApi } from 'src/api/shared';

const connectAppDataSummary =
  'Here you can see the information from your connected apps that are relevant to this score.';
const trackerDataSummary =
  'Here you can see the information from your tracker or connected apps that are relevant to this score.';

// get those data(trackerData,connectAppDatan chartData) from apis
const trackerData: ConnectData = {
  connectName: 'Connected device:',
  connectLogo: 'apple-watch',
  biomarkers: [
    {
      name: 'Daily activity today',
      data: { 'Steps today': '9508', 'Active time': '5h 57m' }
    },
    {
      name: 'Heart rate today',
      data: { 'Average HR': '65bpm', 'Max HR': '188bpm' }
    }
  ] as Array<Biomarker>
};

const connectAppData: ConnectData = {
  connectName: 'Connected app:',
  connectLogo: 'headspace',
  biomarkers: [
    {
      data: { 'Meditations this week': '5', 'Mediation time': '3h24m' }
    }
  ] as Array<Biomarker>
};

//props
interface IScoreDetailProps extends ViewProps {
  data: PillarScore;
  btnBackHandler: () => void;
  btnLearnMoreHandler: () => void;
  btnScoreHistoryHandler: () => void;
}

const ScoreDetailModal = (props: IScoreDetailProps) => {
  const moveAnim = useRef(new Animated.Value(uh.height())).current;
  const width = uh.currentViewPort();
  const [chartData, setChartData] = React.useState<Array<ScoreItem>>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  //styles
  const styleContainer = StyleSheet.create({
    screenContainer: {
      padding: uh.h2DP(16),
      paddingTop: 0,
      minHeight: uh.height() - uh.topPos()
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
    divider: { marginTop: uh.h2DP(16) },
    summary: { marginTop: uh.h2DP(13), marginLeft: uh.h2DP(32) },
    pillars: { marginLeft: uh.h2DP(32), marginTop: uh.h2DP(16) },
    goals: { marginLeft: uh.h2DP(32), marginTop: uh.h2DP(16) }
  });

  // TODO : use this function to get score history via props.data.type
  // const getScoreHiostory = () =>{
  // }

  const moveUp = React.useCallback(() => {
    // Will decrease value to 30 in 500 miliseconds
    Animated.timing(moveAnim, {
      toValue: uh.topPos(),
      duration: 500,
      useNativeDriver: true
    }).start();
  }, [moveAnim]);

  const tmpProps = props;
  const getData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await BackendApi.get('/scores/history/' + tmpProps.data.id);
      if (response.status >= 200 && response.status <= 399) {
        const report = response.data;
        const scores =
          tmpProps.data.name == 'Kalibra'
            ? report.scores
            : report.categories.find((item) => item.name == tmpProps.data.name)?.scores;
        const charts: Array<ScoreItem> = [];
        scores.forEach((item: any) => {
          charts.push({
            value: item.score,
            date: moment(item.createdOn).toDate()
          });
        });
        setChartData(charts);
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error(error);
      setIsLoading(false);
    }
  }, [tmpProps]);

  React.useEffect(() => {
    moveUp();
    getData();
  }, [moveUp, getData]);

  const moveDown = (callBackFnc: () => void) => {
    // Will incease value to windowHeight in 500 miliseconds
    Animated.timing(moveAnim, {
      toValue: uh.height(),
      duration: 500,
      useNativeDriver: true
    }).start(() => {
      callBackFnc();
    });
  };

  const renderConnectAppData = () => {
    if (connectAppData === undefined) {
      return <></>;
    }

    return (
      <ConnectAppData
        title="Connect app data"
        summary={connectAppDataSummary}
        data={connectAppData}
        btnSettingClickHandler={() => {
          moveDown(props.btnBackHandler);
        }}
      />
    );
  };

  const renderTrackerData = () => {
    if (trackerData === undefined) {
      return <></>;
    }

    return (
      <TrackerData
        title="Tracker data"
        summary={trackerDataSummary}
        data={trackerData}
        btnSettingClickHandler={() => {
          moveDown(props.btnBackHandler);
        }}
      />
    );
  };

  return (
    <Animated.View style={styleContainer.animatedViewContainer}>
      <ModalHeader
        caption={`${props.data.name} score`}
        btnClickHandler={() => {
          moveDown(props.btnBackHandler);
        }}
      />
      <Divider />
      <KeyboardAvoidingView>
        <Layout level="3" style={[styleContainer.screenContainer]}>
          <ScoreSummary
            data={props.data}
            learnMoreClickHandler={() => {
              moveDown(props.btnLearnMoreHandler);
            }}
          />
          <ScoreOverTime
            isLoading={isLoading}
            pillarScore={props.data}
            graphData={chartData ? chartData : []}
            btnScoreHistoryHandler={() => {
              moveDown(props.btnScoreHistoryHandler);
            }}
          />
          {props.data.type !== 'kalibra' && renderTrackerData()}
          {props.data.type !== 'kalibra' && renderConnectAppData()}
        </Layout>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

export default ScoreDetailModal;
