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
    // getApi('types').then(res => {
    //   if (this.isUnmounted) {
    //     return;
    //   }
    //   this.setState({
    //     data: res,
    //   });
    // });
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
                <TableCell>Nom</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.data.map(n => {
                return (
                  <TableRow key={n.id}>
                    <TableCell component="th" scope="row">
                      <Link to={`/types/${n.id}`}>{n.name}</Link>
                    </TableCell>
                    <TableCell>
                      <IconButton component={Link} to={`/types/${n.id}/edit`}>
                        <Icon>edit</Icon>
                      </IconButton>
                      <IconButton onClick={this.handleDelete.bind(this, `types/${n.id}`)}>
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
