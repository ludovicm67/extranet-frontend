

import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import axios from 'axios';
import store from '../../store';
import constants from '../../constants';
import { logout } from '../../actions/auth';

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
        <Typography>Page listant les différents utilisateurs</Typography>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Prénom</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Adresse mail</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.data.map(n => {
                return (
                  <TableRow key={n.id}>
                    <TableCell component="th" scope="row">
                      {n.firstname}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {n.lastname}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {n.email}
                    </TableCell>
                    <TableCell>Actions</TableCell>
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
