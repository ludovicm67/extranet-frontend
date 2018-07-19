import { applyMiddleware, createStore } from 'redux';
import rootReducer from './reducers';
import logger from 'redux-logger';

let store;
if (process.env.NODE_ENV === 'development') {
  store = createStore(
    rootReducer,
    applyMiddleware(logger)
  );
} else {
  store = createStore(rootReducer);
}

export default store;
