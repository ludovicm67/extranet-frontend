// types
export const SET_ERR_MSG = 'SET_ERR_MSG';
export const CLOSE_ERR = 'CLOSE_ERR';
export const CONFIRM = 'CONFIRM';
export const CLOSE_CONFIRM = 'CLOSE_CONFIRM';
export const REQ = 'REQ';
export const CLOSE_REQ = 'CLOSE_REQ';

// actions
export const closeErr = () => {
  return {
    type: CLOSE_ERR,
  };
};

export const closeConfirm = () => {
  return {
    type: CLOSE_CONFIRM,
  };
};

export const closeReq = () => {
  return {
    type: CLOSE_REQ,
  };
};

export const setErrMsg = msg => {
  return {
    type: SET_ERR_MSG,
    payload: msg,
  };
};

export const confirm = (title, content, callback) => {
  return {
    type: CONFIRM,
    payload: {
      title,
      content,
      callback,
    },
  };
};

export const confirmDelete = callback => {
  return confirm(
    'Confirmer la suppression ?',
    'Souhaitez-vous réellement supprimer cet élément ? Cette action sera irréversible et supprimera tous les éléments associés.',
    callback,
  );
};

export const req = (leave, callback) => {
  return {
    type: REQ,
    payload: {
      leave,
      callback,
    },
  };
};
