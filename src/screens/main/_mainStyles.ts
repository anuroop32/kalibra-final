import { StyleSheet } from 'react-native';
import { UIHelper as uh } from '../../core';
export const mainStyles = StyleSheet.create({
  // Main Root Container of the Application
  mainScreenContainer: {
    paddingLeft: uh.w2DP(16),
    paddingRight: uh.w2DP(16),
    paddingTop: uh.h2DP(20),
    paddingBottom: uh.h2DP(20)
  }
});
