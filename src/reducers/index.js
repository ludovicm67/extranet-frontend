import { combineReducers } from 'redux';
import authReducer from './auth';
import generalReducer from './general';

// merge all reducers
const allReducers = {
  auth: authReducer,
  general: generalReducer,
};

// final reducer
const rootReducer = combineReducers(allReducers);

export default rootReducer;
