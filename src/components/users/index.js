import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import UsersList from './list';
import UsersNew from './new';
import UsersEdit from './edit';
import UsersMe from './me';

class Users extends Component {
  render() {
    return (
      <Switch>
        <Route path="/users/new" component={UsersNew} />
        <Route path="/users/:userId/edit" component={UsersEdit} />
        <Route path="/users/me" component={UsersMe} />
        <Route path="/users" component={UsersList} />
      </Switch>
    );
  };
}

export default Users;
