import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import axios from 'axios';
import store from '../../store';
import constants from '../../constants';
import { logout } from '../../actions/auth';

const styles = {
  intro: {
    paddingBottom: '50px',
  },
};

class RolesEdit extends Component {
  state = {
    data: [],
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

  render() {
    return (
      <div>
        <Typography variant="display1" gutterBottom>
          Liste des rôles
          <Button variant="contained" color="primary">
            Ajouter
         </Button>
        </Typography>
        <Typography style={styles.intro}>Page listant les différents rôles ({this.state.data.length})</Typography>
      </div>
    );
  };
}

export default RolesEdit;
