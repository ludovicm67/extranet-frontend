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

import { setErrMsg } from '../../actions/general';
import store from '../../store';

const styles = {
  right: {
    float: 'right',
    marginLeft: 10,
    marginBottom: 10,
  },
  intro: {
    paddingBottom: '50px',
  },
};

class ContactsList extends Component {
  state = {
    data: [],
  };

  fetchList() {
    getApi('contacts').then(res => {
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
    deleteApi(ressource).then(() => {
      this.fetchList();
    }).catch(e => {
      store.dispatch(setErrMsg(e));
    });
  }

  render() {
    return (
      <div>
        <Typography variant="display1" gutterBottom>
          {hasPermission('contacts', 'add') && (
            <Button
              component={Link}
              to="/contacts/new"
              variant="contained"
              color="primary"
              style={styles.right}
            >
              <Icon>add</Icon>
              Ajouter
            </Button>
          )}
          {hasPermission('contacts', 'show') && (
            <Button
              component={Link}
              to="/types"
              variant="contained"
              color="primary"
              style={styles.right}
            >
              <Icon>contacts</Icon>
              Types
            </Button>
          )}
          {hasPermission('export_contacts', 'show') && (
            <Button
              component={Link}
              to="/export"
              variant="contained"
              color="primary"
              style={styles.right}
            >
              <Icon>vertical_align_bottom</Icon>
              Exporter
            </Button>
          )}
          Liste des contacts
        </Typography>
        <Typography style={styles.intro}>Page listant les différents contacts ({this.state.data.length})</Typography>
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
                      <Link to={`/contacts/${n.id}`}>{n.name}</Link>
                    </TableCell>
                    <TableCell>
                      {hasPermission('contacts', 'edit') && (
                        <IconButton component={Link} to={`/contacts/${n.id}/edit`}>
                          <Icon>edit</Icon>
                        </IconButton>
                      )}
                      {hasPermission('contacts', 'delete') && (
                        <IconButton
                          onClick={this.handleDelete.bind(this, `contacts/${n.id}`)}
                        >
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

export default ContactsList;
