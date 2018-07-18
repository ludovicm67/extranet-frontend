import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ContactsList from './list';
import ContactsNew from './new';
import ContactsEdit from './edit';
import ContactsShow from './show';

class Contacts extends Component {
  render() {
    return (
      <Switch>
        <Route path="/contacts/new" component={ContactsNew} />
        <Route path="/contacts/:contactId/edit" component={ContactsEdit} />
        <Route path="/contacts/:contactId" component={ContactsShow} />
        <Route path="/contacts" component={ContactsList} />
      </Switch>
    );
  };
}

export default Contacts;
