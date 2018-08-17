// types
export const SET_ERR_MSG = 'SET_ERR_MSG';

// actions
export const setErrMsg = (msg) => {
  return {
    type: SET_ERR_MSG,
    payload: msg,
  };
};
