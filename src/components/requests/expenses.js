import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Select from '../layout/Select';
import InputAdornment from '@material-ui/core/InputAdornment';

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
};

const months = [
  { label: 'Janvier', value: 1},
  { label: 'Février', value: 2},
  { label: 'Mars', value: 3},
  { label: 'Avril', value: 4},
  { label: 'Mai', value: 5},
  { label: 'Juin', value: 6},
  { label: 'Juillet', value: 7},
  { label: 'Août', value: 8},
  { label: 'Septembre', value: 9},
  { label: 'Octobre', value: 10},
  { label: 'Novembre', value: 11},
  { label: 'Décembre', value: 12},
];

const types = [
  'Transports', 'Dépense'
];

const today = new Date();
const todayInfos = {
  year: today.getFullYear(),
  month: 1 + today.getMonth(),
};

class Expenses extends Component {
  state = {
    year: todayInfos.year,
    month: todayInfos.month,
    type: 'Transports',
    amount: 0,

    types: types.map(e => ({
      label: e,
      value: e,
    })),
  };

  handleSubmit() {
    postApi('expenses', {
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

  render() {
    return (
      <div>
        <Typography variant="display1" gutterBottom>
          Nouvelle note de frais
        </Typography>
        <Typography style={styles.intro}>Transmettre une note de frais</Typography>
        <FormControl fullWidth style={styles.formControl}>
          <InputLabel htmlFor="form-year">Année</InputLabel>
          <Input
            id="form-year"
            type="number"
            value={this.state.year}
            onChange={this.handleChange('year')}
          />
        </FormControl>
        <TextField
          style={styles.formControl}
          fullWidth
          value={this.state.month}
          onChange={this.handleChange('month')}
          placeholder="Choisissez un mois..."
          name="select-month"
          label="Mois"
          autoComplete="new-password"
          InputLabelProps={{
            shrink: true
          }}
          InputProps={{
            inputComponent: Select,
            inputProps: {
              creatable: false,
              multi: false,
              instanceId: "select-month",
              id: "select-month",
              simpleValue: true,
              options: months,
            }
          }}
        />
        <TextField
          style={styles.formControl}
          fullWidth
          value={this.state.type}
          onChange={this.handleChange('type')}
          placeholder="Choisissez un type..."
          name="select-type"
          label="Type de dépense"
          autoComplete="new-password"
          InputLabelProps={{
            shrink: true
          }}
          InputProps={{
            inputComponent: Select,
            inputProps: {
              creatable: false,
              multi: false,
              instanceId: "select-type",
              id: "select-type",
              simpleValue: true,
              options: this.state.types,
            }
          }}
        />
        <FormControl fullWidth style={styles.formControl}>
          <InputLabel htmlFor="form-amount">Montant</InputLabel>
          <Input
            id="form-amount"
            type="number"
            inputProps={{ min: 0, step: 0.01 }}
            endAdornment={<InputAdornment position="end">€</InputAdornment>}
            value={this.state.amount}
            onChange={this.handleChange('amount')}
          />
        </FormControl>
        <Button variant="contained" color="primary" style={styles.submit} onClick={this.handleSubmit.bind(this)}>
          Créer
        </Button>
      </div>
    );
  };
}

export default Expenses;
