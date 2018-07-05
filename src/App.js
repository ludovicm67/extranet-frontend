import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect';
import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper';

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
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/login" component={userIsNotAuthenticated(Login)} />
            <Route path="/" component={userIsAuthenticated(Dashboard)} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
