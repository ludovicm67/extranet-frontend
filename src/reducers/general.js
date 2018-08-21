import { SET_ERR_MSG, CONFIRM, CLOSE_ERR, CLOSE_CONFIRM, REQ, CLOSE_REQ } from '../actions/general';

// the initial store state, at the boot of the app
const initialState = {
  err: {
    open: false,
    msg: 'An error occured!',
  },
  confirm: {
    open: false,
    title: '',
    content: '',
    callback: () => {},
  },
  req: {
    open: false,
    leave: null,
    callback: () => {},
  },
};

// reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case CLOSE_ERR:
      return {
        ...state,
        err: {
          open: false,
          msg: null,
        },
      };

    case CLOSE_CONFIRM:
      return {
        ...state,
        confirm: {
          open: false,
          title: '',
          content: '',
          callback: () => { },
        },
      };

    case CLOSE_REQ:
      return {
        ...state,
        req: {
          open: false,
          leave: null,
        },
      };

    case REQ:
      return {
        ...state,
        req: {
          open: true,
          leave: action.payload.leave,
          callback: action.payload.callback,
        },
      };

    case SET_ERR_MSG:
      return {
        ...state,
        err: {
          open: true,
          msg: '' + action.payload || 'An error occured!',
        },
      };

    case CONFIRM:
      return {
        ...state,
        confirm: {
          open: true,
          title: action.payload.title || '',
          content: action.payload.content || '',
          callback: action.payload.callback,
        },
      };

    default: {
      return state;
    }
  }
};
