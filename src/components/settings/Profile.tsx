import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Button, Text, RadioGroup, Radio, Input, useTheme, Datepicker, Modal, Card } from '@ui-kitten/components';
import {
  AppContext,
  UIHelper as uh,
  StringHelper as sh,
  UserAttributes,
  dateValidator,
  genderTypeValidator,
  stringValidator,
  ValidateError,
  AuthApiErrorMessages
} from '../../core';
import Auth from '@aws-amplify/auth';
import moment from 'moment';
import { ErrorMessage } from '../shared';
import { updateUser, deleteUserAccount } from '../../api/auth';
import { BackendApi } from 'src/api/shared';
import Spinner from 'react-native-loading-spinner-overlay';
import TenantDropdownList from './TenantDropdownList';
import RefreshControl from '../shared/RefreshControl';
import { ConfirmationModal } from '../shared/ConfirmationModal';
import { AxiosResponse } from 'axios';

const Profile = () => {
  const th = useTheme();
  // context
  const appContext = React.useContext(AppContext);
  const ctTheme = appContext.getTheme();
  const gender = React.useMemo(() => ['male', 'female'], []);
  const condColors = {
    divider: uh.getHex(th, ctTheme, 'color-basic-400', 'color-basic-200'),
    input: uh.getHex(th, ctTheme, 'color-basic-100', 'color-basic-1100'),
    inputPassword: { marginVertical: uh.h2DP(16) }
  };

  //styles
  const styleContainer = StyleSheet.create({
    container: { flex: 1 },
    scrollView: { flex: 1 },
    themeContainerRadio: { flexDirection: 'row', marginVertical: uh.h2DP(16) },
    input: { backgroundColor: condColors.input },
    inputPassword: { marginVertical: uh.h2DP(16) },
    saveButton: { marginTop: uh.h2DP(24) },
    deleteButton: { marginTop: uh.h2DP(30), marginBottom: uh.h2DP(100) },
    genderTitle: { marginRight: uh.w2DP(20) },
    select: { flex: 1, marginTop: uh.h2DP(16) },
    modal: { marginTop: uh.h2DP(40) },
    backdropStyle: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    dropdown: { marginTop: uh.h2DP(16) }
  });

  const tenants = appContext.getTenants();
  const tenantKey = appContext.getTenantKey();

  //properties
  const [email, setEmail] = React.useState<string>('');
  const [fullname, setFullname] = React.useState<string>('');
  const [nickname, setNickname] = React.useState<string>('');
  const [birthdate, setBirthdate] = React.useState(new Date('1980/01/01'));
  const [error, setError] = React.useState<ValidateError>({ name: '', message: '' });
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [selectedTenantIdx, setSelectedTenantIdx] = React.useState(tenants.findIndex((item) => item.key == tenantKey));
  const [selectedGenderIndex, setSelectedGenderIndex] = React.useState(0);
  const [visible, setVisible] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [visibleConfirmationModal, setVisibleConfirmationModal] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
  }, []);

  const save = async () => {
    // reset errors
    setError({ name: '', message: '' });
    const fullnameError = stringValidator('Full Name', fullname);
    if (fullnameError) {
      setError({ name: 'fullname', message: fullnameError });
      return;
    }
    const nicknameError = stringValidator('Preferred Name', nickname);
    if (nicknameError) {
      setError({ name: 'nickname', message: nicknameError });
      return;
    }
    const genderError = genderTypeValidator(gender[selectedGenderIndex - 1]);
    if (genderError) {
      setError({ name: 'gender', message: genderError });
      return;
    }
    const birthdateError = dateValidator('YYYY-MM-DD', moment(birthdate).format('YYYY-MM-DD'));
    if (birthdateError) {
      setError({ name: 'birthdate', message: birthdateError });
      return;
    }

    const values: UserAttributes = {
      name: fullname,
      nickname: nickname,
      gender: gender[selectedGenderIndex - 1],
      birthdate: moment(birthdate).format('YYYY-MM-DD')
    };

    setIsSubmitted(true);
    // update user's info
    const result = await updateUser(values);
    // check tenant key, it it's changed will fetch tenant features again
    if (tenants[selectedTenantIdx].key != tenantKey) {
      try {
        await appContext.setTenantKey(tenants[selectedTenantIdx].key);
        const response = await BackendApi.get('/tenants/features');
        const tenantFeatures = response.data.features;
        appContext.setTenantFeatures(tenantFeatures);
      } catch (err) {
        setError({ name: '', message: AuthApiErrorMessages.tenantFeaturesError });
        return;
      }
    }
    setIsSubmitted(false);

    if (result?.error) {
      setError(result?.error?.message);
    } else {
      setVisible(true);
    }
  };

  const loadUserData = React.useCallback(async () => {
    try {
      const result = await Auth.currentAuthenticatedUser();
      setFullname(result.attributes.name);
      setNickname(result.attributes.nickname);
      setEmail(result.attributes.email);
      setSelectedGenderIndex(gender.indexOf(result.attributes.gender) + 1);
      setBirthdate(moment(result.attributes.birthdate, 'YYYY-MM-DD').toDate());
      setRefreshing(false);
    } catch (loadingError) {
      console.error(loadingError);
      setRefreshing(false);
    }
  }, [gender]);

  React.useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  React.useEffect(() => {
    if (refreshing == true) {
      loadUserData();
    }
  }, [refreshing, loadUserData]);

  const changeTenant = (index: number) => {
    setSelectedTenantIdx(index);
  };

  const deleteUser = async () => {
    try {
      const response: AxiosResponse = await BackendApi.delete('/users');
      // Deleted all the users data successfully
      if (response.status === 200) {
        await deleteUserAccount();
        // Deregister Analytics
        appContext.setAnalyticUserId(null);
      }
    } catch (err) {
      console.error(err?.message);
    }
    setVisibleConfirmationModal(false);
  };

  //view
  return (
    <ScrollView
      style={[styleContainer.container]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {isSubmitted == true && <Spinner visible={true} />}
      <ErrorMessage message={error.message} />
      <Input size="large" style={[styleContainer.input]} label="Email" value={email} disabled={true} />
      <Input
        style={[styleContainer.input, styleContainer.inputPassword]}
        size="large"
        status={error.name == 'fullname' ? 'danger' : 'basic'}
        label="Full Name"
        value={fullname}
        onChangeText={(text: string) => setFullname(text)}
      />
      <Input
        style={[styleContainer.input]}
        size="large"
        status={error.name == 'nickname' ? 'danger' : 'basic'}
        value={nickname}
        label="Preferred Name"
        onChangeText={(text: string) => setNickname(text)}
      />
      <RadioGroup
        style={[styleContainer.themeContainerRadio]}
        selectedIndex={selectedGenderIndex}
        onChange={(index) => setSelectedGenderIndex(index)}
      >
        <Text category="label" appearance="hint" style={styleContainer.genderTitle}>
          Gender
        </Text>
        <Radio status="success">
          <Text category="label" appearance="hint">
            {sh.capitalize(gender[0])}
          </Text>
        </Radio>
        <Radio status="success">
          <Text category="c1" appearance="hint">
            {sh.capitalize(gender[1])}
          </Text>
        </Radio>
      </RadioGroup>

      <Datepicker
        size="large"
        backdropStyle={styleContainer.backdropStyle}
        status={error.name == 'birthdate' ? 'danger' : 'basic'}
        controlStyle={[styleContainer.input]}
        label="Date of Birth"
        min={new Date('1920/01/01')}
        placement="top"
        max={new Date()}
        date={birthdate}
        onSelect={(nextDate) => setBirthdate(nextDate)}
      />
      <TenantDropdownList
        caption="Tenants"
        data={tenants.map((item) => item.name)}
        style={styleContainer.dropdown}
        selecItem={changeTenant}
        selectedIndex={selectedTenantIdx}
      />

      <Button
        style={styleContainer.saveButton}
        size="giant"
        status="primary"
        disabled={isSubmitted}
        onPress={() => {
          save();
        }}
      >
        <Text status="primary" category="s2">
          Update
        </Text>
      </Button>

      <Button size="giant" status="danger" style={{ marginTop: 10 }} onPress={() => setVisibleConfirmationModal(true)}>
        <Text status="primary" category="s2">
          Delete Account
        </Text>
      </Button>

      <Modal visible={visible} backdropStyle={styleContainer.backdropStyle} onBackdropPress={() => setVisible(false)}>
        <Card disabled={true}>
          <Text>Profile changes saved successfully!</Text>
          <Button
            onPress={() => {
              setVisible(false);
            }}
            style={styleContainer.modal}
          >
            OK
          </Button>
        </Card>
      </Modal>
      <ConfirmationModal
        message="Do you want to delete your account and all your data?"
        visible={visibleConfirmationModal}
        yesBtnClick={deleteUser}
        noBtnClick={() => {
          setVisibleConfirmationModal(false);
        }}
      />
    </ScrollView>
  );
};

export default Profile;
