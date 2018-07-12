import axios from 'axios';
import store from './store';
import constants from './constants';
import { logout } from './actions/auth';

export const getApi = location => {
  const request = axios.get(`
    ${constants.API_ENDPOINT}/${location}?token=${store.getState().auth.auth.token}
  `).then(res => {
    if (!res.data.success) {
      throw new Error('no success');
    }
    if (res.data.data) {
      return res.data.data;
    }
    return res.data;
  }).catch(() => store.dispatch(logout()));

  return request;
}
