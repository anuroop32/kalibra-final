import React from 'react';
import { StyleSheet, TouchableOpacity, ViewProps } from 'react-native';
import moment from 'moment';
import SmallTextAttribute from './SmallTextAttribute';
import { HealthMarkerFileUpload } from '../../../../core/types/HealthMarkerFileUpload';
import { Card } from '@ui-kitten/components';

interface IFileUploadListItemProps extends ViewProps {
  item: HealthMarkerFileUpload;
  onPress?: () => void;
}

const FileUploadListItem = (props: IFileUploadListItemProps) => {
  const styles = StyleSheet.create({
    container: {
      //padding: 16,
      borderRadius: 16
    }
  });

  return (
    <TouchableOpacity onPress={props.onPress}>
      <Card style={[styles.container, props.style]}>
        <SmallTextAttribute title="File" value={props.item.displayFilename} />
        <SmallTextAttribute title="Progress" value={props.item.progressText} />
        <SmallTextAttribute title="Status" value={props.item.status} />
        <SmallTextAttribute title="Processed On" value={moment(props.item.updatedOn).format('D MMM yyyy h:mma')} />
      </Card>
    </TouchableOpacity>
  );
};

export default FileUploadListItem;
