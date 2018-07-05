import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import store from './store';
import { login, logout } from './actions/auth';
import { Provider } from 'react-redux';

console.log('initial state: ' + JSON.stringify(store.getState()));

const Root = (
  <Provider store={store}>
    <Router>
      <Route path="/" component={App} />
    </Router>
  </Provider>
);

ReactDOM.render(Root, document.getElementById('root'));
registerServiceWorker();



let unsubscribe = store.subscribe(() => console.log(store.getState()));

store.dispatch(login('johnDoe', 'pass'));
store.dispatch(logout());

unsubscribe();
