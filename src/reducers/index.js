import { combineReducers } from 'redux';
import authReducer from './auth';

// merge all reducers
const allReducers = {
  auth: authReducer,
};

// final reducer
const rootReducer = combineReducers(allReducers);

export default rootReducer;
