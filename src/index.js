import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import store from './store';
import { Provider } from 'react-redux';

console.log('initial state: ' + JSON.stringify(store.getState()));

const Root = (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(Root, document.getElementById('root'));
registerServiceWorker();



// let unsubscribe = store.subscribe(() => console.log(store.getState()));

// store.dispatch(login('johnDoe', 'pass'));
// store.dispatch(logout());

// unsubscribe();
