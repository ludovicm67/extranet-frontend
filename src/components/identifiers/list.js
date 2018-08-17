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

class IdentifiersList extends Component {
  state = {
    data: [],
  };

  fetchList() {
    getApi('identifiers').then(res => {
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
          {hasPermission('identifiers', 'add') && (
            <Button
              component={Link}
              to="/identifiers/new"
              variant="contained"
              color="primary"
              style={styles.right}
            >
              <Icon>add</Icon>
              Ajouter
            </Button>
          )}
          Liste des types d'identifiants
        </Typography>
        <Typography style={styles.intro}>Page listant les différents types d'identifiants ({this.state.data.length})</Typography>
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
                      <Link to={`/identifiers/${n.id}`}>{n.name}</Link>
                    </TableCell>
                    <TableCell>
                      {hasPermission('identifiers', 'edit') && (
                        <IconButton component={Link} to={`/identifiers/${n.id}/edit`}>
                          <Icon>edit</Icon>
                        </IconButton>
                      )}
                      {hasPermission('identifiers', 'delete') && (
                        <IconButton onClick={this.handleDelete.bind(this, `identifiers/${n.id}`)}>
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

export default IdentifiersList;
