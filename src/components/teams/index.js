import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import TeamsList from './list';
import TeamsNew from './new';
import TeamsEdit from './edit';

class Teams extends Component {
  render() {
    return (
      <Switch>
        <Route path="/teams/new" component={TeamsNew} />
        <Route path="/teams/:teamId/edit" component={TeamsEdit} />
        <Route path="/teams" component={TeamsList} />
      </Switch>
    );
  };
}

export default Teams;
