import React, { Component } from 'react';
import axios from 'axios';
import constants from '../constants';

import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';

import { Link } from 'react-router-dom';

const styles = {
  root: {
    padding: 50,
    textAlign: 'center',
  },
  formControl: {
    marginBottom: '20px',
  },
  btn: {
    marginRight: 10,
  },
};

class PasswordReset extends Component {
  state = {
    open: false,
    email: '',
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleChange = prop => event => {
    this.setState({
      [prop]: event.target.value
    });
  };

  handleSubmit() {
    if (this.state.email === '') {
      return;
    }
    const formData = new FormData();
    formData.append('email', this.state.email);

    axios.post(`${constants.API_ENDPOINT}/password/reset`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .finally(() => {
      this.setState({ open: true });
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.handleSubmit();
    }
  }

  render() {
    return (
      <div style={styles.root}>
        <Typography>Entrez votre adresse mail ci-dessous. Un mail vous permettant de définir un nouveau mot de passe vous sera envoyé.</Typography>
        <FormControl fullWidth style={styles.formControl}>
          <InputLabel htmlFor="login-password">Adresse mail</InputLabel>
          <Input
            id="login-email"
            type="email"
            value={this.state.email}
            onChange={this.handleChange('email')}
            onKeyPress={this.handleKeyPress}
          />
        </FormControl>
        <Link to="/login" style={styles.btn}>Me connecter</Link>
        <Button
          variant="contained"
          color="primary"
          disabled={this.state.email === ''}
          onClick={this.handleSubmit}
        >
          Envoyer
        </Button>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={this.state.open}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Un mail vous a été envoyé avec un lien pour définir un nouveau mot de passe pour votre compte, dans le cas où votre adresse mail est bien dans notre base.</span>}
        />
      </div>
    );
  };
}

export default PasswordReset;
