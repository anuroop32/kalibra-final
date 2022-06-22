import Auth from '@aws-amplify/auth';
import axios from 'axios';
import * as moment from 'moment-timezone';
import { Config } from '../../core';
import { getValue } from '../storage';

// Create axios client, pre-configured with baseURL
const BackendApi = axios.create({
  baseURL: Config.BACKEND_API_ENDPOINT,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
    'The-Timezone-IANA': moment.tz.guess()
  }
});

// Set JSON Web Token in Client to be included in all calls
BackendApi.interceptors.request.use(async (config: any) => {
  const result = await Auth.currentSession();
  const token = result.getIdToken().getJwtToken();
  config.headers.Authorization = `Bearer ${token}`;
  config.headers.Tenant = await getValue('tenantKey');
  return config;
});

export default BackendApi;
