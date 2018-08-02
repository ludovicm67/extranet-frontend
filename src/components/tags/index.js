import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import TagsList from './list';
import TagsNew from './new';
import TagsEdit from './edit';
import TagsShow from './show';

class Tags extends Component {
  render() {
    return (
      <Switch>
        <Route path="/tags/new" component={TagsNew} />
        <Route path="/tags/:tagId/edit" component={TagsEdit} />
        <Route path="/tags/:tagId/:tagValue" component={TagsShow} />
        <Route path="/tags/:tagId" component={TagsShow} />
        <Route path="/tags" component={TagsList} />
      </Switch>
    );
  };
}

export default Tags;
