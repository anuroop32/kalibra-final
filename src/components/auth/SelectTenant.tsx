import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import {
  AppContext,
  AuthApiErrorMessages,
  TenantFeature,
  TenantTuple,
  UIHelper as uh,
  ValidateError
} from '../../core';
import { Text, Card, Button, Icon, useTheme } from '@ui-kitten/components';
import { ErrorMessage } from '../shared';
import { BackendApi } from 'src/api/shared';
import Spinner from 'react-native-loading-spinner-overlay';

//props
interface ISelectTenantProps extends ViewProps {
  title: string;
  caption: string;
  clickHandler: () => void;
  tenantCollection: TenantTuple[];
}

const SelectTenant = (props: ISelectTenantProps) => {
  //style
  const th = useTheme();
  const appContext = React.useContext(AppContext);
  const condColors = {
    iconFill: th['color-primary-500']
  };
  const styleContainer = StyleSheet.create({
    cardContainer: { flex: 1, alignItems: 'center' },
    iconContainer: {
      width: 200,
      height: 200,
      alignSelf: 'center'
    },
    textCenter: { textAlign: 'center', marginTop: uh.h2DP(10) },
    welcomeCaption: { marginTop: uh.h2DP(23), marginBottom: uh.h2DP(23) },
    buttonCaption: { marginBottom: uh.h2DP(23) }
  });

  const [error, setError] = React.useState<ValidateError>({ name: '', message: '' });
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const selecTenant = async (item: TenantTuple) => {
    let tenantFeatures: Array<TenantFeature> = [];
    setIsSubmitted(true);
    await appContext.setTenantKey(item.key);
    try {
      const response = await BackendApi.get('/tenants/features');
      tenantFeatures = response.data.features;
      appContext.setTenantFeatures(tenantFeatures);
    } catch (err) {
      setError({ name: '', message: AuthApiErrorMessages.tenantFeaturesError });
      return;
    }
    props.clickHandler();
    setIsSubmitted(false);
  };
  const tenantButtons = props.tenantCollection.map((item, i) => (
    <Button
      key={item.id + '_' + item.key + '_' + i}
      style={styleContainer.buttonCaption}
      size="large"
      status="primary"
      onPress={() => selecTenant(item)}
    >
      <Text status="primary" category="s2">
        {item.name.toString()}
      </Text>
    </Button>
  ));

  return (
    <View style={props.style}>
      {isSubmitted == true && <Spinner visible={true} />}
      <ErrorMessage message={error.message} />
      <Card status="primary">
        <View style={styleContainer.iconContainer}>
          <Icon status="primary" fill={condColors.iconFill} name="person-outline" />
        </View>
        <Text status="basic" category="h6" style={styleContainer.textCenter}>
          {props.title}
        </Text>
        <Text status="basic" category="p2" style={[styleContainer.textCenter, styleContainer.welcomeCaption]}>
          {props.caption}
        </Text>
        {tenantButtons}
      </Card>
    </View>
  );
};

export default SelectTenant;
