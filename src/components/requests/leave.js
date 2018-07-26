import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Select from '../layout/Select';
import InputAdornment from '@material-ui/core/InputAdornment';
import { DatePicker } from 'material-ui-pickers';

import { postApi } from '../../utils';

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
  hidden: {
    display: 'none',
  },
};

const reasons = [
  'Congé',
  'Maladie (pensez à joindre un justificatif)',
  'Autre (précisez en commentaire)',
];

const starts = [9, 14];
const ends = [18, 12];

const today = new Date();
const todayInfos = {
  year: today.getFullYear(),
  month: 1 + today.getMonth(),
};

class Leave extends Component {
  state = {
    start: new Date(),
    end: new Date(),
    start_time: 9,
    end_time: 18,
    year: todayInfos.year,
    month: todayInfos.month,
    reason: 'Congé',
    details: '',
    file: '',

    reasons: reasons.map(e => ({
      label: e,
      value: e,
    })),
    starts: starts.map(e => ({
      label: `${e} h`,
      value: e,
    })),
    ends: ends.map(e => ({
      label: `${e} h`,
      value: e,
    })),
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
    postApi('leave', {
      name: this.state.name,
    }).then(() => this.props.history.push('/requests'));
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

  handleFileChange(e) {
    this.setState({ file: e.target.files[0] })
  }

  handleDateChange = (prop, date) => {
    this.setState({ [prop]: date });
  }

  render() {
    return (
      <div>
        <Typography variant="display1" gutterBottom>
          Nouvelle demande de congés
        </Typography>
        <Typography style={styles.intro}>Demandez une nouvelle période de congés</Typography>


        <FormControl fullWidth style={styles.formControl}>
          <DatePicker
            keyboard
            label="Début"
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
            value={this.state.start}
            onChange={this.handleDateChange.bind(this, 'start')}
            disableOpenOnEnter
            animateYearScrolling={false}
          />
        </FormControl>

        <TextField
          style={styles.formControl}
          fullWidth
          value={this.state.start_time}
          onChange={this.handleChange('start_time')}
          placeholder="Choisissez une heure de début..."
          name="select-start"
          label="Heure début"
          autoComplete="new-password"
          InputLabelProps={{
            shrink: true
          }}
          InputProps={{
            inputComponent: Select,
            inputProps: {
              creatable: false,
              clearable: false,
              multi: false,
              instanceId: "select-start",
              id: "select-start",
              simpleValue: true,
              options: this.state.starts,
            }
          }}
        />

        <FormControl fullWidth style={styles.formControl}>
          <DatePicker
            keyboard
            label="Date de fin"
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
            value={this.state.end}
            onChange={this.handleDateChange.bind(this, 'end')}
            disableOpenOnEnter
            animateYearScrolling={false}
          />
        </FormControl>

        <TextField
          style={styles.formControl}
          fullWidth
          value={this.state.end_time}
          onChange={this.handleChange('end_time')}
          placeholder="Choisissez une heure de fin..."
          name="select-end"
          label="Heure fin"
          autoComplete="new-password"
          InputLabelProps={{
            shrink: true
          }}
          InputProps={{
            inputComponent: Select,
            inputProps: {
              clearable: false,
              creatable: false,
              multi: false,
              instanceId: "select-end",
              id: "select-end",
              simpleValue: true,
              options: this.state.ends,
            }
          }}
        />
        <TextField
          style={styles.formControl}
          fullWidth
          value={this.state.reason}
          onChange={this.handleChange('reason')}
          placeholder="Choisissez un motif..."
          name="select-reason"
          label="Motif du congé"
          autoComplete="new-password"
          InputLabelProps={{
            shrink: true
          }}
          InputProps={{
            inputComponent: Select,
            inputProps: {
              creatable: false,
              clearable: false,
              multi: false,
              instanceId: "select-reason",
              id: "select-reason",
              simpleValue: true,
              options: this.state.reasons,
            }
          }}
        />
        <FormControl fullWidth style={styles.formControl}>
          <InputLabel htmlFor="form-file">Jutificatif (si maladie)</InputLabel>
          <Input
            id="form-file"
            type="text"
            disabled
            endAdornment={<InputAdornment position="end">
              <input
                id="raised-button-file"
                type="file"
                style={styles.hidden}
                onChange={this.handleFileChange.bind(this)}
              />
              <label htmlFor="raised-button-file">
                <Button component="span">
                  Parcourir...
                </Button>
              </label>
            </InputAdornment>}
            value={(this.state.file && this.state.file.name) || ''}
          />
        </FormControl>
        <FormControl fullWidth style={styles.formControl}>
          <InputLabel htmlFor="form-details">Commentaire</InputLabel>
          <Input
            id="form-details"
            multiline
            rowsMax="10"
            value={this.state.details}
            onChange={this.handleChange('details')}
          />
        </FormControl>
        <Button variant="contained" color="primary" style={styles.submit} onClick={this.handleSubmit.bind(this)}>
          Soumettre
        </Button>
      </div>
    );
  };
}

export default Leave;
