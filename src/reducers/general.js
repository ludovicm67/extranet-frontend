import { SET_ERR_MSG } from '../actions/general';

// the initial store state, at the boot of the app
const initialState = {
  err: {
    open: false,
    msg: 'An error occured!',
  },
};

// reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ERR_MSG:
      return {
        ...state,
        err: {
          open: true,
          msg: '' + action.payload || 'An error occured!',
        },
      };

    default: {
      return state;
    }
  }
};
