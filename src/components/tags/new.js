import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import { postApi } from '../../utils';

const styles = {
  intro: {
    paddingBottom: '50px',
  },
  submit: {
    marginTop: '42px',
  },
};

class TagsNew extends Component {
  state = {
    name: '',
  };

  handleSubmit() {
    postApi('tags', {
      name: this.state.name,
    }).then(() => this.props.history.push('/tags'));
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
          Créer un nouveau tag
        </Typography>
        <Typography style={styles.intro}>Entrez ici les informations concernant le tag</Typography>
        <FormControl fullWidth style={styles.formControl}>
          <InputLabel htmlFor="tag-name">Nom du tag</InputLabel>
          <Input
            id="tag-name"
            type="text"
            value={this.state.name}
            onChange={this.handleChange('name')}
          />
        </FormControl>
        <Button variant="contained" color="primary" style={styles.submit} onClick={this.handleSubmit.bind(this)}>
          Créer
        </Button>
      </div>
    );
  };
}

export default TagsNew;
