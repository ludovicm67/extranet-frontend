// types
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

// actions
export const login = (_email, _password) => {
  const token = 'azehajzegkjfjhsbh';

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
