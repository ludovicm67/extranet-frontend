import { LOGIN, LOGOUT } from '../actions/auth';

// the initial store state, at the boot of the app
const initialState = {
  auth: {
    token: localStorage.getItem('token'),
  },
};

// reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
    case LOGOUT: {
      const token = action.payload.token;
      if (token === null) {
        localStorage.removeItem('token');
      } else {
        localStorage.setItem('token', token);
      }
      return {
        ...state,
        auth: {
          token,
        }
      }
    }

    default: {
      return state;
    }
  }
};
