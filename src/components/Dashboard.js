import React, { Component } from 'react';
import Navbar from './layout/Navbar';
import { logout } from '../actions/auth';
import store from '../store';

import Button from '@material-ui/core/Button';

class Dashboard extends Component {
  handleLogout() {
    store.dispatch(logout());
  }

  render() {
    return (
      <div>
        <Navbar />
        Dashboard
        <Button variant="contained" color="primary" onClick={this.handleLogout}>
          :-(
        </Button>
      </div>
    );
  }
}

export default Dashboard;
