import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { getApi } from '../../utils';
import { Link } from 'react-router-dom';

const styles = {
  intro: {
    paddingBottom: '50px',
  },
};

class Clients extends Component {
  state = {
    data: [],
  };

  componentDidMount() {
    getApi('sellsy_clients').then(res => {
      this.setState({
        data: res,
      });
    });
  }

  render() {
    return (
      <div>
        <Typography variant="display1" gutterBottom>
          Liste des clients
          <Button variant="contained" color="primary">
            Ajouter
         </Button>
        </Typography>
        <Typography style={styles.intro}>Page listant les différents clients ({this.state.data.length})</Typography>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.data.map(n => {
                return (
                  <TableRow key={n.id}>
                    <TableCell component="th" scope="row">
                      <Link to={`/clients/${n.id}`}>{n.name}</Link>
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

export default Clients;
