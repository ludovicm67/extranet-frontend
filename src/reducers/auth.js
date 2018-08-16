import { SET_USER_DATA, LOGIN, LOGOUT } from '../actions/auth';

// the initial store state, at the boot of the app
const initialState = {
  auth: {
    token: localStorage.getItem('token'),
    userData: {
      id: 0,
      firstname: '',
      lastname: '',
      email: '',
      created_at: '',
      updated_at: '',
      is_admin: 0,
      default_page: '/',
      role_id: null,
      user_projects: [],
    },
  },
};

// reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_DATA:
      let stateToken = state.auth.token;
      if (action.payload.id === 0) {
        stateToken = null;
        localStorage.removeItem('token');
      }
      return {
        ...state,
        auth: {
          token: stateToken,
          userData: action.payload,
        },
      };
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
          userData: {
            id: 0,
            firstname: '',
            lastname: '',
            email: '',
            created_at: '',
            updated_at: '',
            is_admin: 0,
            default_page: '/',
            role_id: null,
          },
        }
      }
    }

    default: {
      return state;
    }
  }
};
