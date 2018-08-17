import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import moment from 'moment';

import { getApi, deleteApi, urlApi, postApi, hasPermission } from '../utils';
import { Link } from 'react-router-dom';

import { setErrMsg, confirmDelete } from '../actions/general';
import store from '../store';

const styles = {
  title: {
    marginTop: 36,
    marginBottom: 18,
  },
  hidden: {
    display: 'none',
  },
};

class Dashboard extends Component {

  state = {
    pending: {
      leave: [],
      expenses: [],
    },
  };

  fetchPendingRequests() {
    if (hasPermission('request_management', 'edit')) {
      getApi('requests/pending').then(res => {
        if (this.isUnmounted) return;
        this.setState({pending: res});
      }).catch(e => {
        store.dispatch(setErrMsg(e));
      });
    }
  }

  handleDelete(ressource) {
    store.dispatch(confirmDelete(() => {
      deleteApi(ressource).then(() => {
        this.fetchPendingRequests();
      }).catch(e => {
        store.dispatch(setErrMsg(e));
      });
    }));
  }

  handlePost(ressource) {
    postApi(ressource).then(() => {
      this.fetchPendingRequests();
    }).catch(e => {
      store.dispatch(setErrMsg(e));
    });
  }

  formatDate(date) {
    if (!date || date === '') return '';
    return date = moment(date).format('DD/MM/YYYY');
  }
  formatHour(date) {
    if (!date || date === '') return '';
    return `${moment(date).format('H')}h`;
  }

  formatDateInterval(a, b) {
    const d1 = this.formatDate(a);
    const d2 = this.formatDate(b);
    const h1 = this.formatHour(a);
    const h2 = this.formatHour(b);

    if (d1 === d2 && h1 === h2) {
      return `le ${d1} à ${h1}`;
    } else if (d1 === d2) {
      return `le ${d1} de ${h1} à ${h2}`;
    } else {
      return `du ${d1} à ${h1} au ${d2} à ${h2}`;
    }
  }

  formatMonth(month) {
    switch (month) {
      case 1:
        return 'janvier';
      case 2:
        return 'février';
      case 3:
        return 'mars';
      case 4:
        return 'avril';
      case 5:
        return 'mai';
      case 6:
        return 'juin';
      case 7:
        return 'juillet';
      case 8:
        return 'août';
      case 9:
        return 'septembre';
      case 10:
        return 'octobre';
      case 11:
        return 'novembre';
      case 12:
        return 'décembre';
      default:
        return '';
    }
  }

  componentDidMount() {
    this.fetchPendingRequests();
    window.setTimeout(() => this.fetchPendingRequests(), 1000);
    window.setTimeout(() => this.fetchPendingRequests(), 5000);
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  render() {
    const user = store.getState().auth.auth.userData;

    return (
      <div>
        <Typography variant="display1" gutterBottom>
          Tableau de bord
        </Typography>

        <Typography>
          Bienvenue {user.firstname} !
          Vous êtes bien connectés à l'extranet.
        </Typography>
        <Typography>
          Utilisez le menu pour accéder aux différentes ressources.
          Il vous sera alors possible de poser des congés, des notes de frais,
          gérer les différents projets, etc...
        </Typography>

        {this.state.pending.leave.length > 0 && (
          <div>
            <Typography variant="headline" style={styles.title}>
              Congés en attente de validation ({this.state.pending.leave.length})
            </Typography>

            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Utilisateur</TableCell>
                    <TableCell>Période (Montant)</TableCell>
                    <TableCell>Commentaire</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.pending.leave.map(n => {
                    const dates = this.formatDateInterval(n.start, n.end);
                    const amount = '(' + n.days + ((n.days > 1) ? ' jours' : ' jour') + ')';

                    return (
                      <TableRow key={`leave-${n.id}`}>
                        <TableCell component="th" scope="row">
                          <Link to={`/users/${n.user.id}`}>{
                            `${n.user.firstname} ${n.user.lastname}`
                          }</Link>
                        </TableCell>
                        <TableCell>
                          {n.reason} {dates} {amount}
                        </TableCell>
                        <TableCell>{n.details}</TableCell>
                        <TableCell>
                          <IconButton component='a' href={urlApi(`storage/${n.file}`)} disabled={n.file === null} style={n.file === null ? styles.hidden : null} target="_blank">
                            <Icon>attach_file</Icon>
                          </IconButton>
                          <IconButton component={Link} to={`/leave/${n.id}`}>
                            <Icon>edit</Icon>
                          </IconButton>
                          {hasPermission('request_management', 'edit') && (
                            <div>
                              <IconButton onClick={this.handlePost.bind(this, `leave/${n.id}/accept`)}>
                                <Icon>check</Icon>
                              </IconButton>
                              <IconButton onClick={this.handlePost.bind(this, `leave/${n.id}/reject`)}>
                                <Icon>close</Icon>
                              </IconButton>
                            </div>
                          )}
                          {hasPermission('leave', 'delete') && (
                            <IconButton onClick={this.handleDelete.bind(this, `leave/${n.id}`)}>
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
        )}

        {this.state.pending.expenses.length > 0 && (
          <div>
            <Typography variant="headline" style={styles.title}>
              Notes de frais en attente de validation ({this.state.pending.expenses.length})
            </Typography>

            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Utilisateur</TableCell>
                    <TableCell>Période (Montant)</TableCell>
                    <TableCell>Commentaire</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.pending.expenses.map(n => {
                    const dates = `${this.formatMonth(n.month)} ${n.year}`;
                    const amount = `(${n.amount} €)`;

                    return (
                      <TableRow key={`expenses-${n.id}`}>
                        <TableCell component="th" scope="row">
                          <Link to={`/users/${n.user.id}`}>{
                            `${n.user.firstname} ${n.user.lastname}`
                          }</Link>
                        </TableCell>
                        <TableCell>
                          {n.type} {dates} {amount}
                        </TableCell>
                        <TableCell>{n.details}</TableCell>
                        <TableCell>
                          <IconButton component='a' href={urlApi(`storage/${n.file}`)} disabled={n.file === null} style={n.file === null ? styles.hidden : null} target="_blank">
                            <Icon>attach_file</Icon>
                          </IconButton>
                          <IconButton component={Link} to={`/expenses/${n.id}`}>
                            <Icon>edit</Icon>
                          </IconButton>
                          {hasPermission('request_management', 'edit') && (
                            <div>
                              <IconButton onClick={this.handlePost.bind(this, `expenses/${n.id}/accept`)}>
                                <Icon>check</Icon>
                              </IconButton>
                              <IconButton onClick={this.handlePost.bind(this, `expenses/${n.id}/reject`)}>
                                <Icon>close</Icon>
                              </IconButton>
                            </div>
                          )}
                          {hasPermission('expenses', 'delete') && (
                            <IconButton onClick={this.handleDelete.bind(this, `expenses/${n.id}`)}>
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
        )}
      </div>
    );
  }
}

export default Dashboard;
