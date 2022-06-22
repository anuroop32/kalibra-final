import React from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { Text, Layout, Button, Divider, useTheme, Icon } from '@ui-kitten/components';
import { settingStyles } from './_settingStyles';
import BackendApi from 'src/api/shared/BackendApi';
import { TerraProvider } from 'src/core/types/TerraProvider';
import ProviderItem from 'src/components/settings/connectedDevice/ProviderItem';
import { ScrollView } from 'react-native-gesture-handler';
import { AxiosResponse } from 'axios';
import { WebView } from 'react-native-webview';
import Auth from '@aws-amplify/auth';
import { Connections, deauthTerra, initTerra, Permissions } from 'terra-react';
import { Config } from '../../core/constants/Config';
import { InfoModal } from 'src/components/shared/InfoModal';
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
import RefreshControl from 'src/components/shared/RefreshControl';
import { useFocusEffect } from '@react-navigation/native';

let isInitTerraSDK = false;
const ConnectedDevicesScreen = () => {
  const th = useTheme();
  //styles
  const styleContainer = StyleSheet.create({
    screenContainer: { flex: 1 },
    safeAreaView: { flex: 1 },
    infoIcon: { width: 20, height: 20, position: 'absolute', right: 0, top: -40 }
  });

  const [btnTitle, setBtnTitle] = React.useState('Cancel');
  const [isLoading, setIsLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [visibleInfoModal, setVisibleInfoModal] = React.useState(false);
  const [info, setInfo] = React.useState('');
  const [authUrl, setAuthUrl] = React.useState<string>('');
  const [providers, setProviders] = React.useState<Array<TerraProvider>>([]);

  const getSubscriptions = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await BackendApi.post('/terra/subscriptions');
      if (response.status >= 200 && response.status <= 399) {
        if (response.data !== undefined) {
          // filter provider based on platform
          let prs = response.data.providers.filter((item: TerraProvider) => {
            if (Platform.OS == 'ios') {
              return item.onApple == 1;
            } else if (Platform.OS == 'android') {
              return item.onAndroid == 1;
            } else if (Platform.OS == 'web') {
              return item.onWeb == 1;
            }
          }) as Array<TerraProvider>;

          prs = prs.sort((a, b) => a.provider_name.localeCompare(b.provider_name));
          const isAuthenticatedApple =
            prs.findIndex((item: TerraProvider) => item.provider_name == 'Apple' && item.connectedDate != undefined) >=
            0;
          if (isAuthenticatedApple == true && isInitTerraSDK == false) {
            isInitTerraSDK = true;
            const user = await Auth.currentAuthenticatedUser();
            await initTerra(
              Config.TERRA_DEV_ID,
              String(Config.TERRA_API_KEY),
              user.attributes.sub,
              60,
              [Connections.APPLE_HEALTH],
              [
                Permissions.ACTIVITY,
                Permissions.ATHLETE,
                Permissions.BODY,
                Permissions.DAILY,
                Permissions.NUTRITION,
                Permissions.SLEEP
              ]
            );
          }
          setProviders(prs);
          setIsLoading(false);
          setRefreshing(false);
        }
      } else {
        console.error(response);
        setIsLoading(false);
        setRefreshing(false);
      }
    } catch (loadingError) {
      console.error(loadingError);
      // setProviders(allData)
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getSubscriptions();
    }, [getSubscriptions])
  );

  React.useEffect(() => {
    if (refreshing == true) {
      getSubscriptions();
    }
  }, [refreshing, getSubscriptions]);

  const connect = async (data: TerraProvider) => {
    try {
      const response: AxiosResponse = await BackendApi.post('/terra/connect', {
        resource: data.resource,
        providerId: String(data.providerId)
      });

      // connect successfully
      if (response.status >= 200 && response.status <= 399 && response.data !== undefined) {
        if (Platform.OS == 'web') {
          const win = window.open(response.data.auth_url, '_blank', 'height=600, width=500');
          const timer = setInterval(function () {
            if (win?.closed) {
              clearInterval(timer);
              setTimeout(() => {
                getSubscriptions();
              }, 1000);
            }
          }, 200);
        } else {
          setAuthUrl(response.data.auth_url);
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const disconnect = async (data: TerraProvider) => {
    try {
      const response: AxiosResponse = await BackendApi.post('/terra/disconnect', {
        terra_user_id: data.terra_user_id
      });

      //  disconnect successfully
      if (response.status >= 200 && response.status <= 399 && response.data !== undefined) {
        setTimeout(() => {
          getSubscriptions();
        }, 1000);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const btnToggleClick = async (checked: boolean, item: TerraProvider) => {
    try {
      setIsLoading(true);
      if (item.provider_name == 'Apple') {
        const user = await Auth.currentAuthenticatedUser();
        if (checked == false) {
          await deauthTerra(Connections.APPLE_HEALTH);
        } else {
          await initTerra(
            Config.TERRA_DEV_ID,
            String(Config.TERRA_API_KEY),
            user.attributes.sub,
            60,
            [Connections.APPLE_HEALTH],
            [
              Permissions.ACTIVITY,
              Permissions.ATHLETE,
              Permissions.BODY,
              Permissions.DAILY,
              Permissions.NUTRITION,
              Permissions.SLEEP
            ]
          );
        }
        setTimeout(() => {
          getSubscriptions();
        }, 1500);
      } else {
        if (checked == false) {
          await disconnect(item);
        } else {
          await connect(item);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const showHint = (item?: TerraProvider) => {
    if (item == undefined) {
      setInfo(
        'You can connect one more wearables to your Kalibra account. Do not connect more than wearable if they are integrated with each other.'
      );
      setVisibleInfoModal(true);
    } else {
      if (item.disconnectedDate != null) {
        setInfo(
          `Connected on ${moment(item.connectedDate).format('YYYY-MM-DD')} \n Disconnected on ${moment(
            item.disconnectedDate
          ).format('YYYY-MM-DD')}`
        );
      } else {
        let strReceivedTime = '';
        if (item.terra_last_webhook_update != null) {
          const duration = moment.duration(moment(Date()).diff(moment(item.terra_last_webhook_update)));
          if (duration.asDays() > 0) {
            strReceivedTime = `Data last received :  ${moment(item.terra_last_webhook_update).format(
              'YYYY-MM-DD hh:mm'
            )}`;
          } else {
            if (duration.asHours() > 0) {
              strReceivedTime = `Data last received :  ${duration.asHours()} hours ago`;
            } else {
              strReceivedTime = `Data last received :  ${duration.asMinutes} minutes ago`;
            }
          }
        }
        setInfo(`Connected on ${moment(item.connectedDate).format('YYYY-MM-DD')} \n ${strReceivedTime}`);
      }
      setVisibleInfoModal(true);
    }
  };

  const renderProviders = () => {
    return providers.map((item) => {
      return (
        <ProviderItem
          key={item.provider_name}
          data={item}
          btnToggleClick={(checked) => btnToggleClick(checked, item)}
          showHint={() => showHint(item)}
        />
      );
    });
  };

  const handleWebViewNavigationStateChange = (newNavState: any) => {
    const { url } = newNavState;
    if (!url) return;

    //enable done button
    if (url.includes('auth-success') || url.includes('auth-failure')) {
      setTimeout(() => {
        setBtnTitle('Done');
      }, 1150);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
  }, []);

  const renderWebView = () => {
    return (
      <>
        <WebView source={{ uri: authUrl }} onNavigationStateChange={handleWebViewNavigationStateChange} />
        <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 20, marginTop: 10 }}>
          <Button
            status="primary"
            disabled={false}
            size="small"
            style={{ marginLeft: 40, marginRight: 50 }}
            onPress={() => {
              setAuthUrl('');
              setBtnTitle('Cancel');
              getSubscriptions();
            }}
          >
            {btnTitle}
          </Button>
        </View>
      </>
    );
  };

  const renderList = () => {
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        alwaysBounceVertical={true}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {isLoading == true && refreshing == false && <Spinner visible={true} />}
        <Layout level="2" style={[styleContainer.screenContainer, settingStyles.settingScreenContainer]}>
          <SafeAreaView style={styleContainer.screenContainer}>
            <Text category="s1">Connected Wearables </Text>
            <Divider
              appearance="default"
              style={{ marginTop: 5, marginBottom: 15, backgroundColor: th['color-primary-500'] }}
            />
            <TouchableOpacity onPress={() => showHint()}>
              <Icon name="info-outline" fill={th['color-info-500']} style={styleContainer.infoIcon}></Icon>
            </TouchableOpacity>
            {renderProviders()}
            <InfoModal
              message={info}
              visible={visibleInfoModal}
              closeBtnClick={() => {
                setVisibleInfoModal(false);
              }}
            />
          </SafeAreaView>
        </Layout>
      </ScrollView>
    );
  };

  //view
  if (authUrl.length > 0) {
    return renderWebView();
  } else {
    return renderList();
  }
};

export default ConnectedDevicesScreen;
