import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from "@material-ui/core/TextField";
import FormControl from '@material-ui/core/FormControl';
import Select from '../layout/Select';

import { getApi, putApi } from '../../utils';
import { FormControlLabel } from '@material-ui/core';

import { setErrMsg } from '../../actions/general';
import store from '../../store';

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

class EditIdentifier extends Component {
  state = {
    id: this.props.match.params.identifierId,

    identifiers: [],
    identifierId: '',
    value: '',
    confidential: false,

    projectId: 0,
  };

  componentDidMount() {
    getApi('identifiers').then(res => {
      if (this.isUnmounted) {
        return;
      }
      const identifiers = [
        {
          label: 'Autre ?',
          value: 0,
        }
      ];
      identifiers.push(...res.map(e => {
        return {
          label: e.name,
          value: e.id,
        };
      }));
      this.setState({
        identifiers,
      });
    }).catch(e => {
      store.dispatch(setErrMsg(e));
    });
    getApi(`project_identifier/${this.state.id}`).then(res => {
      if (this.isUnmounted) {
        return;
      }
      this.setState({
        identifierId: res.identifier_id || '',
        value: res.value || '',
        confidential: res.confidential === 1 ? true : false,
        projectId: res.project_id || 0,
      });
    }).catch(e => {
      store.dispatch(setErrMsg(e));
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  handleSubmit() {
    putApi(`project_identifier/${this.state.id}`, {
      identifier_id: this.state.identifierId || 0,
      value: this.state.value,
      confidential: this.state.confidential ? 1 : 0,
    }).then(() => this.props.history.push(`/projects/${this.state.projectId}/identifiers`)).catch(e => {
      store.dispatch(setErrMsg(e));
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

  handleCheckChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };


  render() {
    return (
      <div>
        <Typography variant="display1" gutterBottom>
          Modification d'un identifiant
        </Typography>
        <Typography style={styles.intro}>Renseignez les différents champs pour modifier cet identifiant de projet</Typography>
        <TextField
          style={styles.formControl}
          fullWidth
          value={this.state.identifierId}
          onChange={this.handleChange('identifierId')}
          placeholder="Choisissez le type d'identifiant..."
          name="select-identifier"
          label="Type d'identifiant"
          autoComplete="new-password"
          InputLabelProps={{
            shrink: true
          }}
          InputProps={{
            inputComponent: Select,
            inputProps: {
              creatable: true,
              multi: false,
              instanceId: "select-identifier",
              id: "select-identifier",
              simpleValue: true,
              options: this.state.identifiers,
            }
          }}
        />

        <FormControl fullWidth style={styles.formControl}>
          <TextField
            id="contact-value"
            label="Valeur"
            multiline
            rowsMax="10"
            value={this.state.value}
            onChange={this.handleChange('value')}
            margin="normal"
          />
        </FormControl>

        <FormControl fullWidth style={styles.formControl}>
          <FormControlLabel
            control={<Checkbox
              checked={this.state.confidential}
              onChange={this.handleCheckChange('confidential')}
              value="1"
              color="primary"
            />}
            label="Marquer cet identifiant comme confidentiel ?" />
        </FormControl>

        <Button variant="contained" color="primary" style={styles.submit} onClick={this.handleSubmit.bind(this)}>
          Modifier
        </Button>
      </div>
    );
  };
}

export default EditIdentifier;
