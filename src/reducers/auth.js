import { LOGIN, LOGOUT } from '../actions/auth';

// the initial store state, at the boot of the app
const initialState = {
  auth: {
    token: null,
  },
};

// reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
    case LOGOUT: {
      return {
        ...state,
        auth: {
          token: action.payload.token,
        }
      }
    }

    default: {
      return state;
    }
  }
};
