import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import TypesList from './list';
import TypesNew from './new';
import TypesEdit from './edit';

class Types extends Component {
  render() {
    return (
      <Switch>
        <Route path="/types/new" component={TypesNew} />
        <Route path="/types/:typeId/edit" component={TypesEdit} />
        <Route path="/types" component={TypesList} />
      </Switch>
    );
  };
}

export default Types;
