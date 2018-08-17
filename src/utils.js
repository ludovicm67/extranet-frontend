import axios from 'axios';
import qs from 'qs';
import store from './store';
import constants from './constants';
import { logout, login } from './actions/auth';

const manageErrors = msg => {
  let message = msg;
  if (Array.isArray(msg)) {
    message = msg.join(', ');
  }
  console.log('ERROR: ' + message);
  throw new Error(message);
}

const tryRefreshToken = () => {
  const request = axios.get(`
    ${constants.API_ENDPOINT}/auth/refresh
  `, {
    headers: {
      'Authorization': `Bearer ${store.getState().auth.auth.token}`,
      'Content-type': 'application/x-www-form-urlencoded',
    },
  }).then(res => {
    if (!res.data.success || !res.data.data || !res.data.data.token) {
      return false;
    }
    store.dispatch(login(res.data.data.token));
    return true;
  }).catch(_e => false);

  return request;
};

const generateFormData = (data, method = null) => {
  const hasFile = data && data.file && data.file instanceof File;
  const completeData = method ? { ...data, _method: method } : data;
  const fd = new FormData();
  const qsData = qs.stringify(completeData);
  const qsSplitted = qsData.split('&');
  for (let k in qsSplitted) {
    const [head, ...tail] = qsSplitted[k].split('=');
    fd.append(decodeURIComponent(head), decodeURIComponent(tail));
  }
  if (hasFile) {
    fd.append('file', data.file);
  }
  return fd;
};

export const getApi = (location, defaultReturn = []) => {
  const request = axios.get(`
    ${constants.API_ENDPOINT}/${location}
  `, {
      headers: {
        'Authorization': `Bearer ${store.getState().auth.auth.token}`,
        'Content-type': 'application/x-www-form-urlencoded',
      },
    }).then(res => {
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
      } else if (e && e.response && e.response.data) {
        if (e.response.data.message) {
          manageErrors(e.response.data.message);
        } else if (e.response.data.errors) {
          manageErrors(e.response.data.errors);
        }
      }
      return defaultReturn;
    });

  return request;
}

export const postApi = (location, data = {}, defaultReturn = []) => {
  const request = axios.post(`
    ${constants.API_ENDPOINT}/${location}
  `, generateFormData(data), {
      headers: {
        'Authorization': `Bearer ${store.getState().auth.auth.token}`,
        'Content-type': 'application/x-www-form-urlencoded',
      },
    }).then(res => {
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
      } else if (e && e.response && e.response.data) {
        if (e.response.data.message) {
          manageErrors(e.response.data.message);
        } else if (e.response.data.errors) {
          manageErrors(e.response.data.errors);
        }
      }
      return defaultReturn;
    });

  return request;
}

export const putApi = (location, data = {}, defaultReturn = []) => {
  const request = axios.post(`
    ${constants.API_ENDPOINT}/${location}
  `, generateFormData(data, 'PUT'), {
      headers: {
        'Authorization': `Bearer ${store.getState().auth.auth.token}`,
        'Content-type': 'application/x-www-form-urlencoded',
      },
    }).then(res => {
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
      } else if (e && e.response && e.response.data) {
        if (e.response.data.message) {
          manageErrors(e.response.data.message);
        } else if (e.response.data.errors) {
          manageErrors(e.response.data.errors);
        }
      }
      return defaultReturn;
    });

  return request;
}

export const deleteApi = (location, defaultReturn = []) => {
  const request = axios.post(`
    ${constants.API_ENDPOINT}/${location}
  `, generateFormData({}, 'DELETE'), {
      headers: {
        'Authorization': `Bearer ${store.getState().auth.auth.token}`,
        'Content-type': 'application/x-www-form-urlencoded',
      },
    }).then(res => {
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
      } else if (e && e.response && e.response.data) {
        if (e.response.data.message) {
          manageErrors(e.response.data.message);
        } else if (e.response.data.errors) {
          manageErrors(e.response.data.errors);
        }
      }
      return defaultReturn;
    });

  return request;
}

export const urlApi = (url) => {
  return `${constants.API_ENDPOINT}/${url}`
}

export const hasPermission = (permission, right = 'show', contentId = null) => {
  if (!store.getState().auth.auth.token) return false;
  if (!store.getState().auth.auth.userData) return false;
  if (store.getState().auth.auth.userData.id === 0) return false;
  if (store.getState().auth.auth.userData.is_admin === 1) return true;
  if (permission === 'projects' && contentId) {
    const up = store.getState().auth.auth.userData.user_projects;
    if (up && up.length > 0 && up.includes(parseInt(contentId, 10))) {
      return true;
    }
  }

  if (!store.getState().auth.auth.userData.role) return false;
  if (!store.getState().auth.auth.userData.role.permissions) return false;
  const p = store.getState().auth.auth.userData.role.permissions.filter(e => {
    return e.name === permission;
  });
  if (!p || !Array.isArray(p) || !p[0]) return false;
  if (right === 'show' && p[0].show === 1) return true;
  if (right === 'add' && p[0].add === 1) return true;
  if (right === 'edit' && p[0].edit === 1) return true;
  if (right === 'delete' && p[0].delete === 1) return true;
  return false;
}
