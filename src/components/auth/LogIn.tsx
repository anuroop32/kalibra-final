import React from 'react';
import { View, TouchableWithoutFeedback, TouchableOpacity, Platform, StyleSheet, ViewProps } from 'react-native';
import { Button, Text, Input, Icon, useTheme, Radio, RadioGroup, Datepicker } from '@ui-kitten/components';
import {
  AppContext,
  LoginVariant,
  UIHelper as uh,
  StringHelper as sh,
  emailValidator,
  passwordValidator,
  stringValidator,
  genderTypeValidator,
  dateValidator,
  TenantTuple,
  ValidateError,
  TenantFeature,
  AuthApiErrorMessages
} from '../../core';
import TextAgreementLink from './TextAgreementLink';
import { loginUser, registerUser, logoutUser, getUserId, getCurrentUser } from '../../api/auth';
import { ErrorMessage } from '../shared';
import moment from 'moment';
import Auth from '@aws-amplify/auth';
import { BackendApi } from 'src/api/shared';
import Spinner from 'react-native-loading-spinner-overlay';
import { setExternalUserId } from '../../api/push';

// props
interface ILogInProps extends ViewProps {
  type: LoginVariant;
  signInUpHandler?: () => void;
  confirmRegisterHandler?: () => void;
  multiTenantHandler?: () => void;
  resetPasswordHandler?: () => void;
  goToPage?: (url: string) => void;
}

const LogIn = (props: ILogInProps) => {
  // App Context
  const appContext = React.useContext(AppContext);

  // styles
  const th = useTheme();
  const gender = ['male', 'female'];
  const ctTheme = appContext.getTheme();
  const condColors = {
    divider: uh.getHex(th, ctTheme, 'color-basic-400', 'color-basic-200'),
    input: uh.getHex(th, ctTheme, 'color-basic-100', 'color-basic-1100')
  };
  const styleContainer = StyleSheet.create({
    orContainer: { flexDirection: 'row', alignItems: 'center' },
    divider: { flex: 1, backgroundColor: condColors.divider },
    orContent: { paddingHorizontal: uh.h2DP(4) },
    loginContainer: { marginTop: uh.h2DP(32) },
    input: { backgroundColor: condColors.input },
    inputPassword: { marginVertical: uh.h2DP(16) },
    forgotPasswordContainer: { textAlign: 'center', marginTop: uh.h2DP(22) },
    forgotPasswordButton: { alignSelf: 'center' },
    themeContainerRadio: { flexDirection: 'row', alignItems: 'center' },
    gender: { flexDirection: 'row', alignItems: 'center' },
    genderTitle: { marginRight: uh.w2DP(20) },
    backdropStyle: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
  });

  // properties
  const context = props.type === 'Sign Up' ? 'Sign Up' : 'Sign In';
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [fullname, setFullname] = React.useState<string>('');
  const [nickname, setNickname] = React.useState<string>('');
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const [selectedGenderIndex, setSelectedGenderIndex] = React.useState(0);
  const [birthdate, setBirthdate] = React.useState<Date>(new Date('1980/01/01'));
  const [error, setError] = React.useState<ValidateError>({ name: '', message: '' });
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  // handlers and conditionals
  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };
  const renderIcon = (iconProps: any) => {
    // This is workaround due to "OnPress" translation issue for react native web
    return Platform.OS === 'web' ? (
      <div onClick={toggleSecureEntry}>
        <Icon {...iconProps} name={secureTextEntry ? 'eye-off' : 'eye'} />
      </div>
    ) : (
      <TouchableWithoutFeedback onPress={toggleSecureEntry}>
        <Icon {...iconProps} name={secureTextEntry ? 'eye-off' : 'eye'} />
      </TouchableWithoutFeedback>
    );
  };

  const processSignUp = async () => {
    const emailError = emailValidator(email);
    if (emailError) {
      setError({ name: 'email', message: emailError });
      return;
    }
    const passwordError = passwordValidator(password);
    if (passwordError) {
      setError({ name: 'password', message: passwordError });
      return;
    }
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

    setIsSubmitted(true);
    // register user
    const result = await registerUser(
      email,
      password,
      fullname,
      nickname,
      gender[selectedGenderIndex - 1],
      moment(birthdate).format('YYYY-MM-DD')
    );

    if (result?.error) {
      setIsSubmitted(false);
      setError({ name: '', message: result?.error?.message });
    } else {
      setError({ name: '', message: '' });
      if (props.confirmRegisterHandler) {
        props.confirmRegisterHandler();
      }
      setIsSubmitted(false);
    }
  };

  const processSignIn = async () => {
    let token = '';
    const emailError = emailValidator(email);
    if (emailError) {
      setError({ name: 'email', message: emailError });
      return;
    }
    const passwordError = passwordValidator(password);
    if (passwordError) {
      setError({ name: 'password', message: passwordError });
      return;
    }

    setIsSubmitted(true);
    const result: any = await loginUser(email, password);
    if (result?.error) {
      setIsSubmitted(false);
      setError({ name: '', message: result?.error?.message });
    } else {
      // Call API for signIn
      const session = await Auth.currentSession();
      token = session.getIdToken().getJwtToken();

      // Get multi-tenant status
      let tenants: Array<TenantTuple> = [];
      try {
        const response = await BackendApi.get('/tenants/list');
        tenants = response.data.tenants as Array<TenantTuple>;
      } catch (err) {
        await logoutUser();
        setIsSubmitted(false);
        setError({ name: '', message: AuthApiErrorMessages.tenantListError });
        return;
      }

      // save user's token and tenants
      appContext.setUserToken(token);
      appContext.setTenants(tenants);

      const user = await getCurrentUser();
      if (user != undefined) {
        appContext.setUserAttributes(user.attributes);
        setExternalUserId();
      }

      // add analytic
      const userId = await getUserId();
      if (userId !== undefined) {
        appContext.setAnalyticUserId(userId + ':' + user.attributes.name);
      }

      // check multiTenant status
      if (tenants.length > 1 && props.multiTenantHandler) {
        props.multiTenantHandler();
      } else if (props.signInUpHandler) {
        // Get tenant's features
        let tenantFeatures: Array<TenantFeature> = [];
        await appContext.setTenantKey(tenants[0].key);
        try {
          const response = await BackendApi.get('/tenants/features');
          tenantFeatures = response.data.features;
          appContext.setTenantFeatures(tenantFeatures);
        } catch (err) {
          setError({ name: '', message: AuthApiErrorMessages.tenantFeaturesError });
          return;
        }
        props.signInUpHandler();
      }
      setIsSubmitted(false);
      setError({ name: '', message: '' });
    }
    // if ('NEW_PASSWORD_REQUIRED' === result?.challengeName) {
    //   const user: CognitoUser = result;
    //   navigation.navigate('RequireNewPassword', { user: user });
    // }
    // if ('PasswordResetRequiredException' === result?.error?.code) {
    //   navigation.navigate('PasswordReset', {
    //     email: email,
    //     error: result?.error?.message
    //   });
    // }
  };

  //const signInUpBtnHandler = props.type === 'Log In' ? props.signInUpHandler : props.confirmRegisterHandler;
  const signInUpBtnHandler = async () => {
    if (props.type === 'Log In') {
      await processSignIn();
    } else if (props.confirmRegisterHandler) {
      await processSignUp();
    }
  };

  const renderForgetPassword = () => {
    return (
      props.type === 'Log In' &&
      props.resetPasswordHandler && (
        <View style={styleContainer.forgotPasswordContainer}>
          <TouchableOpacity style={styleContainer.forgotPasswordButton} onPress={props.resetPasswordHandler}>
            <Text status="primary" category="c2">
              Forgot password?
            </Text>
          </TouchableOpacity>
        </View>
      )
    );
  };

  //returned view
  return (
    <View style={props.style}>
      {isSubmitted == true && <Spinner visible={true} />}
      {/* <View style={styleContainer.orContainer}>
        <Divider style={styleContainer.divider} />
        <Text category="c1" appearance="hint" style={styleContainer.orContent}>
          or with
        </Text>
        <Divider style={styleContainer.divider} />
      </View> */}
      <ErrorMessage message={error.message} />
      <View style={styleContainer.loginContainer}>
        <Input
          size="large"
          status={error.name == 'email' ? 'danger' : 'basic'}
          style={styleContainer.input}
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Input
          style={[styleContainer.input, styleContainer.inputPassword]}
          status={error.name == 'password' ? 'danger' : 'basic'}
          size="large"
          label="Password"
          value={password}
          secureTextEntry={secureTextEntry}
          accessoryRight={renderIcon}
          onChangeText={(nextValue: string) => setPassword(nextValue)}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {props.type === 'Sign Up' && (
          <>
            <Input
              status={error.name == 'fullname' ? 'danger' : 'basic'}
              style={[styleContainer.input]}
              size="large"
              label="Full Name"
              value={fullname}
              onChangeText={(text: string) => setFullname(text)}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Input
              style={[styleContainer.input, styleContainer.inputPassword]}
              status={error.name == 'nickname' ? 'danger' : 'basic'}
              size="large"
              value={nickname}
              label="Preferred Name"
              onChangeText={(text: string) => setNickname(text)}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <RadioGroup
              style={styleContainer.themeContainerRadio}
              selectedIndex={selectedGenderIndex}
              onChange={(index) => setSelectedGenderIndex(index)}
            >
              <Text
                category="label"
                status={error.name == 'gender' ? 'danger' : 'basic'}
                appearance="hint"
                style={styleContainer.genderTitle}
              >
                Gender
              </Text>
              <Radio status={error.name == 'gender' ? 'danger' : 'success'}>
                <Text category="label" status={error.name == 'gender' ? 'danger' : 'basic'} appearance="hint">
                  {sh.capitalize(gender[0])}
                </Text>
              </Radio>
              <Radio status={error.name == 'gender' ? 'danger' : 'success'}>
                <Text category="c1" status={error.name == 'gender' ? 'danger' : 'basic'} appearance="hint">
                  {sh.capitalize(gender[1])}
                </Text>
              </Radio>
            </RadioGroup>

            <Datepicker
              size="large"
              status={error.name == 'birthdate' ? 'danger' : 'basic'}
              backdropStyle={styleContainer.backdropStyle}
              style={[styleContainer.inputPassword]}
              controlStyle={[styleContainer.input]}
              label="Date of Birth"
              min={new Date('1920/01/01')}
              placement="top"
              max={new Date()}
              date={birthdate}
              onSelect={(nextDate) => setBirthdate(nextDate)}
            />
            {props.goToPage && <TextAgreementLink goToPage={props.goToPage} />}
          </>
        )}

        <Button size="giant" status="primary" disabled={isSubmitted} onPress={signInUpBtnHandler}>
          <Text status="primary" category="s2">
            {context}
          </Text>
        </Button>
        {renderForgetPassword()}
      </View>
    </View>
  );
};

export default LogIn;
