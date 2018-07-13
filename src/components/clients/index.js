import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ClientsList from './list';
import ClientsShow from './show';

class Clients extends Component {
  render() {
    return (
      <Switch>
        <Route path="/clients/:clientId" component={ClientsShow} />
        <Route path="/clients" component={ClientsList} />
      </Switch>
    );
  };
}

export default Clients;
