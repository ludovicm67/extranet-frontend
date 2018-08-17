import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { getApi, postApi } from '../utils';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from "@material-ui/core/TextField";
import FormControl from '@material-ui/core/FormControl';
import Select from './layout/Select';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import { DatePicker } from 'material-ui-pickers';

import { setErrMsg } from '../actions/general';
import store from '../store';

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
  hidden: {
    display: 'none',
  },
});

class Documents extends Component {
  state = {
    userLine: '',
    id: this.props.match.params.userId,
    user: this.props.match.params.userId,
    type: 'pay',
    date: new Date(),
    file: '',
    details: '',

    users: [],
    types: [
      {
        label: 'Fiche de paie',
        value: 'pay',
      },
      {
        label: 'Compte rendu de visite médicale',
        value: 'medical',
      },
      {
        label: 'Autre',
        value: '',
      },
    ],
  };

  componentDidMount() {
    getApi(`users`).then(res => {
      if (this.isUnmounted) {
        return;
      }
      this.setState({
        users: (res && res.map(e => ({
          label: `${e.firstname} ${e.lastname} (${e.email})`,
          value: e.id,
        }))) || [],
      });
    }).catch(e => {
      store.dispatch(setErrMsg(e));
    });

    if (this.state.user) {
      getApi(`users/${this.state.id}`).then(res => {
        if (this.isUnmounted || !res.email) {
          return;
        }
        this.setState({
          userLine: ` pour ${res.firstname} ${res.lastname} (${res.email})` || '',
        });
      }).catch(e => {
        store.dispatch(setErrMsg(e));
      });
    }
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

  formatDate(date) {
    if (!date || date === '') return '';

    let year = date.getFullYear().toString();
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();

    return year + '-' + (month[1] ? month : '0' + month[0])
      + '-' + (day[1] ? day : '0' + day[0]);
  }

  handleSubmit() {
    postApi(`documents`, {
      user_id: this.state.user || '',
      type: this.state.type || '',
      date: this.formatDate(this.state.date),
      file: this.state.file || '',
      details: this.state.details || '',
    }).then(() => this.props.history.push(`/users/${this.state.user}`)).catch(e => {
      store.dispatch(setErrMsg(e));
    });
  }

  handleDateChange = (prop, date) => {
    this.setState({ [prop]: date });
  }

  handleFileChange(e) {
    this.setState({ file: e.target.files[0] })
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Typography variant="display1" gutterBottom>
          Dépôt de document
        </Typography>
        <Typography className={classes.intro}>Dépôt de document {this.state.userLine}. Choisissez un type, une date, envoyez un fichier, et validez ! Il est possible de laisser une précision sur le document; peut être pratique dans le cas documents catégorisées comme «Autre». Pour les fiches de paie, il suffit de choisir un jour du mois en question, et elle sera marquée comme «Fiche de paie du 'mois' 'année'» sur l'utilisateur.</Typography>
        <TextField
          className={classes.formControl}
          fullWidth
          disabled={!!this.state.id}
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
              clearable: false,
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
          className={classes.formControl}
          fullWidth
          value={this.state.type}
          onChange={this.handleChange('type')}
          placeholder="Choisissez le type de document..."
          name="select-type"
          label="Type de document"
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
              instanceId: "select-type",
              id: "select-type",
              simpleValue: true,
              options: this.state.types,
            }
          }}
        />

        <FormControl fullWidth className={classes.formControl}>
          <DatePicker
            keyboard
            label="Date associé au document"
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
            value={this.state.date}
            onChange={this.handleDateChange.bind(this, 'date')}
            disableOpenOnEnter
            animateYearScrolling={false}
          />
        </FormControl>

        <FormControl fullWidth className={classes.formControl}>
          <InputLabel htmlFor="form-file">Document</InputLabel>
          <Input
            id="form-file"
            type="text"
            disabled
            endAdornment={<InputAdornment position="end">
              <input
                id="raised-button-file"
                type="file"
                className={classes.hidden}
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

        <FormControl fullWidth className={classes.formControl}>
          <InputLabel htmlFor="form-details">Informations sur le type de document (si «Autre»)</InputLabel>
          <Input
            id="form-details"
            value={this.state.details}
            onChange={this.handleChange('details')}
            autoComplete="new-password"
          />
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={this.handleSubmit.bind(this)}
        >
          Déposer
        </Button>
      </div>
    );
  }
}

Documents.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Documents);
