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

class LinkCategoriesEdit extends Component {
  state = {
    id: this.props.match.params.link_categoryId,
    name: '',
  };

  componentDidMount() {
    getApi(`link_categories/${this.state.id}`).then(res => {
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
    putApi(`link_categories/${this.state.id}`, {
      name: this.state.name,
    }).then(() => this.props.history.push('/link_categories'));
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
          Modifier une catégorie de liens
        </Typography>
        <Typography style={styles.intro}>Modifiez ici les informations concernant la catégorie de liens</Typography>
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
          Modifier
        </Button>
      </div>
    );
  };
}

export default LinkCategoriesEdit;
