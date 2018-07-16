import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import { getApi } from '../../utils';

const styles = {
  intro: {
    paddingBottom: '50px',
  },
};

class ClientsShow extends Component {
  state = {
    data: {
      id: '',
      name: '',
      contacts: [],
      orders: [],
      subscriptions: [],
    },
  };

  componentDidMount() {
    getApi(`sellsy_clients/${this.props.match.params.clientId}`).then(res => {
      this.setState({
        data: res,
      });
    });
  }

  render() {
    let contacts = null;
    if (this.state.data.contacts.length > 0) {
      const contactsMap = this.state.data.contacts.map(n => {
        return (
          <p key={n.id}>
            {n.name}
          </p>
        );
      });
      contacts = (
        <Paper>
          <Typography variant="headline">Contacts</Typography>
          {contactsMap}
        </Paper>
      );
    }

    let orders = null;
    if (this.state.data.orders.length > 0) {
      const ordersMap = this.state.data.orders.map(n => {
        return (
          <p key={n.id}>
            {n.subject}
          </p>
        );
      });
      orders = (
        <Paper>
          <Typography variant="headline">Commandes</Typography>
          {ordersMap}
        </Paper>
      );
    }

    let subscriptions = null;
    if (this.state.data.subscriptions.length > 0) {
      const subscriptionsMap = this.state.data.subscriptions.map(n => {
        return (
          <p key={n.id}>
            {n.subject}
          </p>
        );
      });
      subscriptions = (
        <Paper>
          <Typography variant="headline">Factures liées aux abonnements</Typography>
          {subscriptionsMap}
        </Paper>
      );
    }

    return (
      <div>
        <Typography variant="display1" gutterBottom>
          {this.state.data.name}
        </Typography>
        <Typography style={styles.intro}>Affichage de quelques informations à propos de ce client</Typography>
        {contacts}
        {orders}
        {subscriptions}
      </div>
    );
  };
}

export default ClientsShow;
