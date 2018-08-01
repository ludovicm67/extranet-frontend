import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ProjectsList from './list';
import ProjectsNew from './new';
import ProjectsEdit from './edit';
import ProjectsShow from './show';
import ProjectsNewIdentifier from './newIdentifier';
import ProjectsShowIdentifiers from './showIdentifiers';

class Projects extends Component {
  render() {
    return (
      <Switch>
        <Route path="/projects/new" component={ProjectsNew} />
        <Route path="/projects/:projectId/edit" component={ProjectsEdit} />
        <Route path="/projects/:projectId/identifiers/new" component={ProjectsNewIdentifier} />
        <Route path="/projects/:projectId/identifiers" component={ProjectsShowIdentifiers} />
        <Route path="/projects/:projectId" component={ProjectsShow} />
        <Route path="/projects" component={ProjectsList} />
      </Switch>
    );
  };
}

export default Projects;
