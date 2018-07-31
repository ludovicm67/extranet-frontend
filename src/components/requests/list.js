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
import moment from 'moment';

import { getApi, deleteApi, urlApi, postApi } from '../../utils';
import { Link } from 'react-router-dom';

const styles = {
  rightBtn: {
    float: 'right',
    marginLeft: 10,
  },
  intro: {
    paddingBottom: '50px',
  },
};

class TypesList extends Component {
  state = {
    data: [],
  };

  fetchList() {
    getApi('requests').then(res => {
      if (this.isUnmounted) {
        return;
      }
      this.setState({
        data: res,
      });
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
    });
  }

  handlePost(ressource) {
    postApi(ressource).then(() => {
      this.fetchList();
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
        return 'Janvier';
      case 2:
        return 'Février';
      case 3:
        return 'Mars';
      case 4:
        return 'Avril';
      case 5:
        return 'Mai';
      case 6:
        return 'Juin';
      case 7:
        return 'Juillet';
      case 8:
        return 'Août';
      case 9:
        return 'Septembre';
      case 10:
        return 'Octobre';
      case 11:
        return 'Novembre';
      case 12:
        return 'Décembre';
      default:
        return '';
    }
  }

  render() {
    return (
      <div>
        <Typography variant="display1" gutterBottom>
          <Button
            component={Link}
            to="/leave"
            variant="contained"
            color="primary"
            style={styles.rightBtn}
          >
            <Icon>hotel</Icon>
            Congés
          </Button>
          <Button
            component={Link}
            to="/expenses"
            variant="contained"
            color="primary"
            style={styles.rightBtn}
          >
            <Icon>local_taxi</Icon>
            Note de frais
          </Button>
          Liste des différentes demandes
        </Typography>
        <Typography style={styles.intro}>Page listant les différentes demandes ({this.state.data.length})</Typography>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type de demande</TableCell>
                <TableCell>Utilisateur</TableCell>
                <TableCell>Période</TableCell>
                <TableCell>Montant</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Commentaire</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.data.map(n => {
                const status = ((a) => {
                  switch (a) {
                    case 1:
                      return 'Acceptée';
                    case -1:
                      return 'Refusée';
                    default:
                      return 'En attente...';
                  }
                })(n.accepted);

                const styleColor = ((a) => {
                  switch (a) {
                    case 1:
                      return '#4CAF50';
                    case -1:
                      return '#d50000';
                    default:
                      return '#000000de';
                  }
                })(n.accepted);

                const dates = ((t) => {
                  switch (t) {
                    case 'leave':
                      return this.formatDateInterval(n.leave_start, n.leave_end);
                    case 'expenses':
                      return `${this.formatMonth(n.expense_month)} ${n.expense_year}`;
                    default:
                      return null;
                  }
                })(n.request_type);


                let amount;
                if (n.request_type === 'leave' && n.leave_days) {
                  amount = n.leave_days + ((n.leave_days > 1) ? ' jours' : ' jour');
                } else if (n.request_type === 'expenses' && n.expense_amount) {
                  amount = n.expense_amount + ' €';
                }


                return (
                  <TableRow key={`${n.request_type}-${n.id}`}>
                    <TableCell component="th" scope="row" style={{ color: styleColor }}>
                      {n.request_type &&
                        (n.request_type === 'leave') ? 'Congés' :
                        (n.request_type === 'expenses') ? 'Note de frais' :
                        'Autre'
                      } / {n.category}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Link to={`/users/${n.user_id}`} style={{ color: styleColor }}>{
                        `${n.firstname} ${n.lastname}`
                      }</Link>
                    </TableCell>
                    <TableCell style={{ color: styleColor }}>{dates}</TableCell>
                    <TableCell style={{ color: styleColor }}>{amount}</TableCell>
                    <TableCell style={{ color: styleColor }}>{status}</TableCell>
                    <TableCell style={{ color: styleColor }}>{n.details}</TableCell>
                    <TableCell>
                      <IconButton component='a' href={urlApi(`storage/${n.file}`)} disabled={n.file === null} target="_blank">
                        <Icon>attach_file</Icon>
                      </IconButton>
                      <IconButton component={Link} to={`/${n.request_type}/${n.id}`}>
                        <Icon>edit</Icon>
                      </IconButton>
                      <IconButton onClick={this.handlePost.bind(this, `${n.request_type}/${n.id}/accept`)} disabled={n.accepted === 1}>
                        <Icon>check</Icon>
                      </IconButton>
                      <IconButton onClick={this.handlePost.bind(this, `${n.request_type}/${n.id}/reject`)} disabled={n.accepted === -1}>
                        <Icon>close</Icon>
                      </IconButton>
                      <IconButton onClick={this.handleDelete.bind(this, `${n.request_type}/${n.id}`)}>
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

export default TypesList;
