import { Layout, Text, useTheme, ModalService } from '@ui-kitten/components';
import React from 'react';
import { ViewProps, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Pillar, UIHelper as uh } from '../../../core';
import { ProfileIcons } from '../../profileMe/ProfileIcons';
import BarChart from './BarChart';
import AssessmentPillars from '../AssessmentPillars';
import AssessmentScore from './AssessmentScore';
import BiomarkerDetailModal from '../../profileMeMarker/modal/BiomarkerDetailModal';
import { NewHealthMarker } from 'src/core/types/HealthMarkerReport';

//props
interface IAssessmentBiomarkerProps extends ViewProps {
  biomarker: NewHealthMarker;
  btnDetailAssessmentClick: (assessmentId: string) => void;
}

const AssessmentBiomarker = (props: IAssessmentBiomarkerProps) => {
  let modalID = '';
  const th = useTheme();
  // styles
  const styleContainer = StyleSheet.create({
    container: {
      marginTop: uh.h2DP(8),
      padding: uh.h2DP(16),
      flexDirection: 'column'
    },
    barChart: {
      marginTop: uh.h2DP(24)
    },
    icon: {
      width: 20,
      height: 20
    },
    pillarAndScore: {
      flexDirection: 'row',
      marginTop: uh.h2DP(9)
    },
    nameContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    backdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
  });

  const chatWithKalibraClick = () => {
    ModalService.hide(modalID);
  };

  const renderModalContentElement = (data: NewHealthMarker) => {
    return (
      <BiomarkerDetailModal
        biomarker={data}
        btnBackHandler={() => {
          ModalService.hide(modalID);
        }}
        btnChatMoreHandler={chatWithKalibraClick}
        btnLearnMoreHandler={chatWithKalibraClick}
        btnDetailAssessmentClick={(assessmentId) => {
          ModalService.hide(modalID);
          props.btnDetailAssessmentClick(assessmentId);
        }}
      />
    );
  };

  const showModal = (data: NewHealthMarker) => {
    const contentElement = renderModalContentElement(data);
    modalID = ModalService.show(contentElement, {
      backdropStyle: styleContainer.backdrop
    });
  };

  let pillars: Array<Pillar> = [];
  if (props.biomarker.pillar != null) {
    pillars = [{ name: props.biomarker.pillar, type: props.biomarker.pillar.toLowerCase() }];
  }

  // view
  return (
    <Layout style={[styleContainer.container, props.style]}>
      <TouchableOpacity
        onPress={() => {
          showModal(props.biomarker);
        }}
      >
        <View style={styleContainer.nameContainer}>
          <Text category="s1">{props.biomarker.name}</Text>
          <ProfileIcons.ForwardIcon style={styleContainer.icon} fill={th['color-basic-600']} />
        </View>
      </TouchableOpacity>
      <View style={styleContainer.pillarAndScore}>
        <AssessmentScore
          caption={'Score'}
          score={`${props.biomarker.displayValue} ${props.biomarker.unit}`}
          textCategory="h5"
        />
        {props.biomarker.pillar != null && props.biomarker.pillar.length > 0 && (
          <AssessmentPillars caption="Pillars" size="small" showOnePillarOnly={true} pillars={pillars} />
        )}
      </View>
      <BarChart
        currentValue={Number(props.biomarker.displayValue)}
        healthMarker={props.biomarker}
        style={styleContainer.barChart}
      />
    </Layout>
  );
};

export default AssessmentBiomarker;
