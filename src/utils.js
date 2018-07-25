import axios from 'axios';
import qs from 'qs';
import store from './store';
import constants from './constants';
import { logout, login } from './actions/auth';

const tryRefreshToken = () => {
  const request = axios.get(`
    ${constants.API_ENDPOINT}/auth/refresh?token=${store.getState().auth.auth.token}
  `).then(res => {
    if (!res.data.success || !res.data.data || !res.data.data.token) {
      return false;
    }
    store.dispatch(login(res.data.data.token));
    return true;
  }).catch(_e => false);

  return request;
};

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
        tryRefreshToken().then(e => {
          if (!e) {
            store.dispatch(logout());
            window.location.href = '/login';
          } else {
            window.location.reload();
          }
        }).catch(_e => {
          store.dispatch(logout());
          window.location.href = '/login';
        });
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
        tryRefreshToken().then(e => {
          if (!e) {
            store.dispatch(logout());
            window.location.href = '/login';
          } else {
            return postApi(location, data, defaultReturn);
          }
        }).catch(_e => {
          store.dispatch(logout());
          window.location.href = '/login';
        });
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
        tryRefreshToken().then(e => {
          if (!e) {
            store.dispatch(logout());
            window.location.href = '/login';
          } else {
            return putApi(location, data, defaultReturn);
          }
        }).catch(_e => {
          store.dispatch(logout());
          window.location.href = '/login';
        });
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
        tryRefreshToken().then(e => {
          if (!e) {
            store.dispatch(logout());
            window.location.href = '/login';
          } else {
            return deleteApi(location, defaultReturn);
          }
        }).catch(_e => {
          store.dispatch(logout());
          window.location.href = '/login';
        });
      }
      return defaultReturn;
    });

  return request;
}
