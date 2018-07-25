import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Select from '../layout/Select';
import { DatePicker } from 'material-ui-pickers';

import { getApi, putApi } from '../../utils';

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

const contractTypes = [
  'CDI', 'CDD', 'Stage', 'Apprentissage', 'Contrat pro'
];

class ContractsEdit extends Component {
  state = {
    id: this.props.match.params.contractId,
    users: [],
    types: contractTypes.map(e => ({
      label: e,
      value: e,
    })),
    user: null,
    type: 'CDI',
    start_at: new Date(),
    end_at: null,
  };

  formatDate(date) {
    if (!date || date === '') return '';

    let year = date.getFullYear().toString();
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();

    return year + '-' + (month[1] ? month : '0' + month[0])
      + '-' + (day[1] ? day : '0' + day[0]);
  }

  handleSubmit() {
    putApi(`contracts/${this.state.id}`, {
      user_id: this.state.user,
      type: this.state.type,
      start_at: this.formatDate(this.state.start_at),
      end_at: this.formatDate(this.state.end_at),
    }).then(() => this.props.history.push('/contracts'));
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

  handleDateChange = (prop, date) => {
    this.setState({ [prop]: date });
  }

  componentDidMount() {
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
    getApi(`contracts/${this.state.id}`).then(res => {
      if (this.isUnmounted) {
        return;
      }
      const startAt = res.start_at && new Date(Date.parse(res.start_at));
      const endAt = res.end_at && new Date(Date.parse(res.end_at));
      const types = this.state.types;
      if (!contractTypes.includes(res.type)) {
        types.push({
          label: res.type,
          value: res.type,
        });
      }

      this.setState({
        user: res.user_id,
        type: res.type,
        types,
        start_at: startAt || null,
        end_at: endAt || null,
      });
    });
  }

  render() {
    return (
      <div>
        <Typography variant="display1" gutterBottom>
          Modifier un contrat
        </Typography>
        <Typography style={styles.intro}>Entrez ici les informations concernant le contrat</Typography>
        <TextField
          style={styles.formControl}
          fullWidth
          value={this.state.user}
          onChange={this.handleChange('user')}
          placeholder="Choisissez un utilisateur..."
          name="select-user"
          label="Utilisateur"
          autoComplete="new-password"
          InputLabelProps={{
            shrink: true
          }}
          InputProps={{
            inputComponent: Select,
            inputProps: {
              creatable: false,
              multi: false,
              instanceId: "select-user",
              id: "select-user",
              simpleValue: true,
              options: this.state.users,
            }
          }}
        />
        <TextField
          style={styles.formControl}
          fullWidth
          value={this.state.type}
          onChange={this.handleChange('type')}
          placeholder="Choisissez un type.."
          name="select-type"
          label="Type de contrat"
          autoComplete="new-password"
          InputLabelProps={{
            shrink: true
          }}
          InputProps={{
            inputComponent: Select,
            inputProps: {
              creatable: true,
              multi: false,
              instanceId: "select-type",
              id: "select-type",
              simpleValue: true,
              options: this.state.types,
            }
          }}
        />

        <FormControl fullWidth style={styles.formControl}>
          <DatePicker
            keyboard
            label="Début du contrat"
            cancelLabel="Annuler"
            invalidDateMessage="Format de date invalide"
            invalidLabel="Inconnu"
            clearLabel="Vider"
            maxDateMessage="La date dépasse la date maximale"
            minDateMessage="La date ne doit pas être avant la date minimale"
            todayLabel="Aujourd'hui"
            showTodayButton={true}
            format="DD/MM/YYYY"
            placeholder="jj/mm/aaaa"
            mask={value => (value ? [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/] : [])}
            value={this.state.start_at}
            onChange={this.handleDateChange.bind(this, 'start_at')}
            disableOpenOnEnter
            animateYearScrolling={false}
          />
        </FormControl>

        <FormControl fullWidth style={styles.formControl}>
          <DatePicker
            keyboard
            clearable={true}
            label="Fin du contrat (optionnel)"
            cancelLabel="Annuler"
            invalidDateMessage="Format de date invalide"
            invalidLabel="Inconnu"
            clearLabel="Vider"
            maxDateMessage="La date dépasse la date maximale"
            minDateMessage="La date ne doit pas être avant la date minimale"
            todayLabel="Aujourd'hui"
            showTodayButton={true}
            format="DD/MM/YYYY"
            placeholder="jj/mm/aaaa"
            mask={value => (value ? [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/] : [])}
            value={this.state.end_at}
            onChange={this.handleDateChange.bind(this, 'end_at')}
            disableOpenOnEnter
            animateYearScrolling={false}
          />
        </FormControl>

        <Button variant="contained" color="primary" style={styles.submit} onClick={this.handleSubmit.bind(this)}>
          Modifier
        </Button>
      </div>
    );
  };
}

export default ContractsEdit;
