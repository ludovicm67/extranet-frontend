// types
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

// actions
export const login = ({token, service}) => {
  return {
    type: LOGIN,
    payload: {
      token,
      service,
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
