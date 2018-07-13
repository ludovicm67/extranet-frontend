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
        <div>
          <Typography variant="headline">Contacts</Typography>
          {contactsMap}
        </div>
      );
    }

    return (
      <div>
        <Typography variant="display1" gutterBottom>
          {this.state.data.name}
        </Typography>
        <Typography style={styles.intro}>Affichage de quelques informations à propos de ce client</Typography>
        <Paper>
          {contacts}
        </Paper>
      </div>
    );
  };
}

export default ClientsShow;
