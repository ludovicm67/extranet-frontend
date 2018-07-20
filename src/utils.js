import axios from 'axios';
import qs from 'qs';
import store from './store';
import constants from './constants';
import { logout } from './actions/auth';

export const getApi = (location, defaultReturn = []) => {
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
        store.dispatch(logout());
        window.location.href = '/login';
      }
      return defaultReturn;
    });

  return request;
}

export const postApi = (location, data = {}, defaultReturn = []) => {
  const request = axios.post(`
    ${constants.API_ENDPOINT}/${location}?token=${store.getState().auth.auth.token}
  `, qs.stringify(data)).then(res => {
      if (!res.data.success) {
        throw new Error('no success');
      }
      if (res.data.data) {
        return res.data.data;
      }
      return res.data;
    }).catch((e) => {
      if (e && e.response && e.response.status && e.response.status === 401) {
        store.dispatch(logout());
        window.location.href = '/login';
      }
      return defaultReturn;
    });

  return request;
}

export const putApi = (location, data = {}, defaultReturn = []) => {
  const request = axios.post(`
    ${constants.API_ENDPOINT}/${location}?token=${store.getState().auth.auth.token}
  `, qs.stringify({ ...data, _method: 'PUT' })).then(res => {
      if (!res.data.success) {
        throw new Error('no success');
      }
      if (res.data.data) {
        return res.data.data;
      }
      return res.data;
    }).catch((e) => {
      if (e && e.response && e.response.status && e.response.status === 401) {
        store.dispatch(logout());
        window.location.href = '/login';
      }
      return defaultReturn;
    });

  return request;
}

export const deleteApi = (location, defaultReturn = []) => {
  const request = axios.post(`
    ${constants.API_ENDPOINT}/${location}?token=${store.getState().auth.auth.token}
  `, qs.stringify({ _method: 'DELETE' })).then(res => {
      if (!res.data.success) {
        throw new Error('no success');
      }
      if (res.data.data) {
        return res.data.data;
      }
      return res.data;
    }).catch((e) => {
      if (e && e.response && e.response.status && e.response.status === 401) {
        store.dispatch(logout());
        window.location.href = '/login';
      }
      return defaultReturn;
    });

  return request;
}
