import React, { Component } from 'react';
import axios from 'axios';
import constants from '../constants';
import store from '../store';

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
    message: 'aaa',
    email: '',
    token: '',
    password: '',
  };

  handleBadReactBeahavior() {
    const hasToken = store.getState().auth.auth.token !== null;
    const userData = store.getState().auth.auth.userData;
    if (hasToken && userData.id > 0) {
      const redirPage =
        !userData.default_page || userData.default_page.startsWith('/login')
          || userData.default_page.startsWith('/password/reset')
          ? '/' : userData.default_page;

      window.location.href = redirPage;
    }
  }

  constructor(props) {
    super(props);

    // a bit wtf, but handle react bad stuff and client bad network connection
    window.setTimeout(this.handleBadReactBeahavior, 200);
    window.setTimeout(this.handleBadReactBeahavior, 1000);
    window.setTimeout(this.handleBadReactBeahavior, 2000);
    window.setTimeout(this.handleBadReactBeahavior, 3000);
    window.setTimeout(this.handleBadReactBeahavior, 5000);
    window.setTimeout(this.handleBadReactBeahavior, 7500);
    window.setTimeout(this.handleBadReactBeahavior, 10000);
    window.setTimeout(this.handleBadReactBeahavior, 20000);
    window.setTimeout(this.handleBadReactBeahavior, 30000);

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
    formData.append('token', this.state.token);
    formData.append('password', this.state.password);

    axios.post(`${constants.API_ENDPOINT}/password/reset`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .catch(e => e.response || e)
    .then((res) => {
      res = res.data;
      if (res.success) {
        this.setState({ open: true, message: res.message });
      } else {
        this.setState({ open: true, message: res.errors[0] });
      }
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
        <Typography>
          Pour définr un nouveau mot de passe, vous devez procéder de la manière suivante :
        </Typography>
        <Typography>1. Remplir le champ «Adresse mail» et envoyer le formulaire</Typography>
        <Typography>2. Un email avec un token sera envoyé (valable 1 heure)</Typography>
        <Typography>3. Complétez le champ «token» avec celui reçu par mail et définissez un nouveau mot de passe, puis validez.</Typography>
        <Typography>4. Vous pourrez ensuite aller vous connecter avec votre nouveau mot de passe.</Typography>
        <FormControl fullWidth style={styles.formControl}>
          <InputLabel htmlFor="login-email">Adresse mail</InputLabel>
          <Input
            id="login-email"
            type="email"
            value={this.state.email}
            onChange={this.handleChange('email')}
            onKeyPress={this.handleKeyPress}
            autoComplete="new-password"
          />
        </FormControl>
        <FormControl fullWidth style={styles.formControl}>
          <InputLabel htmlFor="login-token">Token</InputLabel>
          <Input
            id="login-token"
            type="text"
            value={this.state.token}
            onChange={this.handleChange('token')}
            onKeyPress={this.handleKeyPress}
            autoComplete="new-password"
          />
        </FormControl>
        <FormControl fullWidth style={styles.formControl}>
          <InputLabel htmlFor="login-password">Nouveau mot de passe</InputLabel>
          <Input
            id="login-password"
            type="password"
            value={this.state.password}
            onChange={this.handleChange('password')}
            onKeyPress={this.handleKeyPress}
            autoComplete="new-password"
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
          message={<span id="message-id">{this.state.message}</span>}
        />
      </div>
    );
  };
}

export default PasswordReset;
