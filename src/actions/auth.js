// types
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

// actions
export const login = (token) => {
  return {
    type: LOGIN,
    payload: {
      token,
    }
  }
};

export const logout = () => {
  return {
    type: LOGOUT,
    payload: {
      token: null,
    }
  }
};
