import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from "@material-ui/core/TextField";
import FormControl from '@material-ui/core/FormControl';
import Select from '../layout/Select';

import { getApi, putApi } from '../../utils';

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

class ContactsEdit extends Component {
  state = {
    id: this.props.match.params.userId,
    defaultPages: [
      {
        label: 'Tableau de bord',
        value: '/',
      },
      {
        label: 'Clients',
        value: '/clients',
      },
      {
        label: 'Projets',
        value: '/projects',
      },
      {
        label: 'Interlocuteurs',
        value: '/contacts',
      },
      {
        label: 'Utilisateurs',
        value: '/users',
      },
      {
        label: 'Rôles',
        value: '/roles',
      },
      {
        label: 'Calendrier',
        value: '/calendar',
      },
      {
        label: 'Mon calendrier',
        value: '/calendar?me=1',
      },
      {
        label: 'Congés',
        value: '/leave',
      },
      {
        label: 'Notes de frais',
        value: '/expenses',
      },
      {
        label: 'Contrats',
        value: '/contracts',
      },
    ],
    roles: [],
    firstname: '',
    lastname: '',
    roleId: 0,
    email: '',
    password: '',
    defaultPage: '/',
  };

  componentDidMount() {
    getApi('roles').then(res => {
      const roles = [
        {
          label: 'Aucun rôle',
          value: 0,
        }
      ];
      roles.push(...res.map(e => {
        return {
          label: e.name,
          value: e.id,
        };
      }));
      roles.push({
        label: 'Super Administrateur',
        value: -1,
      });
      this.setState({
        roles,
      });
    });
    getApi(`users/${this.state.id}`).then(res => {
      const defaultPage = res.default_page;
      const filterPages = this.state.defaultPages.filter(e => {
        return e.value === defaultPage;
      });

      let defaultPages = this.state.defaultPages;
      if (filterPages.length <= 0) {
        defaultPages.push({
          label: defaultPage,
          value: defaultPage,
        });
      }

      this.setState({
        defaultPages,
        firstname: res.firstname || '',
        lastname: res.lastname || '',
        roleId: (res.is_admin === 1 ? -1 : res.role_id) || 0,
        email: res.email || '',
        password: '',
        defaultPage: res.default_page || '/',
      });
    });
  }

  handleSubmit() {
    putApi(`users/${this.state.id}`, {
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      role_id: this.state.roleId || 0,
      email: this.state.email,
      password: this.state.password,
      default_page: this.state.defaultPage || '/',
    }).then(res => {
      this.props.history.push('/users');
    });
  }

  handleChange = prop => event => {
    if (event && event.target && event.target.value !== undefined) {
      this.setState({
        [prop]: event.target.value,
      });
    } else {
      this.setState({
        [prop]: event,
      });
    }
  };

  render() {
    return (
      <div>
        <Typography variant="display1" gutterBottom>
          Modifier un utilisateur
        </Typography>
        <Typography style={styles.intro}>Entrez ici les informations concernant l'utilisateur</Typography>
        <FormControl fullWidth style={styles.formControl}>
          <InputLabel htmlFor="user-lastname">Nom</InputLabel>
          <Input
            id="user-lastname"
            type="text"
            value={this.state.lastname}
            onChange={this.handleChange('lastname')}
            autoComplete="new-password"
          />
        </FormControl>
        <FormControl fullWidth style={styles.formControl}>
          <InputLabel htmlFor="user-firstname">Prénom</InputLabel>
          <Input
            id="user-firstname"
            type="text"
            value={this.state.firstname}
            onChange={this.handleChange('firstname')}
            autoComplete="new-password"
          />
        </FormControl>
        <TextField
          style={styles.formControl}
          fullWidth
          value={this.state.roleId}
          onChange={this.handleChange('roleId')}
          placeholder="Choisissez le rôle de l'utilisateur..."
          name="select-role"
          label="Rôle"
          autoComplete="new-password"
          InputLabelProps={{
            shrink: true
          }}
          InputProps={{
            inputComponent: Select,
            inputProps: {
              creatable: true,
              multi: false,
              instanceId: "select-role",
              id: "select-role",
              simpleValue: true,
              options: this.state.roles,
            }
          }}
        />
        <FormControl fullWidth style={styles.formControl}>
          <InputLabel htmlFor="user-email">Adresse mail</InputLabel>
          <Input
            id="user-email"
            type="email"
            value={this.state.email}
            onChange={this.handleChange('email')}
            autoComplete="new-password"
          />
        </FormControl>
        <FormControl fullWidth style={styles.formControl}>
          <InputLabel htmlFor="user-password">Mot de passe (vide = inchangé)</InputLabel>
          <Input
            id="user-password"
            type="password"
            value={this.state.password}
            onChange={this.handleChange('password')}
            autoComplete="new-password"
          />
        </FormControl>
        <TextField
          style={styles.formControl}
          fullWidth
          value={this.state.defaultPage}
          onChange={this.handleChange('defaultPage')}
          placeholder="Choisissez la page par défaut..."
          name="select-default-page"
          label="Page par défaut"
          autoComplete="new-password"
          InputLabelProps={{
            shrink: true
          }}
          InputProps={{
            inputComponent: Select,
            inputProps: {
              creatable: true,
              multi: false,
              instanceId: "select-default-page",
              id: "select-default-page",
              simpleValue: true,
              options: this.state.defaultPages,
            }
          }}
        />
        <Button variant="contained" color="primary" style={styles.submit} onClick={this.handleSubmit.bind(this)}>
          Modifier
        </Button>
      </div>
    );
  };
}

export default ContactsEdit;
