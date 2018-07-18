import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import IdentifiersList from './list';
import IdentifiersNew from './new';
import IdentifiersEdit from './edit';

class Identifiers extends Component {
  render() {
    return (
      <Switch>
        <Route path="/identifiers/new" component={IdentifiersNew} />
        <Route path="/identifiers/:identifierId/edit" component={IdentifiersEdit} />
        <Route path="/identifiers" component={IdentifiersList} />
      </Switch>
    );
  };
}

export default Identifiers;
