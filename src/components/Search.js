import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { getApi } from '../utils';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  intro: {
    paddingBottom: '20px',
  },
  submit: {
    marginTop: 5,
  },
  formControl: {
    marginTop: '20px',
  },
  cursor: {
    cursor: 'pointer',
  },
  category: {
    marginTop: 20,
    marginBottom: 10,
  },
});

class Search extends Component {
  state = {
    q: '',

    results: {
      users: [],
      clients: [],
      projects: [],
      contacts: [],
      sellsy_contacts: [],
      tags: [],
    },
  };

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  handleChange = prop => event => {
    if (event && event.target && event.target.value !== undefined) {
      this.setState({
        [prop]: event.target.value,
      });
    } else {
      this.setState({
        [prop]: event,
      });
    }
  };

  handleSubmit() {
    getApi(`search?q=${encodeURIComponent(this.state.q)}`, {
      users: [],
      clients: [],
      projects: [],
      contacts: [],
      sellsy_contacts: [],
      tags: [],
    }).then(res => {
      if (this.isUnmounted) {
        return;
      }

      this.setState({
        results: res,
      });
    });
  }

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.handleSubmit();
    }
  }

  handleLocation(url) {
    this.props.history.push(url);
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Typography variant="display1" gutterBottom>
          Rechercher...
        </Typography>
        <Typography className={classes.intro}>Rechercher des contacts, des projets, des utilisateurs, ...</Typography>

        <FormControl fullWidth style={styles.formControl}>
          <InputLabel htmlFor="search-q">Recherche</InputLabel>
          <Input
            id="search-q"
            type="text"
            value={this.state.q}
            onChange={this.handleChange('q')}
            autoComplete="new-password"
            onKeyPress={this.handleKeyPress}
          />
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={this.handleSubmit.bind(this)}
        >
          Lancer la recherche
        </Button>

        {this.state.results.clients.length > 0 && (
          <div>
            <Typography variant="headline" className={classes.category}>Clients ({this.state.results.clients.length})</Typography>
            <Paper>
              <Table>
                <TableBody>
                  {this.state.results.clients.map(e => (
                    <TableRow className={classes.cursor} key={e.id} onClick={this.handleLocation.bind(this, `/clients/${e.id}`)}>
                      <TableCell>{`${e.name}`}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </div>
        )}

        {this.state.results.projects.length > 0 && (
          <div>
            <Typography variant="headline" className={classes.category}>Projets ({this.state.results.projects.length})</Typography>
            <Paper>
              <Table>
                <TableBody>
                  {this.state.results.projects.map(e => (
                    <TableRow className={classes.cursor} key={e.id} onClick={this.handleLocation.bind(this, `/projects/${e.id}`)}>
                      <TableCell>{`${e.name}`}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </div>
        )}

        {this.state.results.contacts.length > 0 && (
          <div>
            <Typography variant="headline" className={classes.category}>Interlocuteurs ({this.state.results.contacts.length})</Typography>
            <Paper>
              <Table>
                <TableBody>
                  {this.state.results.contacts.map(e => (
                    <TableRow className={classes.cursor} key={e.id} onClick={this.handleLocation.bind(this, `/contacts/${e.id}`)}>
                      <TableCell>{`${e.name}`}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </div>
        )}

        {this.state.results.sellsy_contacts.length > 0 && (
          <div>
            <Typography variant="headline" className={classes.category}>Contacts ({this.state.results.sellsy_contacts.length})</Typography>
            <Paper>
              <Table>
                <TableBody>
                  {this.state.results.sellsy_contacts.map(e => (
                    <TableRow className={classes.cursor} key={e.id} onClick={this.handleLocation.bind(this, `/clients/${e.client && e.client.id}`)}>
                      <TableCell>{`${e.fullName} ${(e.client && 'de ' + e.client.fullName) || ''}`}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </div>
        )}

        {this.state.results.users.length > 0 && (
          <div>
            <Typography variant="headline" className={classes.category}>Utilisateurs ({this.state.results.users.length})</Typography>
            <Paper>
              <Table>
                <TableBody>
                  {this.state.results.users.map(e => (
                    <TableRow className={classes.cursor} key={e.id} onClick={this.handleLocation.bind(this, `/users/${e.id}`)}>
                      <TableCell>{`${e.firstname} ${e.lastname} (${e.email})`}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </div>
        )}

        {this.state.results.tags.length > 0 && (
          <div>
            <Typography variant="headline" className={classes.category}>Tags ({this.state.results.tags.length})</Typography>
            <Paper>
              <Table>
                <TableBody>
                  {this.state.results.tags.map(e => (
                    <TableRow className={classes.cursor} key={e.id} onClick={this.handleLocation.bind(this, `/tags/${e.id}`)}>
                      <TableCell>{e.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </div>
        )}
      </div>
    );
  }
}

Search.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Search);
