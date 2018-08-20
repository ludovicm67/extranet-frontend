import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import moment from 'moment';
import 'moment/locale/fr';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';

import { getApi, urlApi, deleteApi, hasPermission } from '../../utils';

import { setErrMsg, confirmDelete } from '../../actions/general';
import store from '../../store';

moment.locale('fr');

const styles = {
  intro: {
    paddingBottom: '20px',
  },
  submit: {
    marginTop: '42px',
  },
  formControl: {
    marginTop: '20px',
  },
  right: {
    float: 'right',
    margin: 5,
  },
  click: {
    cursor: 'pointer',
  },
};

class UsersShow extends Component {
  state = {
    id: this.props.match.params.userId,
    firstname: '',
    lastname: '',
    role: '',
    is_admin: 0,
    email: '',
    documents: [],
  };

  fetchData() {
    getApi(`users/${this.state.id}`).then(res => {
      if (this.isUnmounted) {
        return;
      }
      this.setState({
        firstname: res.firstname || '',
        lastname: res.lastname || '',
        role: (res.is_admin === 1 ? (<strong>Super administrateur</strong>) : (res.role && res.role.name) ? res.role.name : 'Aucun'),
        is_admin: res.is_admin,
        email: res.email || '',
        documents: res.documents || [],
      });
    }).catch(e => {
      store.dispatch(setErrMsg(e));
    });
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  handleCopy(id) {
    var copyText = document.getElementById(id);
    copyText.select();
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
  }

  displayFile(file) {
    let name;
    if (!file) return '';

    const d = moment(file.date);
    switch (file.type) {
      case 'pay':
        name = 'Fiche de paie du mois de ' + d.format('MMMM YYYY');
        break;
        case 'medical':
        name = 'Fiche de visite médicale du ' + d.format('Do MMMM YYYY');
        break;
      default:
        name = 'Document du ' + d.format('Do MMMM YYYY');
    }

    if (file.details) {
      name = `${name}. ${file.details}`;
    }

    return name;
  }

  handleDelete(ressource) {
    store.dispatch(confirmDelete(() => {
      deleteApi(ressource).then(() => {
        this.fetchData();
      }).catch(e => {
        store.dispatch(setErrMsg(e));
      });
    }));
  }

  render() {
    return (
      <div>
        <Typography variant="display1" gutterBottom>
          {hasPermission('overtime', 'edit') && (
            <Button
              component={Link}
              to={`/overtime/${this.state.id}`}
              variant="contained"
              color="primary"
              style={styles.right}
            >
              <Icon>access_time</Icon>
              Heures supplémentaires
            </Button>
          )}
          {hasPermission('documents', 'add') && (
            <Button
              component={Link}
              to={`/documents/${this.state.id}`}
              variant="contained"
              color="primary"
              style={styles.right}
            >
              <Icon>insert_drive_file</Icon>
              Déposer un document
            </Button>
          )}
          {hasPermission('users', 'edit') && (
            <Button
              component={Link}
              to={`/users/${this.state.id}/edit`}
              variant="contained"
              color="primary"
              style={styles.right}
            >
              <Icon>edit</Icon>
              Modifier
            </Button>
          )}
          {`${this.state.firstname} ${this.state.lastname} (${this.state.email})`}
        </Typography>
        <Typography style={styles.intro}>Affichage des informations à propos de cet utilisateur</Typography>
        <Typography>
          <strong>Nom complet : </strong>
          {`${this.state.firstname} ${this.state.lastname}`}
        </Typography>
        <Typography>
          <strong>Adresse mail : </strong>
          <a href={`mailto:${this.state.email}`}>{this.state.email}</a>
        </Typography>
        <Typography>
          <strong>Rôle : </strong>
          {this.state.role}
        </Typography>
        {this.state.documents.length > 0 && (
          <div>
            <Typography variant="headline" style={styles.formControl}>Documents</Typography>
            <Paper>
              <Table>
                <TableBody>
                  {this.state.documents.map((d, k) => (
                    <TableRow key={k}>
                      <TableCell><a href={urlApi(`storage/${d.file}`)} target="_blank">{this.displayFile(d)}</a></TableCell>
                      <TableCell>
                        {d.password && (
                          <FormControl>
                            <InputLabel htmlFor={`doc-${k}-password`}>Mot de passe</InputLabel>
                            <Input
                              id={`doc-${k}-password`}
                              type="text"
                              value={d.password}
                              endAdornment={
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="Toggle password visibility"
                                    onClick={this.handleCopy.bind(this, `doc-${k}-password`)}
                                  >
                                    <Icon>filter_none</Icon>
                                  </IconButton>
                                </InputAdornment>
                              }
                            />
                          </FormControl>
                        )}
                      </TableCell>
                      <TableCell>
                        {hasPermission('documents', 'delete') && (
                          <span style={styles.click} onClick={this.handleDelete.bind(this, `documents/${d.id}`)}>Supprimer</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </div>
        )}
      </div>
    );
  };
}

export default UsersShow;
