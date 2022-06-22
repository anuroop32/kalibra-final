import React from 'react';
import { ViewProps, StyleSheet, View } from 'react-native';
import { AssessmentBiomarker } from '../profileMeAssessment';
import Spinner from 'react-native-loading-spinner-overlay';
import { NewHealthMarker } from 'src/core/types/HealthMarkerReport';
import { BackendApi } from 'src/api/shared';
import moment from 'moment';

//props
interface IBiomarkerListProps extends ViewProps {
  btnDetailAssessmentClick: (assessmentId: string) => void;
  refreshing: boolean;
  finishRefreshing: () => void;
  isLoadMore: boolean;
  markerName: string;
  sortedType: number;
  searchText: string;
  finishLoadMore: (canLoadMore: boolean) => void;
}

const BiomarkerList = (props: IBiomarkerListProps) => {
  // styles
  const styleContainer = StyleSheet.create({
    contain: {
      flex: 1
    }
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [biomarkers, setBiomarkers] = React.useState<NewHealthMarker[]>(new Array<NewHealthMarker>());
  const [allBiomarkers, setAllBiomarkers] = React.useState<NewHealthMarker[]>(new Array<NewHealthMarker>());
  const [isFirstLoad, setIsFirstLoad] = React.useState(true);
  const [pageNumber, setPageNumber] = React.useState(1);
  const RECORDS_PER_PAGE = 5;

  // filter data
  const filterData = React.useCallback(
    (data: Array<NewHealthMarker>): Array<NewHealthMarker> => {
      let displayData = data;
      if (props.markerName != 'All my marker') {
        displayData = displayData.filter((item: NewHealthMarker) => item.pillar == props.markerName);
      }

      // filter by searchText
      if (props.searchText.length > 0) {
        displayData = displayData.filter((item: NewHealthMarker) =>
          item.name.toLowerCase().includes(props.searchText.toLowerCase())
        );
      }

      // filter by sortedType
      if (props.sortedType == 0) {
        // most recent
        displayData = displayData.sort((a, b) => {
          return moment(a.measuredDate).valueOf() - moment(b.measuredDate).valueOf();
        });
      } else if (props.sortedType == 1) {
        // alphabetical
        displayData = displayData.sort((a, b) => {
          return a.name > b.name ? 1 : -1;
        });
      } else if (props.sortedType == 2) {
        // oldest
        displayData = displayData.sort((a, b) => {
          return moment(b.measuredDate).valueOf() - moment(a.measuredDate).valueOf();
        });
      }
      return displayData;
    },
    [props.markerName, props.searchText, props.sortedType]
  );

  const tempProps = props;
  const getData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await BackendApi.get('health-markers/get-all-markers-for-user');
      if (response.status >= 200 && response.status <= 399) {
        const allData: Array<NewHealthMarker> = response.data.data.filter(
          (item: NewHealthMarker) => item.graphType != 'None' && item.categories != undefined
        );
        let displayData: Array<NewHealthMarker> = allData.slice(0, pageNumber * RECORDS_PER_PAGE);
        displayData = filterData(displayData);
        setAllBiomarkers(allData);
        setBiomarkers(displayData);
        setIsLoading(false);
        tempProps.finishRefreshing();
        tempProps.finishLoadMore(allData.length > pageNumber * RECORDS_PER_PAGE);
      } else {
        console.error(response);
        setIsLoading(false);
        tempProps.finishRefreshing();
        tempProps.finishLoadMore(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      tempProps.finishRefreshing();
      tempProps.finishLoadMore(false);
    }
  }, [tempProps, pageNumber, filterData]);

  React.useEffect(() => {
    if (isFirstLoad == true) {
      setIsFirstLoad(false);
      setTimeout(() => {
        getData();
      }, 500);
    }
  }, [getData, isFirstLoad]);

  React.useEffect(() => {
    if (isFirstLoad == false) {
      let displayData: Array<NewHealthMarker> = [];
      if (tempProps.isLoadMore == true) {
        const numberOfItems = (pageNumber + 1) * RECORDS_PER_PAGE;
        displayData = allBiomarkers.slice(0, numberOfItems);
        setPageNumber(pageNumber + 1);
        tempProps.finishLoadMore(allBiomarkers.length > numberOfItems);
      } else {
        displayData = allBiomarkers.slice(0, pageNumber * RECORDS_PER_PAGE);
      }

      displayData = filterData(displayData);
      setBiomarkers(displayData);
    }
  }, [props.isLoadMore, isFirstLoad, filterData, allBiomarkers, pageNumber, tempProps]);

  React.useEffect(() => {
    if (props.refreshing == true) {
      getData();
    }
  }, [props.refreshing, getData]);

  const renderBiomarkers = () => {
    return biomarkers.map((biomarker: any, index: number) => {
      return (
        <AssessmentBiomarker
          key={`biomarker-item-${index}`}
          biomarker={biomarker}
          btnDetailAssessmentClick={props.btnDetailAssessmentClick}
          style={{ borderRadius: 8, marginTop: 16 }}
        />
      );
    });
  };

  if (isLoading == true && props.refreshing == false && props.isLoadMore == false) {
    return <Spinner visible={true} />;
  }

  // view
  return <View style={[styleContainer.contain, props.style]}>{renderBiomarkers()}</View>;
};

export default React.memo(BiomarkerList);
