import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';

import { getApi, putApi } from '../../utils';

const styles = {
  intro: {
    paddingBottom: '50px',
  },
  submit: {
    marginTop: '42px',
  },
};

class RolesEdit extends Component {
  state = {
    id: this.props.match.params.roleId,
    name: '',
    permissions : [],
  };

  componentDidMount() {
    getApi(`roles/${this.state.id}`).then(res => {
      if (this.isUnmounted) {
        return;
      }
      this.setState({
        name: res.name,
      });
    });

    getApi(`permissions/${this.state.id}`).then(res => {
      if (this.isUnmounted) {
        return;
      }
      this.setState({
        permissions: res,
      });
    });
  }

  handleCheckChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  handleSubmit() {
    putApi(`roles/${this.state.id}`, {
      name: this.state.name,
    }).then(() => this.props.history.push('/roles'));
  }

  handleChange = prop => event => {
    this.setState({
      [prop]: event.target.value
    });
  };

  render() {
    return (
      <div>
        <Typography variant="display1" gutterBottom>
          Modifier un rôle
        </Typography>
        <Typography style={styles.intro}>Modifiez ici les informations concernant le rôle</Typography>
        <FormControl fullWidth style={styles.formControl}>
          <InputLabel htmlFor="role-name">Nom du rôle</InputLabel>
          <Input
            id="role-name"
            type="text"
            value={this.state.name}
            onChange={this.handleChange('name')}
          />
        </FormControl>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Afficher</TableCell>
                <TableCell>Ajouter</TableCell>
                <TableCell>Modifier</TableCell>
                <TableCell>Supprimer</TableCell>
                <TableCell>Tous</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.permissions.map((e, k) => (
                <TableRow key={k}>
                  <TableCell>{`${e.name}`}</TableCell>
                  <TableCell>
                    <Checkbox
                      disabled={!e.show}
                      checked={this.state.confidential}
                      onChange={this.handleCheckChange(e.id, 'show')}
                      value="1"
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      disabled={!e.add}
                      checked={this.state.confidential}
                      onChange={this.handleCheckChange(e.id, 'add')}
                      value="1"
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      disabled={!e.edit}
                      checked={this.state.confidential}
                      onChange={this.handleCheckChange(e.id, 'edit')}
                      value="1"
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      disabled={!e.delete}
                      checked={this.state.confidential}
                      onChange={this.handleCheckChange(e.id, 'delete')}
                      value="1"
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      value="1"
                      color="primary"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        {JSON.stringify(this.state.permissions)}
        <Button variant="contained" color="primary" style={styles.submit} onClick={this.handleSubmit.bind(this)}>
          Modifier
        </Button>
      </div>
    );
  };
}

export default RolesEdit;
