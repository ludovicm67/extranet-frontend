import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import { postApi } from '../../utils';

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

class LinkCategoriesNew extends Component {
  state = {
    name: '',
  };

  handleSubmit() {
    postApi('link_categories', {
      name: this.state.name,
    }).then(() => this.props.history.push('/link_categories')).catch(e => {
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
          Créer une nouvelle catégorie de liens
        </Typography>
        <Typography style={styles.intro}>Entrez ici les informations concernant la catégorie de liens</Typography>
        <FormControl fullWidth style={styles.formControl}>
          <InputLabel htmlFor="category-name">Nom</InputLabel>
          <Input
            id="category-name"
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

export default LinkCategoriesNew;
