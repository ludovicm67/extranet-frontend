import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Icon from '@material-ui/core/Icon';

import axios from 'axios';
import store from '../../store';
import constants from '../../constants';
import { logout } from '../../actions/auth';

const styles = {
  intro: {
    paddingBottom: '50px',
  },
};

class Users extends Component {
  state = {
    data: [],
  };

  componentDidMount() {
    axios.get(`
      ${constants.API_ENDPOINT}/users?token=${store.getState().auth.auth.token}
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
          Liste des utilisateurs
          <Button variant="contained" color="primary">
            Ajouter
         </Button>
        </Typography>
        <Typography style={styles.intro}>Page listant les différents utilisateurs ({this.state.data.length})</Typography>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Adresse mail</TableCell>
                <TableCell>Rôle</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.data.map(n => {
                let role = 'Aucun';
                if (n.is_admin === 1) {
                  role = (<strong>Super administrateur</strong>);
                }

                return (
                  <TableRow key={n.id}>
                    <TableCell component="th" scope="row">
                      {n.firstname} {n.lastname}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {n.email}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {role}
                    </TableCell>
                    <TableCell>
                      <Icon>edit</Icon>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  };
}

export default Users;
