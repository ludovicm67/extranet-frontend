import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import RequestsList from './list';
import Leave from './leave';
import Expenses from './expenses';

class Requests extends Component {
  render() {
    return (
      <Switch>
        <Route path="/leave" component={Leave} />
        <Route path="/expenses" component={Expenses} />
        <Route path="/requests" component={RequestsList} />
      </Switch>
    );
  };
}

export default Requests;
