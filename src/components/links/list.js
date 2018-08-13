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
    marginLeft: 10,
    marginBottom: 10,
  },
  intro: {
    paddingBottom: '50px',
  },
};

class LinksList extends Component {
  state = {
    data: [],
  };

  fetchList() {
    getApi('links').then(res => {
      if (this.isUnmounted) {
        return;
      }
      this.setState({
        data: res.last || [],
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

  render() {
    return (
      <div>
        <Typography variant="display1" gutterBottom>
          <Button
            component={Link}
            to="/link_categories"
            variant="contained"
            color="primary"
            style={styles.right}
          >
            <Icon>bookmarks</Icon>
            Catégories
          </Button>
          <Button
            component={Link}
            to="/links/new"
            variant="contained"
            color="primary"
            style={styles.right}
          >
            <Icon>add</Icon>
            Ajouter
          </Button>
          Liste des liens
        </Typography>
        <Typography style={styles.intro}>Page listant les différents liens ({this.state.data.length})</Typography>
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
                      <strong>{n.title}</strong>
                      {n.description && n.description.split('\n').map((item, key) => {
                        return <p key={key}>{item}</p>
                      })}
                    </TableCell>
                    <TableCell>
                      <IconButton component={Link} to={`/links/${n.id}/edit`}>
                        <Icon>edit</Icon>
                      </IconButton>
                      <IconButton onClick={this.handleDelete.bind(this, `links/${n.id}`)}>
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

export default LinksList;
