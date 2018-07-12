import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import RolesList from './list';
import RolesNew from './new';
import RolesEdit from './edit';

class Roles extends Component {
  render() {
    return (
      <Switch>
        <Route path="/roles/new" component={RolesNew} />
        <Route path="/roles/:roleId/edit" component={RolesEdit} />
        <Route path="/roles" component={RolesList} />
      </Switch>
    );
  };
}

export default Roles;
