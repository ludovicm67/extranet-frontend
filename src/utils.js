import axios from 'axios';
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
        store.dispatch(logout());
        window.location.href = '/login';
      }
      return defaultReturn;
    });

  return request;
}

export const putApi = (location, data = {}, defaultReturn = []) => {
  const toFormData = object => Object.keys(object).reduce((formData, key) => {
    formData.append(key, object[key]);
    return formData;
  }, new FormData());
  const formData = toFormData(data);
  formData.append('_method', 'PUT');

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
        store.dispatch(logout());
        window.location.href = '/login';
      }
      return defaultReturn;
    });

  return request;
}

export const deleteApi = (location, defaultReturn = []) => {
  const formData = new FormData();
  formData.append('_method', 'DELETE');
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
        store.dispatch(logout());
        window.location.href = '/login';
      }
      return defaultReturn;
    });

  return request;
}
