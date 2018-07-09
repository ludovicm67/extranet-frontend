import axios from 'axios';
import React, { Component } from 'react';
import constants from '../../constants';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const styles = {
  intro: {
    paddingBottom: '50px',
  },
  btn: {
    display: 'block',
    marginBottom: '20px',
  },
}

class Updates extends Component {
  state = {
    btn: {
      clients: false,
      contacts: false,
      orders: false,
      invoices: false,
    },
  }

  handleUpdateClick(endpoint) {
    let s = {};
    s[endpoint] = true;
    this.setState(s);
    axios.get(`${constants.API_ENDPOINT}/cron/sellsy_${endpoint}`)
         .finally(() => {
           s[endpoint] = false;
           this.setState(s);
         });
  }

  render() {
    return (
      <div>
        <Typography variant="display1" gutterBottom>
          Mettre à jour les données importées depuis Sellsy
        </Typography>
        <Typography style={styles.intro}>
          Cliquez sur les boutons suivants pour forcer une mise à jour des
          informations récupérées depuis Sellsy.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          style={styles.btn}
          onClick={this.handleUpdateClick.bind(this, 'clients')}
          disabled={this.state.clients}
        >
          Mettre à jour les clients
         </Button>
        <Button
          variant="contained"
          color="primary"
          style={styles.btn}
          onClick={this.handleUpdateClick.bind(this, 'contacts')}
          disabled={this.state.contacts}
        >
          Mettre à jour les contacts
         </Button>
        <Button
          variant="contained"
          color="primary"
          style={styles.btn}
          onClick={this.handleUpdateClick.bind(this, 'orders')}
          disabled={this.state.orders}
        >
          Mettre à jour les commandes
         </Button>
        <Button
          variant="contained"
          color="primary"
          style={styles.btn}
          onClick={this.handleUpdateClick.bind(this, 'invoices')}
          disabled={this.state.invoices}
        >
          Mettre à jour les factures
         </Button>
      </div>
    );
  };
}

export default Updates;
