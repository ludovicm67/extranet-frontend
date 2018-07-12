import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import axios from 'axios';
import store from '../../store';
import constants from '../../constants';
import { logout } from '../../actions/auth';

const styles = {
  intro: {
    paddingBottom: '50px',
  },
  submit: {
    marginTop: '42px',
  },
};

class RolesNew extends Component {
  state = {
    name: '',
  };

  handleSubmit() {
    axios.get(`
      ${constants.API_ENDPOINT}/roles?token=${store.getState().auth.auth.token}
    `).then((res) => {
        if (res.data.success) {
          this.setState({ data: res.data.data });
        }
      }).catch(() => store.dispatch(logout()));
  }

  handleChange = prop => event => {
    this.setState({
      [prop]: event.target.value
    });
  };

  render() {
    return (
      <div>
        <Typography variant="display1" gutterBottom>
          Créer un nouveau rôle
        </Typography>
        <Typography style={styles.intro}>Entrez ici les informations concernant le rôle</Typography>
        <FormControl fullWidth style={styles.formControl}>
          <InputLabel htmlFor="role-name">Nom du rôle</InputLabel>
          <Input
            id="role-name"
            type="text"
            value={this.state.name}
            onChange={this.handleChange('name')}
          />
        </FormControl>
        <Button variant="contained" color="primary" style={styles.submit}>
          Créer
        </Button>
      </div>
    );
  };
}

export default RolesNew;
