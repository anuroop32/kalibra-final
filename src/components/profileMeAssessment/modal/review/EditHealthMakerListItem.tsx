import React, { useState } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { UIHelper as uh } from '../../../../core';

import { Input, Button, Icon, Text, IconProps } from '@ui-kitten/components';
import DropdownList from 'src/components/shared/DropdownList';
import { BiomarkerItem, HealthMarker, HealthMarkerUnit } from 'src/core/types/Bloodwork';

const DeleteIcon = (props: IconProps) => <Icon {...props} name="close-circle" />;

interface IEditHealthMakerListItemProps extends ViewProps {
  item: BiomarkerItem;
  deleteButtonClick?: () => void;
  editable: boolean;
  inputColor: string;
  dropdownBGColor: string;
  allHealthMarkers: Array<HealthMarker>;
  updateValue: (newId: string, newValue: string, newUnitId: number, newHealthMarkerId?: number) => void;
}

let count = 1;
const EditHealthMakerListItem = (props: IEditHealthMakerListItemProps) => {
  const units: Array<HealthMarkerUnit> = [];
  const [value, setValue] = useState<string>(String(props.item.value));
  const [selectedHeathMarkerIdx, setSelectedHeathMarkerIdx] = React.useState(0);
  const [selectedUnitIdx, setSelectedUnitIdx] = React.useState(0);
  const [hasChangedValue, setHasChangeValue] = React.useState(false);
  const styles = StyleSheet.create({
    container: {
      paddingTop: 4,
      paddingBottom: 4,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center'
    },
    input: { backgroundColor: props.inputColor, flex: 3 },
    healthMarkerDropdown: { width: uh.currentViewPort() - 64, borderWidth: 0.5, borderRadius: 8 },
    dropdown: { width: 120, borderColor: 'transparent', borderWidth: 0.5, borderRadius: 8, marginLeft: 4 },
    button: {
      margin: 2,
      width: 40,
      height: 40,
      borderRadius: 20
    }
  });

  const changeHealthMarker = (index: number) => {
    setSelectedHeathMarkerIdx(index);
    props.updateValue(
      props.item.bloodworkDataId,
      value,
      units[selectedUnitIdx].id,
      props.allHealthMarkers[index].healthMarkerId
    );
  };

  const healthMarker = props.editable
    ? props.allHealthMarkers[selectedHeathMarkerIdx]
    : props.allHealthMarkers.find((hm) => hm.healthMarkerId == props.item.healthMarkerId);
  const errorValue = `Pls input value between [${Number(healthMarker?.healthMarkerMinRange).toFixed(1)}, ${Number(
    healthMarker?.healthMarkerMaxRange
  ).toFixed(1)}]`;

  let invalidValue =
    Number.isNaN(Number(value)) ||
    value.trim().length == 0 ||
    Number(value) > healthMarker?.healthMarkerMaxRange ||
    Number(value) < healthMarker?.healthMarkerMinRange;
  if (props.editable == true && hasChangedValue == false) {
    invalidValue = false;
  }

  if (healthMarker != undefined) {
    units.push({ id: healthMarker.healthMarkerUnitId, unit: healthMarker?.healthMarkerUnit });
  }
  count = count + 1;

  const changeUnit = (index: number) => {
    setSelectedUnitIdx(index);
    props.updateValue(props.item.bloodworkDataId, value, units[index].id, healthMarker?.healthMarkerId);
  };

  return (
    <View style={{ marginTop: 16 }}>
      {props.editable == true ? (
        <>
          {invalidValue == true && (
            <Text style={{ marginLeft: 8, marginBottom: 6 }} category="c1" status="danger">
              {errorValue}
            </Text>
          )}
          <DropdownList
            caption=""
            data={props.allHealthMarkers.map((item) => item.healthMarkerName)}
            style={styles.healthMarkerDropdown}
            selecItem={changeHealthMarker}
            intputColor={props.inputColor}
            dropdownBGColor={props.dropdownBGColor}
            selectedIndex={selectedHeathMarkerIdx}
          />
        </>
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text category="s1">{props.item.healthmarker}</Text>
          {invalidValue == true && (
            <Text style={{ marginLeft: 8 }} category="c1" status="danger">
              {errorValue}
            </Text>
          )}
        </View>
      )}
      <View style={[styles.container, props.style]}>
        <Input
          style={[styles.input]}
          size="large"
          placeholder="value"
          status={invalidValue == true ? 'danger' : 'basic'}
          value={value}
          label=""
          onChangeText={(text: string) => {
            setValue(text);
            setHasChangeValue(true);
            props.updateValue(
              props.item.bloodworkDataId,
              text,
              units[selectedUnitIdx].id,
              healthMarker?.healthMarkerId
            );
          }}
        />
        {count % 2 == 0 ? (
          <DropdownList
            caption=""
            data={units.map((item) => item.unit)}
            style={styles.dropdown}
            selecItem={changeUnit}
            intputColor={props.inputColor}
            dropdownBGColor={props.dropdownBGColor}
            selectedIndex={selectedUnitIdx}
          />
        ) : (
          <>
            <DropdownList
              caption=""
              data={units.map((item) => item.unit)}
              style={styles.dropdown}
              selecItem={changeUnit}
              intputColor={props.inputColor}
              dropdownBGColor={props.dropdownBGColor}
              selectedIndex={selectedUnitIdx}
            />
          </>
        )}
        {props.deleteButtonClick != undefined && (
          <Button style={styles.button} status="danger" accessoryLeft={DeleteIcon} onPress={props.deleteButtonClick} />
        )}
      </View>
    </View>
  );
};

export default EditHealthMakerListItem;
