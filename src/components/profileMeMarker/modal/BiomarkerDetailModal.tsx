import React, { useRef } from 'react';
import { StyleSheet, Animated, ViewProps } from 'react-native';
import { Layout, Text, Divider, useTheme } from '@ui-kitten/components';
import { Pillar, UIHelper as uh } from '../../../core';
import { KeyboardAvoidingView } from '../../shared';
import AssessmentScore from '../../profileMeAssessment/assessmentDetail/AssessmentScore';
import BarChart from '../../profileMeAssessment/assessmentDetail/BarChart';
import ModalHeader from '../ModalHeader';
import ScoreChart from '../biomarkerDetail/ScoreChart';
import AssessmentPillars from '../../profileMeAssessment/AssessmentPillars';
import IndividualAssessmentList from '../../profileMeAssessment/IndividualAssessmentList';
import { LearnMore } from '../../home';
import { NewHealthMarker } from 'src/core/types/HealthMarkerReport';
import { HealthMarkerReportListItem } from 'src/core/types/HealthMarkerReportList';
import moment from 'moment';
import { BackendApi } from 'src/api/shared';
import { HealthMarkerHistoryValue } from 'src/core/types/HealthMarkerHistory';

//props
interface IBiomarkerDetailProps extends ViewProps {
  biomarker: NewHealthMarker;
  btnBackHandler: () => void;
  btnLearnMoreHandler: () => void;
  btnChatMoreHandler: () => void;
  btnDetailAssessmentClick: (assessmentId: string) => void;
}

const BiomarkerDetailModal = (props: IBiomarkerDetailProps) => {
  const moveAnim = useRef(new Animated.Value(uh.height())).current;
  const th = useTheme();

  let pillars: Array<Pillar> = [
    { name: 'Reflect', type: 'reflect', percent: 54 },
    { name: 'Rest', type: 'rest', percent: 54 }
  ];

  if (props.biomarker.pillar != null && props.biomarker.pillar.length > 0) {
    pillars = [{ name: props.biomarker.pillar, type: props.biomarker.pillar.toLowerCase() }];
  }

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
      width: uh.currentViewPort(),
      transform: [
        {
          translateY: moveAnim as any
        }
      ]
    },
    name: { marginLeft: uh.h2DP(16), marginRight: uh.h2DP(16) },
    score: { marginTop: uh.h2DP(10), marginLeft: uh.h2DP(16), marginRight: uh.h2DP(16) },
    divider: { marginTop: uh.h2DP(16), backgroundColor: th['border-basic-color-3'] },
    summary: { marginTop: uh.h2DP(13), marginLeft: uh.h2DP(32) },
    pillars: {
      flex: 1,
      marginTop: uh.h2DP(16),
      marginLeft: uh.h2DP(16),
      marginRight: uh.h2DP(16),
      marginBottom: uh.h2DP(6)
    },
    goals: { marginLeft: uh.h2DP(32), marginTop: uh.h2DP(16) },
    individualAssessmentList: {
      marginTop: uh.h2DP(16),
      marginLeft: uh.h2DP(16),
      marginRight: uh.h2DP(16)
    },
    barchart: {
      marginTop: uh.h2DP(16),
      marginLeft: uh.w2DP(16),
      marginRight: uh.w2DP(16)
    },
    scoreChangeText: { marginTop: uh.h2DP(16), marginLeft: uh.h2DP(16), marginRight: uh.h2DP(16) },
    scoreChange: { marginTop: uh.h2DP(8), marginLeft: uh.h2DP(16), marginRight: uh.h2DP(16) },
    scoreChart: { marginTop: uh.h2DP(24), marginLeft: uh.h2DP(16), marginRight: uh.h2DP(16) },
    learmore: { marginTop: uh.h2DP(16), marginLeft: uh.h2DP(16), marginRight: uh.h2DP(16) }
  });

  const [assessments, setAssessments] = React.useState<HealthMarkerReportListItem[]>([]);
  const [scoreChanges, setScoreChanges] = React.useState<HealthMarkerHistoryValue[]>([]);
  const [startDate, setStartDate] = React.useState<Date>(new Date());
  const [endDate, setEndDate] = React.useState<Date>(new Date());

  const moveUp = React.useCallback(() => {
    // Will decrease value to 30 in 500 milliseconds
    Animated.timing(moveAnim, {
      toValue: uh.topPos(),
      duration: 500,
      useNativeDriver: true
    }).start();
  }, [moveAnim]);

  const tempProps = props;
  const getInvidualAssessments = React.useCallback(async () => {
    try {
      const response = await BackendApi.get(`health-markers/biomarker-assessment-type/${tempProps.biomarker.id}`);
      if (response.status >= 200 && response.status <= 399) {
        setAssessments(response.data);
      }
    } catch (error: any) {
      console.error(error);
    }
  }, [tempProps]);

  const maxDataPointsToDisplay = 14;
  const getScoreChanges = React.useCallback(async () => {
    const now: moment.Moment = moment();
    const startDateMnt: moment.Moment = moment(now)
      .startOf('day')
      .subtract(maxDataPointsToDisplay - 1, 'days');
    const startMonthDateMnt: moment.Moment = moment(now).startOf('day').subtract(30, 'days');
    const endDateMnt: moment.Moment = moment(now).endOf('day');
    setStartDate(startDateMnt.toDate());
    setEndDate(endDateMnt.toDate());

    const response = await BackendApi.get('/health-markers/history', {
      params: {
        startDate: startMonthDateMnt.toISOString(),
        endDate: endDateMnt.toISOString(),
        keys: tempProps.biomarker.key
      }
    });

    if (response.status >= 200 && response.status <= 399) {
      if (response.data !== undefined) {
        setScoreChanges(response.data.found[0].values);
      }
    }
  }, [tempProps]);

  React.useEffect(() => {
    moveUp();
    getInvidualAssessments();
    getScoreChanges();
  }, [moveUp, getInvidualAssessments, getScoreChanges]);

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
  const btnTellMoreClick = () => {
    moveDown(props.btnLearnMoreHandler);
  };

  return (
    <Animated.View style={styleContainer.animatedViewContainer}>
      <ModalHeader
        caption="Details"
        btnClickHandler={() => {
          moveDown(props.btnBackHandler);
        }}
      />

      <KeyboardAvoidingView>
        <Layout level="2" style={[styleContainer.screenContainer]}>
          <Layout style={{ marginTop: 16, borderRadius: 8, paddingTop: 16, paddingBottom: 16 }}>
            <Text category="h6" style={styleContainer.name}>
              {props.biomarker.name}
            </Text>
            <AssessmentScore
              score={`${props.biomarker.displayValue} ${props.biomarker.unit}`}
              caption="Latest score"
              textCategory="h4"
              style={styleContainer.score}
            />
            <BarChart
              style={styleContainer.barchart}
              healthMarker={props.biomarker}
              currentValue={Number(props.biomarker.displayValue)}
            />
            <Divider style={styleContainer.divider} />
            <AssessmentPillars style={styleContainer.pillars} caption="Pllars" pillars={pillars} size={'large'} />
            <Divider style={styleContainer.divider} />
            <Text style={styleContainer.scoreChangeText} category="s1">
              Score change
            </Text>
            {scoreChanges.length > 0 && (
              <AssessmentScore
                score={`${scoreChanges[scoreChanges.length - 1].value} ${props.biomarker.unit}`}
                caption={moment(scoreChanges[scoreChanges.length - 1].date).format('D MMMM YYYY')}
                textCategory="h6"
                style={styleContainer.scoreChange}
              />
            )}
            {scoreChanges.length > 0 && (
              <ScoreChart
                style={styleContainer.scoreChart}
                endDate={endDate}
                startDate={startDate}
                currentValue={scoreChanges[scoreChanges.length - 1].value}
                currentDate={scoreChanges[scoreChanges.length - 1].date}
                scoreChanges={scoreChanges}
              />
            )}

            {assessments.length > 0 && (
              <>
                <Divider style={styleContainer.divider} />
                <IndividualAssessmentList
                  style={styleContainer.individualAssessmentList}
                  btnClickHandler={(assessmentId) => {
                    moveDown(() => {
                      props.btnDetailAssessmentClick(assessmentId);
                    });
                  }}
                  assessments={assessments}
                  caption="Assessments this was scored in"
                />
              </>
            )}

            {props.biomarker.info != undefined && props.biomarker.info.length > 0 && (
              <>
                <Divider style={styleContainer.divider} />

                <LearnMore
                  style={styleContainer.learmore}
                  btnHandler={btnTellMoreClick}
                  messages={[props.biomarker.info]}
                />
              </>
            )}
          </Layout>
        </Layout>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

export default BiomarkerDetailModal;
