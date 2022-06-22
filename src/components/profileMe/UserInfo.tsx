import { Text, Layout, Divider, useTheme } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { UIHelper as uh, StringHelper as sh, UserAttributes } from '../../core';
import moment from 'moment';
import Auth from '@aws-amplify/auth';

// call api to get those infos
// const user = {
//   firstName: 'Alex',
//   lastName: 'Williams',
//   dob: '01/10/1991',
//   height: '170',
//   bio: 'The user’s short bio that they write can go below here. They should be able to include emojis ✌️'
// };

const UserInfo = () => {
  const th = useTheme();
  // styles
  const styleContainer = StyleSheet.create({
    container: {
      padding: uh.h2DP(16),
      borderRadius: 8,
      flexDirection: 'row'
    },
    avatar: { marginRight: uh.w2DP(16) },
    bio: { marginTop: uh.h2DP(8) },
    divider: {
      marginLeft: uh.w2DP(8),
      marginRight: uh.w2DP(8),
      height: '100%',
      width: 1,
      backgroundColor: th['color-basic-300']
    }
  });

  const [userInfo, setUserInfo] = React.useState<UserAttributes>();
  const isSubscribed = React.useRef(false);

  const getUserInfo = React.useCallback(async () => {
    try {
      const result = await Auth.currentAuthenticatedUser();
      if (isSubscribed.current == false) {
        return;
      }
      setUserInfo(result.attributes);
    } catch (error) {
      console.error(error);
    }
  }, []);

  React.useEffect(() => {
    isSubscribed.current = true;
    getUserInfo();
    return () => {
      isSubscribed.current = false;
    };
  }, [getUserInfo]);

  if (userInfo == undefined) {
    return <></>;
  }

  // view
  return (
    <Layout style={styleContainer.container}>
      {/* <Avatar
        style={styleContainer.avatar}
        shape="rounded"
        size="large"
        source={require('../../../assets/images/avatar.png')}
      /> */}

      <View style={{ flex: 1 }}>
        <Text category="s1">{sh.capitalize(userInfo?.name as string)}</Text>

        <View style={{ flexDirection: 'row' }}>
          <Text category="c1" appearance="hint">
            {moment(userInfo.birthdate, 'YYYY-MM-DD').format('D MMM YYYY')}
          </Text>
          <Divider />
          {/* <View style={styleContainer.divider} />
          <Text category="c1" appearance="hint">
            {user.height} cm
          </Text> */}
        </View>
        {/* <Text category="p2" style={styleContainer.bio}>
          {user.bio}
        </Text> */}
      </View>
    </Layout>
  );
};

export default UserInfo;
