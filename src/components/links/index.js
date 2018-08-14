import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import LinksList from './list';
import LinksNew from './new';
import LinksEdit from './edit';
import LinksShow from './show';

class Links extends Component {
  render() {
    return (
      <Switch>
        <Route path="/links/new" component={LinksNew} />
        <Route path="/links/all" component={LinksShow} />
        <Route path="/links/:linkId/edit" component={LinksEdit} />
        <Route path="/links/:categoryId" component={LinksShow} />
        <Route path="/links" component={LinksList} />
      </Switch>
    );
  };
}

export default Links;
