import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import Button from '@material-ui/core/Button';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

import { getApi, deleteApi, hasPermission } from '../../utils';
import { Link } from 'react-router-dom';

import { setErrMsg, confirmDelete } from '../../actions/general';
import store from '../../store';

const styles = {
  right: {
    float: 'right',
  },
  intro: {
    paddingBottom: '50px',
  },
};

class ContractsList extends Component {
  state = {
    data: [],
  };

  fetchList() {
    getApi('contracts').then(res => {
      if (this.isUnmounted) {
        return;
      }
      this.setState({
        data: res,
      });
    }).catch(e => {
      store.dispatch(setErrMsg(e));
    });
  }

  componentDidMount() {
    this.fetchList();
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  formatDate(date) {
    if (!date || date === '') return '';

    let year = date.getFullYear().toString();
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();

    return (day[1] ? day : '0' + day[0]) + '/'
      + (month[1] ? month : '0' + month[0])
      + '/' + year;
  }

  handleDelete(ressource) {
    store.dispatch(confirmDelete(() => {
      deleteApi(ressource).then(() => {
        this.fetchList();
      }).catch(e => {
        store.dispatch(setErrMsg(e));
      });
    }));
  }

  render() {
    return (
      <div>
        <Typography variant="display1" gutterBottom>
          {hasPermission('contracts', 'add') && (
            <Button
              component={Link}
              to="/contracts/new"
              variant="contained"
              color="primary"
              style={styles.right}
            >
              <Icon>add</Icon>
              Ajouter
            </Button>
          )}
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
                if (!n.user) return null;
                return (
                  <TableRow key={n.id}>
                    <TableCell component="th" scope="row">
                      <Link to={`/users/${n.user.id}`}>
                        {n.user.firstname} {n.user.lastname} ({n.user.email})
                      </Link>
                    </TableCell>
                    <TableCell>{n.type}</TableCell>
                    <TableCell>
                      {(n.start_at
                        && this.formatDate(new Date(Date.parse(n.start_at))))
                        || '- - - - - - - - - -'
                      }
                    </TableCell>
                    <TableCell>
                      {(n.end_at
                        && this.formatDate(new Date(Date.parse(n.end_at))))
                        || '- - - - - - - - - -'
                      }
                    </TableCell>
                    <TableCell>
                      {hasPermission('contracts', 'edit') && (
                        <IconButton component={Link} to={`/contracts/${n.id}/edit`}>
                          <Icon>edit</Icon>
                        </IconButton>
                      )}
                      {hasPermission('contracts', 'delete') && (
                        <IconButton onClick={this.handleDelete.bind(this, `contracts/${n.id}`)}>
                          <Icon>delete</Icon>
                        </IconButton>
                      )}
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

export default ContractsList;
