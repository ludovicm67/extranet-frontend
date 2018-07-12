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
    }).catch((e) => {
      if (e && e.response && e.response.status && e.response.status === 401) {
        store.dispatch(logout())
      }
      return [];
    });

  return request;
}

export const postApi = (location, data = {}) => {
  const toFormData = object => Object.keys(object).reduce((formData, key) => {
    formData.append(key, object[key]);
    return formData;
  }, new FormData());
  const formData = toFormData(data);

  const request = axios.post(`
    ${constants.API_ENDPOINT}/${location}?token=${store.getState().auth.auth.token}
  `, formData).then(res => {
      if (!res.data.success) {
        throw new Error('no success');
      }
      if (res.data.data) {
        return res.data.data;
      }
      return res.data;
    }).catch((e) => {
      if (e && e.response && e.response.status && e.response.status === 401) {
        store.dispatch(logout())
      }
      return [];
    });

  return request;
}

export const deleteApi = (location, data = {}) => {
  const request = axios.delete(`
    ${constants.API_ENDPOINT}/${location}?token=${store.getState().auth.auth.token}
  `).then(res => {
      if (!res.data.success) {
        throw new Error('no success');
      }
      if (res.data.data) {
        return res.data.data;
      }
      return res.data;
    }).catch((e) => {
      if (e && e.response && e.response.status && e.response.status === 401) {
        store.dispatch(logout())
      }
      return [];
    });

  return request;
}
