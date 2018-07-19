import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import { getApi, putApi } from '../../utils';

const styles = {
  intro: {
    paddingBottom: '50px',
  },
  submit: {
    marginTop: '42px',
  },
};

class TypesEdit extends Component {
  state = {
    id: this.props.match.params.typeId,
    name: '',
  };

  componentDidMount() {
    getApi(`types/${this.state.id}`).then(res => {
      if (this.isUnmounted) {
        return;
      }
      this.setState({
        name: res.name,
      });
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  handleSubmit() {
    putApi(`types/${this.state.id}`, {
      name: this.state.name,
    }).then(() => this.props.history.push('/types'));
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
          Modifier un type de contact
        </Typography>
        <Typography style={styles.intro}>Modifiez ici les informations concernant le type</Typography>
        <FormControl fullWidth style={styles.formControl}>
          <InputLabel htmlFor="type-name">Nom</InputLabel>
          <Input
            id="type-name"
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

export default TypesEdit;
