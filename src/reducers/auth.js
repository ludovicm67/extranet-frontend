import { LOGIN, LOGOUT } from '../actions/auth';

// the initial store state, at the boot of the app
const initialState = {
  auth: {
    token: localStorage.getItem('token'),
    service: 'Extranet',
  },
};

// reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
    case LOGOUT: {
      const token = action.payload.token;
      let service = state.auth.service;
      if (action.payload.service) {
        service = action.payload.service;
      }

      if (token === null) {
        localStorage.removeItem('token');
      } else {
        localStorage.setItem('token', token);
      }
      return {
        ...state,
        auth: {
          token,
          service,
        }
      }
    }

    default: {
      return state;
    }
  }
};
