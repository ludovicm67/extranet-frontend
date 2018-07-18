import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect';
import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper';
import { setUserData } from './actions/auth';
import store from './store';
import { getApi } from './utils';
import PasswordReset from './components/PasswordReset';

// don't try to init user data if no token is defined
if (store.getState().auth.auth.token !== null) {
  getApi('users/me').then(res => {
    store.dispatch(setUserData(res));
  });
}

const locationHelper = locationHelperBuilder({});

const userIsAuthenticated = connectedRouterRedirect({
  redirectPath: '/login',
  authenticatedSelector: state => state.auth.auth.token !== null,
  wrapperDisplayName: 'UserIsAuthenticated',
});

const userIsNotAuthenticated = connectedRouterRedirect({
  redirectPath: (_state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/',
  allowRedirectBack: false,
  authenticatedSelector: state => state.auth.auth.token === null,
  wrapperDisplayName: 'UserIsNotAuthenticated',
});

class App extends Component {
  render() {
    return (
      <main className="App">
        <Router>
          <Switch>
            <Route exact path="/login" component={userIsNotAuthenticated(Login)} />
            <Route exact path="/password/reset" component={userIsNotAuthenticated(PasswordReset)} />
            <Route path="/" component={userIsAuthenticated(Layout)} />
          </Switch>
        </Router>
      </main>
    );
  }
}

export default App;
