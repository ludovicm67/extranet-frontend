import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ContractsList from './list';
import ContractsNew from './new';

class Contracts extends Component {
  render() {
    return (
      <Switch>
        <Route path="/contracts/new" component={ContractsNew} />
        <Route path="/contracts" component={ContractsList} />
      </Switch>
    );
  };
}

export default Contracts;
