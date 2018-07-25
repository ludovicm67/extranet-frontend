import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
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

class ContractsList extends Component {
  state = {
    data: [],
  };

  componentDidMount() {
    getApi('contracts').then(res => {
      if (this.isUnmounted) {
        return;
      }
      this.setState({
        data: res,
      });
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  render() {
    return (
      <div>
        <Typography variant="display1" gutterBottom>
          Liste des contrats
        </Typography>
        <Typography style={styles.intro}>Page listant les différents contrats ({this.state.data.length})</Typography>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Personne</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Début</TableCell>
                <TableCell>Fin</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.data.map(n => {
                return (
                  <TableRow key={n.id}>
                    <TableCell component="th" scope="row">
                      <Link to={`/contracts/${n.id}`}>{n.name}</Link>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
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

export default ContractsList;
