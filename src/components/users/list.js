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
import IconButton from '@material-ui/core/IconButton';

import { getApi, deleteApi } from '../../utils';
import { Link } from 'react-router-dom';

const styles = {
  right: {
    float: 'right',
  },
  intro: {
    paddingBottom: '50px',
  },
};

class UsersList extends Component {
  state = {
    data: [],
  };

  fetchList() {
    getApi('users').then(res => {
      this.setState({
        data: res,
      });
    });
  }

  componentDidMount() {
    this.fetchList();
  }

  handleDelete(ressource) {
    deleteApi(ressource).then(() => {
      this.fetchList();
    });
  }

  render() {
    return (
      <div>
        <Typography variant="display1" gutterBottom>
          <Button
            component={Link}
            to="/users/new"
            variant="contained"
            color="primary"
            style={styles.right}
          >
            <Icon>add</Icon>
            Ajouter
          </Button>
          Liste des utilisateurs
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
                      <Link to={`/users/${n.id}`}>{n.firstname} {n.lastname}</Link>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {n.email}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {role}
                    </TableCell>
                    <TableCell>
                      <IconButton component={Link} to={`/users/${n.id}/edit`}>
                        <Icon>edit</Icon>
                      </IconButton>
                      <IconButton onClick={this.handleDelete.bind(this, `users/${n.id}`)}>
                        <Icon>delete</Icon>
                      </IconButton>
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

export default UsersList;
