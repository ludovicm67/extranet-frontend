import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { getApi } from '../utils';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

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
    getApi(`search?q=${encodeURIComponent(this.state.q)}`).then(res => {
      if (this.isUnmounted) {
        return;
      }
      console.log(res.projects);
      this.setState({
        results: res,
      });
    });
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
        {JSON.stringify(this.state.results)}
      </div>
    );
  }
}

Search.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Search);
