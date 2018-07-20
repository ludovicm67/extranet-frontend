import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '../layout/Select';
import { DatePicker } from 'material-ui-pickers';

import { getApi, postApi } from '../../utils';

const styles = {
  intro: {
    paddingBottom: 20,
  },
  submit: {
    marginTop: '42px',
  },
  formControl: {
    marginTop: 20,
  },
};

class ProjectsNew extends Component {
  state = {
    clients: [],
    contacts: [],
    orders: [],
    users: [],
    name: '',
    domain: '',
    client: null,
    contact: null,
    order: null,
    user: null,
    next_action: '',
    end_at: null,
  };

  handleSubmit() {
    postApi('projects', {
      name: this.state.name,
      domain: this.state.domain,
      client: this.state.client || '',
      contact: this.state.contact || '',
      order: this.state.order || '',
      user: [1, 2, 3],//this.state.user || '',
      next_action: this.state.next_action,
      end_at: this.formatDate(this.state.end_at),
    }).then(() => this.props.history.push('/projects'));
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

  handleDateChange = (date) => {
    this.setState({ end_at: date });
  }

  componentDidMount() {
    getApi('clients').then(res => {
      if (this.isUnmounted) {
        return;
      }
      const clients = [];
      clients.push(...res.map(e => {
        return {
          label: e.name,
          value: e.id,
        };
      }));
      this.setState({
        clients,
      });
    });
    getApi('sellsy_contacts').then(res => {
      if (this.isUnmounted) {
        return;
      }
      const contacts = [];
      contacts.push(...res.map(e => {
        return {
          label: e.fullName,
          value: e.id,
        };
      }));
      this.setState({
        contacts,
      });
    });
    getApi('sellsy_orders').then(res => {
      if (this.isUnmounted) {
        return;
      }
      const orders = [];
      orders.push(...res.map(e => {
        return {
          label: `${e.thirdname} :: ${e.subject.replace(/<[^>]+>/g, ' ')}`,
          value: e.id,
        };
      }));
      this.setState({
        orders,
      });
    });
    getApi('users').then(res => {
      if (this.isUnmounted) {
        return;
      }
      const users = [];
      users.push(...res.map(e => {
        return {
          label: `${e.firstname} ${e.lastname} (${e.email})`,
          value: e.id,
        };
      }));
      this.setState({
        users,
      });
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  formatDate(date) {
    if (!date) return '';

    let year = date.getFullYear().toString();
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();

    return year + '-' + (month[1] ? month : '0' + month[0])
           + '-' + (day[1] ? day : '0' + day[0]);
  }

  render() {
    return (
      <div>
        <Typography variant="display1" gutterBottom>
          Créer un nouveau projet
        </Typography>
        <Typography style={styles.intro}>Entrez ici les informations concernant le projet</Typography>
        <FormControl fullWidth style={styles.formControl}>
          <InputLabel htmlFor="project-name">Nom du projet</InputLabel>
          <Input
            id="project-name"
            type="text"
            value={this.state.name}
            onChange={this.handleChange('name')}
          />
        </FormControl>
        <FormControl fullWidth style={styles.formControl}>
          <InputLabel htmlFor="project-domain">Domaine principal</InputLabel>
          <Input
            id="project-domain"
            type="text"
            value={this.state.domain}
            onChange={this.handleChange('domain')}
          />
        </FormControl>

        <TextField
          style={styles.formControl}
          fullWidth
          value={this.state.client}
          onChange={this.handleChange('client')}
          placeholder="Choisissez un client..."
          name="select-client"
          label="Client principal"
          autoComplete="new-password"
          InputLabelProps={{
            shrink: true
          }}
          InputProps={{
            inputComponent: Select,
            inputProps: {
              creatable: false,
              multi: false,
              instanceId: "select-client",
              id: "select-client",
              simpleValue: true,
              options: this.state.clients,
            }
          }}
        />
        <TextField
          style={styles.formControl}
          fullWidth
          value={this.state.contact}
          onChange={this.handleChange('contact')}
          placeholder="Choisissez un ou plusieurs interlocuteurs..."
          name="select-contact"
          label="Interlocuteurs"
          autoComplete="new-password"
          InputLabelProps={{
            shrink: true
          }}
          InputProps={{
            inputComponent: Select,
            inputProps: {
              creatable: false,
              multi: true,
              instanceId: "select-contact",
              id: "select-contact",
              simpleValue: true,
              options: this.state.contacts,
            }
          }}
        />
        <TextField
          style={styles.formControl}
          fullWidth
          value={this.state.order}
          onChange={this.handleChange('order')}
          placeholder="Choisissez une ou plusieurs commandes..."
          name="select-order"
          label="Commandes"
          autoComplete="new-password"
          InputLabelProps={{
            shrink: true
          }}
          InputProps={{
            inputComponent: Select,
            inputProps: {
              creatable: false,
              multi: true,
              instanceId: "select-order",
              id: "select-order",
              simpleValue: true,
              options: this.state.orders,
            }
          }}
        />
        <TextField
          style={styles.formControl}
          fullWidth
          value={this.state.user}
          onChange={this.handleChange('user')}
          placeholder="Choisissez un ou plusieurs utilisateurs..."
          name="select-user"
          label="Utilisateurs affectés"
          autoComplete="new-password"
          InputLabelProps={{
            shrink: true
          }}
          InputProps={{
            inputComponent: Select,
            inputProps: {
              creatable: false,
              multi: true,
              instanceId: "select-user",
              id: "select-user",
              simpleValue: true,
              options: this.state.users,
            }
          }}
        />

        <FormControl fullWidth style={styles.formControl}>
          <TextField
            id="project-next_action"
            label="Prochaine action à effectuer"
            multiline
            rowsMax="10"
            value={this.state.next_action}
            onChange={this.handleChange('next_action')}
            margin="normal"
          />
        </FormControl>
        <FormControl fullWidth style={styles.formControl}>
          <DatePicker
            keyboard
            label="Fin du projet souhaité"
            cancelLabel="Annuler"
            invalidDateMessage="Format de date invalide"
            invalidLabel="Inconnu"
            maxDateMessage="La date dépasse la date maximale"
            minDateMessage="La date ne doit pas être avant la date minimale"
            todayLabel="Aujourd'hui"
            showTodayButton={true}
            format="DD/MM/YYYY"
            placeholder="jj/mm/aaaa"
            mask={value => (value ? [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/] : [])}
            value={this.state.end_at}
            onChange={this.handleDateChange}
            disableOpenOnEnter
            animateYearScrolling={false}
          />
        </FormControl>

        <Button variant="contained" color="primary" style={styles.submit} onClick={this.handleSubmit.bind(this)}>
          Créer
        </Button>
      </div>
    );
  };
}

export default ProjectsNew;
