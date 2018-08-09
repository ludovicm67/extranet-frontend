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
  space: {
    marginTop: '42px',
  },
  smallCol: {
    maxWidth: 30,
    padding: 5,
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

  handleCheckChange = (key, p) => event => {
    if (!this.state.permissions || !this.state.permissions[key]) return;
    let permissions = this.state.permissions;
    const isChecked = event.target.checked;

    if (isChecked && !permissions[key].checked.includes(p)) {
      permissions[key].checked.push(p);
    } else if (!isChecked && permissions[key].checked.includes(p)) {
      const index = permissions[key].checked.indexOf(p);
      if (index !== -1) permissions[key].checked.splice(index, 1);
    }

    this.setState({ permissions });
  };

  handleCheckLineChange = key => event => {
    if (!this.state.permissions || !this.state.permissions[key]) return;
    let permissions = this.state.permissions;
    const isChecked = event.target.checked;

    permissions[key].checked = [];
    if (isChecked) {
      if (permissions[key].show) permissions[key].checked.push('show');
      if (permissions[key].add) permissions[key].checked.push('add');
      if (permissions[key].edit) permissions[key].checked.push('edit');
      if (permissions[key].delete) permissions[key].checked.push('delete');
    }

    this.setState({ permissions });
  };

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  handleSubmit() {
    let permissions = this.state.permissions || [];
    permissions  = permissions.reduce((prev, cur, i) => {
      prev[cur.id] = cur.checked;
      return prev;
    }, {});

    putApi(`roles/${this.state.id}`, {
      name: this.state.name,
      permissions,
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
        <Typography variant="headline" style={styles.space}>
          Permissions
        </Typography>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell style={styles.smallCol}>Afficher</TableCell>
                <TableCell style={styles.smallCol}>Ajouter</TableCell>
                <TableCell style={styles.smallCol}>Modifier</TableCell>
                <TableCell style={styles.smallCol}>Supprimer</TableCell>
                <TableCell style={styles.smallCol}>Tous</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.permissions.map((e, k) => (
                <TableRow key={k}>
                  <TableCell>{`${e.name}`}</TableCell>
                  <TableCell style={styles.smallCol}>
                    <Checkbox
                      disabled={!e.show}
                      checked={e.show && e.checked.includes('show')}
                      onChange={this.handleCheckChange(k, 'show')}
                      value="1"
                      color="primary"
                    />
                  </TableCell>
                  <TableCell style={styles.smallCol}>
                    <Checkbox
                      disabled={!e.add}
                      checked={e.add && e.checked.includes('add')}
                      onChange={this.handleCheckChange(k, 'add')}
                      value="1"
                      color="primary"
                    />
                  </TableCell>
                  <TableCell style={styles.smallCol}>
                    <Checkbox
                      disabled={!e.edit}
                      checked={e.edit && e.checked.includes('edit')}
                      onChange={this.handleCheckChange(k, 'edit')}
                      value="1"
                      color="primary"
                    />
                  </TableCell>
                  <TableCell style={styles.smallCol}>
                    <Checkbox
                      disabled={!e.delete}
                      checked={e.delete && e.checked.includes('delete')}
                      onChange={this.handleCheckChange(k, 'delete')}
                      value="1"
                      color="primary"
                    />
                  </TableCell>
                  <TableCell style={styles.smallCol}>
                    <Checkbox
                      checked={((e.show && e.checked.includes('show')) || !e.show)
                        && ((e.add && e.checked.includes('add')) || !e.add)
                        && ((e.edit && e.checked.includes('edit')) || !e.edit)
                        && ((e.delete && e.checked.includes('delete')) || !e.delete)}
                      onChange={this.handleCheckLineChange(k)}
                      value="1"
                      color="primary"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        <Button variant="contained" color="primary" style={styles.space} onClick={this.handleSubmit.bind(this)}>
          Modifier
        </Button>
      </div>
    );
  };
}

export default RolesEdit;
