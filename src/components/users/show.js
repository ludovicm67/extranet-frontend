import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

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
  right: {
    float: 'right',
  },
};

class UsersShow extends Component {
  state = {
    id: this.props.match.params.userId,
    firstname: '',
    lastname: '',
    role: '',
    is_admin: 0,
    email: '',
    password: '',
  };

  componentDidMount() {
    getApi(`users/${this.state.id}`).then(res => {
      if (this.isUnmounted) {
        return;
      }
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

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  render() {
    return (
      <div>
        <Typography variant="display1" gutterBottom>
          <Button
            component={Link}
            to={`/overtime/${this.state.id}`}
            variant="contained"
            color="primary"
            style={styles.right}
          >
            <Icon>access_time</Icon>
            Heures supplémentaires
          </Button>
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

export default UsersShow;
