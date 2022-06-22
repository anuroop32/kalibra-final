import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Layout, Divider } from '@ui-kitten/components';
import { RootTabScreenProps, UIHelper as uh } from '../../core';
import { AssessmentSummary, AssessmentListSection } from '../../components/profileMeAssessment';
import { BackendApi } from 'src/api/shared';
import { HealthMarkerGroup, HealthMarkerReport } from 'src/core/types/HealthMarkerReport';
import Spinner from 'react-native-loading-spinner-overlay';
import RefreshControl from 'src/components/shared/RefreshControl';

const AssessmentDetailScreen = ({ route, navigation }: RootTabScreenProps<'Home'>) => {
  //styles
  const styleContainer = StyleSheet.create({
    screenContainer: {
      padding: uh.h2DP(16),
      paddingBottom: uh.h2DP(24),
      paddingTop: 0,
      flex: 1
    },
    scroll: { height: uh.height() - uh.h2DP(60) }
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [groups, setGroups] = React.useState<HealthMarkerGroup[]>(new Array<HealthMarkerGroup>());
  const [assessmentDate, setAssessmentDate] = React.useState<Date>();
  const [assessorName, setAssessorName] = React.useState<string>('');
  const [assesssmentType, setAssessmentType] = React.useState<string>('');
  const [assessmentName, setAssessmentName] = React.useState<string>('');
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const assessmentIdParam = route?.params?.assessmentId || '';

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
  }, []);

  const resetData = () => {
    setGroups([]);
    setAssessmentDate(new Date());
    setAssessorName('');
    setAssessmentName('');
    setAssessmentType('');
  };

  const getData = React.useCallback(async (assessmentId: string) => {
    try {
      resetData();
      setIsLoading(true);
      const response = await BackendApi.get(`/health-markers/report-new/id/${assessmentId}`);
      if (response.status >= 200 && response.status <= 399) {
        const report: HealthMarkerReport = response.data;
        setGroups(report.groups);
        setAssessmentDate(report.measuredDate);
        setAssessorName(report.assessorName);
        setAssessmentName(report.assessmentName);
        setAssessmentType(report.reportType);
        setIsLoading(false);
        setRefreshing(false);
      } else {
        console.error(response);
        setIsLoading(false);
        setRefreshing(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    getData(assessmentIdParam);
  }, [getData, assessmentIdParam]);

  React.useEffect(() => {
    if (refreshing == true) {
      getData(assessmentIdParam);
    }
  }, [refreshing, getData, assessmentIdParam]);

  if (isLoading == true && refreshing == false) {
    return (
      <Layout level="2" style={[styleContainer.screenContainer]}>
        <Spinner visible={true} />
      </Layout>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      style={styleContainer.scroll}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Divider />
      <Layout level="2" style={[styleContainer.screenContainer]}>
        <AssessmentSummary
          name={assessmentName}
          type={assesssmentType}
          date={assessmentDate as Date}
          coach={{ name: assessorName, permission: 'Acesss Everything' }}
        />
        <AssessmentListSection
          sections={groups}
          btnDetailAssessmentClick={(assessmentId) => {
            navigation.setParams({ assessmentId: assessmentId });
            getData(assessmentId);
          }}
        />
      </Layout>
    </ScrollView>
  );
};

export default AssessmentDetailScreen;
