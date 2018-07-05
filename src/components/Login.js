import React, { Component } from 'react';
import { login } from '../actions/auth';
import store from '../store';

import Button from '@material-ui/core/Button';

class Login extends Component {
  handleLogin() {
    store.dispatch(login('zaea', 'azeaze'));
  }

  render() {
    return (
      <div>
        <Button variant="contained" color="primary" onClick={this.handleLogin}>
          :-)
        </Button>
      </div>
    );
  }
}

export default Login;
