import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import RequestsList from './list';
import LeaveEdit from './leaveEdit';
import Leave from './leave';
import ExpensesEdit from './expensesEdit';
import Expenses from './expenses';

class Requests extends Component {
  render() {
    return (
      <Switch>
        <Route path="/leave/:leaveId" component={LeaveEdit} />
        <Route path="/leave" component={Leave} />
        <Route path="/expenses/:expenseId" component={ExpensesEdit} />
        <Route path="/expenses" component={Expenses} />
        <Route path="/requests" component={RequestsList} />
      </Switch>
    );
  };
}

export default Requests;
