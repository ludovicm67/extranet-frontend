// types
export const SET_USER_DATA = 'SET_USER_DATA';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

// actions
export const setUserData = (userData) => {
  return {
    type: SET_USER_DATA,
    payload: userData,
  };
};

export const login = (token) => {
  return {
    type: LOGIN,
    payload: {
      token,
    }
  };
};

export const logout = () => {
  return {
    type: LOGOUT,
    payload: {
      token: null,
    }
  };
};
