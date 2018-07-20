import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { DatePicker } from 'material-ui-pickers';

import { getApi, postApi } from '../../utils';

const styles = {
  intro: {
    paddingBottom: '50px',
  },
  submit: {
    marginTop: '42px',
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
    next_action: '',
    end_at: null,
  };

  handleSubmit() {
    postApi('projects', {
      name: this.state.name,
      domain: this.state.domain,
      next_action: this.state.next_action,
      end_at: this.formatDate(this.state.end_at),
    }).then(() => this.props.history.push('/projects'));
  }

  handleChange = prop => event => {
    this.setState({
      [prop]: event.target.value,
    });
  };

  handleDateChange = (date) => {
    this.setState({ end_at: date });
  }

  componentDidMount() {
    getApi('clients').then(res => {
      if (this.isUnmounted) {
        return;
      }
      const clients = [
        {
          label: 'Aucun client',
          value: 0,
        }
      ];
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
          label: e.subject.replace(/<[^>]+>/g, ' '),
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
        <p>Un client parmi : {JSON.stringify(this.state.clients)}</p>
        <p>n interlocuteurs parmi : {JSON.stringify(this.state.contacts)}</p>
        <p>n commandes parmi : {JSON.stringify(this.state.orders)}</p>
        <p>n utilisateurs affectés parmi : {JSON.stringify(this.state.users)}</p>
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
        <p>Prochainement : les tags !</p>
        <p>Prochainement : les urls !</p>
        <p>Prochainement, sur une page à part : les identifiants !</p>
        <Button variant="contained" color="primary" style={styles.submit} onClick={this.handleSubmit.bind(this)}>
          Créer
        </Button>
      </div>
    );
  };
}

export default ProjectsNew;
