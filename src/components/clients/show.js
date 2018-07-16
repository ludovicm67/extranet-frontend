import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { getApi } from '../../utils';

const styles = {
  intro: {
    paddingBottom: '50px',
  },
  partTitle: {
    marginTop: 36,
  },
  heading: {
    fontSize: 15,
    flexBasis: '50%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: 15,
    color: '#0000008a',
  },
};

class ClientsShow extends Component {
  state = {
    expanded: null,
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

  handleExpanded = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };


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
          <ExpansionPanel key={n.id} expanded={this.state.expanded === `panel-orders-${n.id}`} onChange={this.handleExpanded(`panel-orders-${n.id}`)}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography style={styles.heading}>{n.subject}</Typography>
              <Typography style={styles.secondaryHeading}>Montant restant...</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                Plus de détails à venir ici...
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        );
      });
      orders = (
        <div>
          <Typography variant="headline" style={styles.partTitle}>Commandes</Typography>
          {ordersMap}
        </div>
      );
    }

    let subscriptions = null;
    if (this.state.data.subscriptions.length > 0) {
      const subscriptionsMap = this.state.data.subscriptions.map(n => {
        return (
          <ExpansionPanel key={n.id} expanded={this.state.expanded === `panel-subs-${n.id}`} onChange={this.handleExpanded(`panel-subs-${n.id}`)}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography style={styles.heading}>{n.subject}</Typography>
              <Typography style={styles.secondaryHeading}>Montant restant...</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                Plus de détails à venir ici...
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        );
      });
      subscriptions = (
        <div>
          <Typography variant="headline" style={styles.partTitle}>Factures liées aux abonnements</Typography>
          {subscriptionsMap}
        </div>
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
