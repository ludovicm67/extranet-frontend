import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from "@material-ui/core/TextField";
import FormControl from '@material-ui/core/FormControl';
import Select from '../layout/Select';

import { getApi, putApi, urlApi, deleteApi } from '../../utils';
import store from '../../store';
import { setUserData } from '../../actions/auth';

import moment from 'moment';
import 'moment/locale/fr';


moment.locale('fr');

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
  click: {
    cursor: 'pointer',
  },
};

class UsersMe extends Component {
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
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    defaultPage: '/',
    documents: [],
  };


  fetchData() {
    getApi('users/me').then(res => {
      if (this.isUnmounted) {
        return;
      }
      store.dispatch(setUserData(res));

      const user = res;

      const defaultPage = user.default_page;
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
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        email: user.email || '',
        password: '',
        defaultPage: user.default_page || '/',
        documents: user.documents || [],
      });
    });
  }

  componentDidMount() {
    if (this.isUnmounted) {
      return;
    }
    this.fetchData();
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  handleSubmit() {
    putApi(`users/me`, {
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      email: this.state.email,
      password: this.state.password,
      default_page: this.state.defaultPage || '/',
    }, {
      errored: true,
    }).then((res) => {
      if (res.errored) return;
      this.fetchData();
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

  displayFile(file) {
    let name;
    if (!file) return '';

    const d = moment(file.date);
    switch (file.type) {
      case 'pay':
        name = 'Fiche de paie du mois de ' + d.format('MMMM YYYY');
        break;
      case 'medical':
        name = 'Fiche de visite médicale du ' + d.format('Do MMMM YYYY');
        break;
      default:
        name = 'Document du ' + d.format('Do MMMM YYYY');
    }

    if (file.details) {
      name = `${name}. ${file.details}`;
    }

    return name;
  }

  handleDelete(ressource) {
    deleteApi(ressource).then(() => {
      this.fetchData();
    });
  }

  render() {
    return (
      <div>
        <Typography variant="display1" gutterBottom>
          Modifier mes informations
        </Typography>
        <Typography style={styles.intro}>Modifiez ici les informations concernant votre compte utilisateur</Typography>
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

        {this.state.documents.length > 0 && (
          <div>
            <Typography variant="headline" style={styles.formControl}>Documents</Typography>
            <ul>
              {this.state.documents.map((d, k) => (
                <li key={k}>
                  <a href={urlApi(`storage/${d.file}`)} target="_blank">{this.displayFile(d)}</a>
                  - <span style={styles.click} onClick={this.handleDelete.bind(this, `documents/${d.id}`)}>Supprimer</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };
}

export default UsersMe;
