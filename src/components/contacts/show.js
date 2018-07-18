import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';

import { getApi } from '../../utils';

const styles = {
  intro: {
    paddingBottom: '20px',
  },
  submit: {
    marginTop: '42px',
  },
  formControl: {
    marginTop: '20px',
  },
};

class ContactShow extends Component {
  state = {
    id: this.props.match.params.contactId,
    firstname: '',
    lastname: '',
    role: '',
    is_admin: 0,
    email: '',
    password: '',
  };

  componentDidMount() {
    getApi(`contacts/${this.state.id}`).then(res => {
      this.setState({
        firstname: res.firstname || '',
        lastname: res.lastname || '',
        role: (res.is_admin === 1 ? (<strong>Super administrateur</strong>) : (res.role && res.role.name) ? res.role.name : 'Aucun'),
        is_admin: res.is_admin,
        email: res.email || '',
        password: '',
      });
    });
  }

  render() {
    return (
      <div>
        <Typography variant="display1" gutterBottom>
          {`${this.state.firstname} ${this.state.lastname} (${this.state.email})`}
        </Typography>
        <Typography style={styles.intro}>Affichage des informations à propos de cet utilisateur</Typography>
        <Typography>
          <strong>Nom complet : </strong>
          {`${this.state.firstname} ${this.state.lastname}`}
        </Typography>
        <Typography>
          <strong>Adresse mail : </strong>
          <a href={`mailto:${this.state.email}`}>{this.state.email}</a>
        </Typography>
        <Typography>
          <strong>Rôle : </strong>
          {this.state.role}
        </Typography>
      </div>
    );
  };
}

export default ContactShow;
