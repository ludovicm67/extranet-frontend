import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import { getApi, putApi } from '../../utils';

import { setErrMsg } from '../../actions/general';
import store from '../../store';

const styles = {
  intro: {
    paddingBottom: '50px',
  },
  submit: {
    marginTop: '42px',
  },
};

class IdentifiersEdit extends Component {
  state = {
    id: this.props.match.params.identifierId,
    name: '',
  };

  componentDidMount() {
    getApi(`identifiers/${this.state.id}`).then(res => {
      if (this.isUnmounted) {
        return;
      }
      this.setState({
        name: res.name,
      });
    }).catch(e => {
      store.dispatch(setErrMsg(e));
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  handleSubmit() {
    putApi(`identifiers/${this.state.id}`, {
      name: this.state.name,
    }).then(() => this.props.history.push('/identifiers')).catch(e => {
      store.dispatch(setErrMsg(e));
    });
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
          Modifier un type d'identifiants
        </Typography>
        <Typography style={styles.intro}>Modifiez ici les informations concernant le type d'identifiants</Typography>
        <FormControl fullWidth style={styles.formControl}>
          <InputLabel htmlFor="identifier-name">Nom</InputLabel>
          <Input
            id="identifier-name"
            type="text"
            value={this.state.name}
            onChange={this.handleChange('name')}
          />
        </FormControl>
        <Button variant="contained" color="primary" style={styles.submit} onClick={this.handleSubmit.bind(this)}>
          Modifier
        </Button>
      </div>
    );
  };
}

export default IdentifiersEdit;
