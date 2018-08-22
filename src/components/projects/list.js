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
import amber from '@material-ui/core/colors/amber';

import { getApi, deleteApi, postApi, hasPermission } from '../../utils';
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
  dateOld: {
    color: amber[500],
  },
  smallCol: {
    maxWidth: 30,
    padding: 5,
  },
};

class ProjectsList extends Component {
  state = {
    data: [],
  };

  fetchList() {
    getApi('projects').then(res => {
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

  handleArchive(projectId) {
    postApi(`projects/${projectId}/archive`).then(() => this.fetchList()).catch(e => {
      store.dispatch(setErrMsg(e));
    });
  }

  handleFav(ressource, key) {
    const data = this.state['data'].map((v, k) => {
      if (k === key) {
        return ({
          ...v,
          favorited: true,
        });
      }
      return v;
    });

    postApi(`${ressource}/fav`).catch(e => {
      store.dispatch(setErrMsg(e));
    });

    this.setState({
      data,
    });
  }

  handleUnfav(ressource, key) {
    const data = this.state['data'].map((v, k) => {
      if (k === key) {
        return ({
          ...v,
          favorited: false,
        });
      }
      return v;
    });

    postApi(`${ressource}/unfav`).catch(e => {
      store.dispatch(setErrMsg(e));
    });

    this.setState({
      data,
    });
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

  render() {
    return (
      <div>
        <Typography variant="display1" gutterBottom>
          {hasPermission('projects', 'add') && (
            <Button
              component={Link}
              to="/projects/new"
              variant="contained"
              color="primary"
              style={styles.right}
            >
              <Icon>add</Icon>
              Ajouter
            </Button>
          )}
          <Button
            component={Link}
            to="/projects/archived"
            variant="contained"
            color="primary"
            style={styles.right}
          >
            <Icon>archive</Icon>
            Archives
          </Button>
          {hasPermission('projects', 'show') && (
            <Button
              component={Link}
              to="/tags"
              variant="contained"
              color="primary"
              style={styles.right}
            >
              <Icon>bookmark</Icon>
              Tags
            </Button>
          )}
          Liste des projets
        </Typography>
        <Typography style={styles.intro}>Page listant les différents projets ({this.state.data.length})</Typography>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={styles.smallCol}></TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Prochaine action à effectuer</TableCell>
                <TableCell>Fin du projet souhaité</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.data.map((n, key) => {
                const parsedDate = new Date(Date.parse(n.end_at));
                const now = new Date();
                const isPast = parsedDate < now;
                return (
                  <TableRow key={n.id}>
                    <TableCell style={styles.smallCol}>
                      <IconButton onClick={
                        n.favorited
                        ? this.handleUnfav.bind(this, `projects/${n.id}`, key)
                        : this.handleFav.bind(this, `projects/${n.id}`, key)
                      }>
                        <Icon>
                          {n.favorited ? 'star' : 'star_border'}
                        </Icon>
                      </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Link to={`/projects/${n.id}`}>{n.name}</Link>
                    </TableCell>
                    <TableCell>
                      {n.next_action && n.next_action.split('\n').map((item, key) => {
                        return <span key={key}>{item}<br /></span>
                      })}
                    </TableCell>
                    <TableCell style={(n.end_at && isPast) ? styles.dateOld : null}>
                      {n.end_at && this.formatDate(parsedDate)}
                    </TableCell>
                    <TableCell>
                      {hasPermission('projects', 'edit') && (
                        <IconButton component={Link} to={`/projects/${n.id}/edit`}>
                          <Icon>edit</Icon>
                        </IconButton>
                      )}
                      {hasPermission('projects', 'edit') && (
                        <IconButton onClick={this.handleArchive.bind(this, n.id)}>
                          <Icon>archive</Icon>
                        </IconButton>
                      )}
                      {hasPermission('projects', 'delete') && (
                        <IconButton onClick={this.handleDelete.bind(this, `projects/${n.id}`)}>
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

export default ProjectsList;
