import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import ColorPicker from 'material-ui-color-picker';

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

class TeamsEdit extends Component {
  state = {
    id: this.props.match.params.teamId,
    name: '',
    color: '#000000',
  };

  componentDidMount() {
    getApi(`teams/${this.state.id}`).then(res => {
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
    putApi(`teams/${this.state.id}`, {
      name: this.state.name || '',
      color: this.state.color || '#000000',
    }).then(() => this.props.history.push('/teams')).catch(e => {
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
          Modifier une équipe
        </Typography>
        <Typography style={styles.intro}>Modifiez ici les informations concernant cette équipe</Typography>
        <FormControl fullWidth style={styles.formControl}>
          <InputLabel htmlFor="team-name">Nom</InputLabel>
          <Input
            id="team-name"
            type="text"
            value={this.state.name}
            onChange={this.handleChange('name')}
          />
        </FormControl>
        <ColorPicker
          defaultValue={this.state.color}
          onChange={color => this.setState({color})}
        />
        <Button variant="contained" color="primary" style={styles.submit} onClick={this.handleSubmit.bind(this)}>
          Modifier
        </Button>
      </div>
    );
  };
}

export default TeamsEdit;
