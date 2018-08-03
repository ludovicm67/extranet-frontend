import React, { Component } from 'react';
import moment from 'moment';
import 'moment/locale/fr';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { urlApi } from '../utils';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from "@material-ui/core/TextField";
import FormControl from '@material-ui/core/FormControl';
import Select from './layout/Select';
import Button from '@material-ui/core/Button';
import store from '../store';

moment.locale('fr');

const styles = _theme => ({
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

class PdfCompta extends Component {
  state = {
    id: this.props.match.params.userId,
    month: todayInfos.month,
    year: todayInfos.year,

    months: moment.months().map((v, k) => ({
      label: v,
      value: 1 + k,
    })),
  };

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

  handleSubmit() {
    const token = store.getState().auth.auth.token;
    const period = `year=${this.state.year}&month=${this.state.month}`;
    window.open(`${urlApi('pdf/compta')}?${period}&token=${token}`, '_blank');
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Typography variant="display1" gutterBottom>
          Consulter un PDF comptable
        </Typography>
        <Typography className={classes.intro}>Choisissez la période souhaitée.</Typography>
        <TextField
          className={classes.formControl}
          fullWidth
          value={this.state.month}
          onChange={this.handleChange('month')}
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
            onChange={this.handleChange('year')}
            autoComplete="new-password"
          />
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={this.handleSubmit.bind(this)}
        >
          Consulter
        </Button>
      </div>
    );
  }
}

PdfCompta.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(PdfCompta);
