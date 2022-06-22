import { Platform } from 'react-native';

import { Amplitude } from '@amplitude/react-native';
import amplitude, { AmplitudeClient } from 'amplitude-js';

import { Config } from '../../core/constants/Config';

const Analytics: Amplitude | AmplitudeClient =
  Platform.OS === 'web' ? amplitude.getInstance() : Amplitude.getInstance();
Analytics.init(Config.AMPLITUDE_API_KEY);

export default Analytics;
