import React, { Component } from 'react';
import { login } from '../actions/auth';
import store from '../store';
import axios from 'axios';
import constants from '../constants';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Snackbar from '@material-ui/core/Snackbar';

const styles = {
  root: {
    padding: 50,
  },
  formControl: {
    marginBottom: '20px',
  },
};

class Login extends Component {
  state = {
    open: false,
    email: '',
    password: '',
    showPassword: false,
  };

  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleChange = prop => event => {
    this.setState({
      [prop]: event.target.value
    });
  };

  handleClickShowPassword = () => {
    this.setState(state => ({
      showPassword: !state.showPassword,
    }));
  }

  handleLogin() {
    if (this.state.email === '' || this.state.password === '') {
      return;
    }
    const formData = new FormData();
    formData.append('email', this.state.email);
    formData.append('password', this.state.password);

    axios.post(`${constants.API_ENDPOINT}/auth/login`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(res => {
      if (!res.data.success) {
        this.setState({ open: true });
      } else {
        store.dispatch(login({
          token: res.data.access_token,
          service: res.data.service,
        }));
      }
    })
    .catch(() => {
      this.setState({ open: true });
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.handleLogin();
    }
  }

  render() {
    return (
      <div style={styles.root}>
        <p>Veuillez vous connecter pour accéder aux différentes ressources.</p>
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
        <FormControl fullWidth style={styles.formControl}>
          <InputLabel htmlFor="login-password">Mot de passe</InputLabel>
          <Input
            id="login-password"
            type={this.state.showPassword ? 'text' : 'password'}
            value={this.state.password}
            onChange={this.handleChange('password')}
            onKeyPress={this.handleKeyPress}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="Toggle password visibility"
                  onClick={this.handleClickShowPassword}
                >
                  {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          disabled={this.state.email === '' || this.state.password === ''}
          onClick={this.handleLogin}
        >
          Connexion
        </Button>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={this.state.open}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Mauvais identifiants</span>}
        />
      </div>
    );
  };
}

export default Login;
