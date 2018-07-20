import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import { setUserData } from './actions/auth';
import store from './store';
import { getApi } from './utils';
import PasswordReset from './components/PasswordReset';

class App extends Component {

  state = {
    redirect: null,
  };

  componentWillMount() {
    const hasToken = store.getState().auth.auth.token !== null;
    const pathName = window.location.pathname;
    const isOnProtectedRoute = !pathName.startsWith('/login')
      && !pathName.startsWith('/password/reset');

    // don't try to init user data if no token is defined
    if (hasToken) {
      getApi('users/me').then(res => {
        store.dispatch(setUserData(res));
      });
    } else if (isOnProtectedRoute && pathName !== '/login') {
      this.setState({
        redirect: '/login',
      });
    }

  }

  render() {
    const redirect = (this.state.redirect === null)
      ? (
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/password/reset" component={PasswordReset} />
          <Route path="/" component={Layout} />
        </Switch>
      ) : (
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/password/reset" component={PasswordReset} />
          <Redirect to={this.state.redirect} />
          <Route path="/" component={Layout} />
        </Switch>
      );

    return (
      <main className="App">
        <Router>
          {redirect}
        </Router>
      </main>
    );
  }
}

export default App;
