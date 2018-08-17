import React, { Component } from 'react';
import moment from 'moment';
import 'moment/locale/fr';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { getApi, putApi } from '../utils';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from "@material-ui/core/TextField";
import FormControl from '@material-ui/core/FormControl';
import Select from './layout/Select';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';

import { setErrMsg } from '../actions/general';
import store from '../store';

moment.locale('fr');

const styles = theme => ({
  intro: {
    paddingBottom: '20px',
  },
  submit: {
    marginTop: '42px',
  },
  formControl: {
    marginTop: '20px',
  },
});

const today = new Date();
const todayInfos = {
  year: today.getFullYear(),
  month: 1 + today.getMonth(),
};

class Overtime extends Component {
  state = {
    id: this.props.match.params.userId,
    month: todayInfos.month,
    year: todayInfos.year,

    details: '',
    volume: 0,

    user: '',

    submitting: false,

    months: moment.months().map((v, k) => ({
      label: v,
      value: 1 + k,
    })),
  };

  fetchPeriodData() {
    getApi(`overtime/${this.state.id}?year=${this.state.year}&month=${this.state.month}`)
    .then(res => {
      if (this.isUnmounted) {
        return;
      }

      this.setState({
        details: res.details || '',
        volume: res.volume || 0,
      });

      window.setTimeout(() => {
        this.busy = false;
      }, 300);
    }).catch(e => {
      store.dispatch(setErrMsg(e));
    });
  }

  componentDidMount() {
    this.fetchPeriodData();
    getApi(`users/${this.state.id}`).then(res => {
      if (this.isUnmounted) {
        return;
      }
      this.setState({
        user: ` pour ${res.firstname} ${res.lastname} (${res.email})` || '',
      });
    }).catch(e => {
      store.dispatch(setErrMsg(e));
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
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

  handlePeriodChange = prop => event => {
    this.handleChange(prop)(event);
    if (!this.busy) {
      this.busy = true;
      window.setTimeout(() => {
        this.fetchPeriodData();
      }, 200);
    } else {
      window.setTimeout(() => {
        if (!this.busy) {
          this.busy = true;
          this.fetchPeriodData();
        }
      }, 1000);
    }
  }

  handleSubmit() {
    this.setState({
      submitting: true,
    });
    putApi(`overtime/${this.state.id}?year=${this.state.year}&month=${this.state.month}`, {
      volume: this.state.volume || 0,
      details: this.state.details || '',
    }).then(() => {
      window.setTimeout(() => {
        this.setState({
          submitting: false,
        });
      }, 1000);
    }).catch(e => {
      store.dispatch(setErrMsg(e));
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Typography variant="display1" gutterBottom>
          Ajout/modification d'une heure supplémentaire
        </Typography>
        <Typography className={classes.intro}>Choisissez la période souhaitée, et éditez le volume horaire{this.state.user} puis validez. Il est également possible de rajouter des précisions dans le champ prévu à cet effet.</Typography>
        <TextField
          className={classes.formControl}
          fullWidth
          value={this.state.month}
          onChange={this.handlePeriodChange('month')}
          placeholder="Choisissez le mois..."
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
              options: this.state.months,
            }
          }}
        />
        <FormControl fullWidth className={classes.formControl}>
          <InputLabel htmlFor="overtime-year">Année</InputLabel>
          <Input
            id="overtime-year"
            type="number"
            inputProps={{
              min: 1900,
            }}
            value={this.state.year}
            onChange={this.handlePeriodChange('year')}
            autoComplete="new-password"
          />
        </FormControl>

        <FormControl fullWidth className={classes.formControl}>
          <InputLabel htmlFor="overtime-volume">Volume</InputLabel>
          <Input
            id="overtime-volume"
            type="number"
            inputProps={{
              min: 0,
            }}
            endAdornment={<InputAdornment position="end">heures</InputAdornment>}
            value={this.state.volume}
            onChange={this.handleChange('volume')}
            autoComplete="new-password"
          />
        </FormControl>

        <FormControl fullWidth className={classes.formControl}>
          <TextField
            id="overtime-details"
            label="Précisions, ..."
            multiline
            rowsMax="10"
            value={this.state.details}
            onChange={this.handleChange('details')}
            margin="normal"
          />
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          disabled={this.state.submitting}
          className={classes.submit}
          onClick={this.handleSubmit.bind(this)}
        >
          Sauvegarder
        </Button>
      </div>
    );
  }
}

Overtime.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Overtime);
