import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import LinkCategoriesList from './list';
import LinkCategoriesNew from './new';
import LinkCategoriesEdit from './edit';

class LinkCategories extends Component {
  render() {
    return (
      <Switch>
        <Route path="/link_categories/new" component={LinkCategoriesNew} />
        <Route path="/link_categories/:link_categoryId/edit" component={LinkCategoriesEdit} />
        <Route path="/link_categories" component={LinkCategoriesList} />
      </Switch>
    );
  };
}

export default LinkCategories;
