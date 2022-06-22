import React from 'react';
import { StyleSheet, ViewProps, View } from 'react-native';
import { Layout, Divider, Text } from '@ui-kitten/components';
import Accordion from 'react-native-collapsible/Accordion';
import { UIHelper as uh } from '../../core';
import AssessmentHeader from './AssessmentHeader';
// import AssessmentPillars from './AssessmentPillars';
import IndividualAssessmentList from './IndividualAssessmentList';
import Coaches from './CoachList';
import { BackendApi } from 'src/api/shared';
import { HealthMarkerReportList, HealthMarkerReportListItem } from 'src/core/types/HealthMarkerReportList';
import { CoachInfo } from 'src/core/types/CoachInfo';
import Spinner from 'react-native-loading-spinner-overlay';

//props
interface IYourAssessmentsProps extends ViewProps {
  btnDetailAssessmentClick: (assessmentId: string) => void;
  refreshing: boolean;
  finishRefreshing: () => void;
}

const YourAssessments = (props: IYourAssessmentsProps) => {
  //styles
  const styleContainer = StyleSheet.create({
    container: {
      flex: 1
    },
    header: {
      padding: uh.h2DP(16),
      marginTop: uh.h2DP(8),
      borderRadius: 8
    },
    activeHeader: {
      padding: uh.h2DP(16),
      marginTop: uh.h2DP(8),
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8
    },
    content: {
      paddingBottom: uh.h2DP(16),
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8
    },
    pillars: { marginTop: uh.h2DP(16), paddingLeft: uh.w2DP(16), paddingRight: uh.w2DP(16) },
    individualAssementList: {
      marginTop: uh.h2DP(24),
      paddingLeft: uh.w2DP(16),
      paddingRight: uh.w2DP(16)
    },
    divider: { marginTop: uh.h2DP(39), marginBottom: uh.h2DP(39) },
    coaches: { marginTop: uh.h2DP(24), paddingLeft: uh.w2DP(16), paddingRight: uh.w2DP(16), marginBottom: uh.h2DP(16) }
  });

  const [assessmentsGroup, setAssessmentsGroup] = React.useState<Map<string, HealthMarkerReportListItem[]>>();
  const [activeSections, setActiveSections] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  let groupNames: string[] = [];
  const btnManageClick = () => {};

  const tmpProps = props;
  const getAssessments = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await BackendApi.get('/health-markers/reports-new');
      if (response.status >= 200 && response.status <= 399) {
        setAssessmentsGroup(new Map<string, HealthMarkerReportListItem[]>());
        if (response.data !== undefined) {
          const summaryList: HealthMarkerReportList = response.data;
          if (summaryList.assessments !== undefined && summaryList.assessments.length > 0) {
            const group = new Map<string, HealthMarkerReportListItem[]>();
            for (const item of summaryList.assessments) {
              if (group.has(item.reportType)) {
                group.get(item.reportType)?.push(item);
                continue;
              }
              group.set(item.reportType, [item]);
            }
            setAssessmentsGroup(group);
          }
          setIsLoading(false);
          tmpProps.finishRefreshing();
        }
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
  }, [tmpProps]);

  React.useEffect(() => {
    getAssessments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (props.refreshing == true) {
      getAssessments();
    }
  }, [props.refreshing, getAssessments]);

  const renderHeader = (assessmentType: string, index: number, isActive: boolean) => {
    const assessmentName = (assessmentsGroup?.get(assessmentType) as HealthMarkerReportListItem[])[0]
      .assessmentName as string;
    return (
      <AssessmentHeader
        key={`header-index-${index}`}
        assessmentType={assessmentName}
        numberOfAssessments={(assessmentsGroup?.get(assessmentType) as HealthMarkerReportListItem[]).length}
        isActive={isActive}
      />
    );
  };

  const renderContent = (assessmentType: string) => {
    const coaches: CoachInfo[] = [];
    assessmentsGroup?.get(assessmentType)?.forEach((item) => {
      if (coaches.findIndex((element) => element.name == item.createdBy) == -1) {
        coaches.push({ name: item.createdBy, permission: 'Access Everything' });
      }
    });

    return (
      <Layout style={styleContainer.content}>
        <Divider />
        {/* <AssessmentPillars caption="Pillars" pillars={assessment.pillars} style={styleContainer.pillars} size="large" /> */}
        <IndividualAssessmentList
          style={styleContainer.individualAssementList}
          btnClickHandler={props.btnDetailAssessmentClick}
          assessments={assessmentsGroup?.get(assessmentType) as HealthMarkerReportListItem[]}
          caption="Individual assessments"
        />
        <Coaches
          style={styleContainer.coaches}
          caption="Coaches"
          coaches={coaches}
          btnMessage="Manage"
          btnClickHandler={btnManageClick}
        />
      </Layout>
    );
  };

  const updateSections = (sections: any) => {
    setActiveSections(sections.includes(undefined) ? [] : sections);
  };

  groupNames = [];
  let totalAssessments = 0;
  if (assessmentsGroup != undefined) {
    for (const key of assessmentsGroup?.keys()) {
      groupNames.push(key);
      totalAssessments += assessmentsGroup.get(key)?.length || 0;
    }
  }

  if (isLoading == true && props.refreshing == false) {
    return <Spinner visible={true} />;
  }

  //view
  return (
    <View>
      <Text category="s1">
        Your assessments{' '}
        <Text category="p1" appearance="hint">
          {totalAssessments}
        </Text>
      </Text>
      <Accordion
        containerStyle={{ marginTop: 8 }}
        underlayColor="transparent"
        activeSections={activeSections}
        sections={groupNames}
        expandMultiple={true}
        renderHeader={renderHeader}
        renderContent={renderContent}
        onChange={updateSections}
      />
    </View>
  );
};

export default YourAssessments;
