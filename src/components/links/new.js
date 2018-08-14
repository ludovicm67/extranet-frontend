import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Select from '../layout/Select';

import { getApi, postApi } from '../../utils';

const styles = {
  intro: {
    paddingBottom: '50px',
  },
  space: {
    marginTop: 36,
  },
};

class LinksNew extends Component {
  state = {
    getCategories: [],
    categories: '',
    linkData: {
      title: '',
      img: null,
      description: '',
      url: {
        final: '',
      },
    }
  };

  handleExtract() {
    getApi(`links/preview?url=${this.state.linkData.url.final}`, {
      title: '',
      img: null,
      description: '',
      url: {
        final: '',
      },
    }).then(res => {
      if (this.isUnmounted) return;
      this.setState({
        linkData: res,
      });
    });
  }

  handleSubmit() {
    postApi('links', {
      url: this.state.linkData.url.final || '',
      title: this.state.linkData.title || '',
      description: this.state.linkData.description || '',
      image_url: (this.state.linkData.img && this.state.linkData.img.url) || null,
      categories: this.state.categories ? this.state.categories.split(',').map(i => i.trim()) : '',
    }).then(() => this.props.history.push('/links'));
  }

  handleChangeUrl = event => {
    let data = this.state.linkData;
    data.url.final = event.target.value;
    this.setState({
      linkData: data,
    });
  };

  handleChangeTitle = event => {
    let data = this.state.linkData;
    data.title = event.target.value;
    this.setState({
      linkData: data,
    });
  };

  handleChangeDescription = event => {
    let data = this.state.linkData;
    data.description = event.target.value;
    this.setState({
      linkData: data,
    });
  };

  handleChangeImage = event => {
    let data = this.state.linkData;
    data.img = {
      url: event.target.value,
    };
    this.setState({
      linkData: data,
    });
  };

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

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  componentDidMount() {
    getApi('link_categories').then(res => {
      if (this.isUnmounted) {
        return;
      }
      const categories = [];
      categories.push(...res.map(e => {
        return {
          label: e.name,
          value: e.id,
        };
      }));
      this.setState({
        getCategories: categories,
      });
    });
  }

  render() {
    return (
      <div>
        <Typography variant="display1" gutterBottom>
          Créer un nouveau lien
        </Typography>
        <Typography style={styles.intro}>Entrez ici les informations concernant le lien</Typography>
        <FormControl fullWidth style={styles.space}>
          <InputLabel htmlFor="link-url">URL</InputLabel>
          <Input
            id="link-url"
            type="text"
            value={this.state.linkData.url.final}
            onChange={this.handleChangeUrl.bind(this)}
          />
        </FormControl>
        <Button variant="contained" color="primary" style={styles.space} onClick={this.handleExtract.bind(this)}>
          Extraire les informations du lien
        </Button>
        {this.state.linkData.img && this.state.linkData.img.url && (
          <p style={styles.space}><img src={this.state.linkData.img.url} style={{maxWidth: 150, mawHeight: 150}} alt="" /></p>
        )}
        <FormControl fullWidth style={styles.space}>
          <InputLabel htmlFor="link-title">Titre</InputLabel>
          <Input
            id="link-title"
            type="text"
            value={this.state.linkData.title}
            onChange={this.handleChangeTitle.bind(this)}
          />
        </FormControl>
        <FormControl fullWidth style={styles.space}>
          <InputLabel htmlFor="link-description">Description</InputLabel>
          <Input
            id="link-description"
            multiline
            rowsMax="10"
            type="text"
            value={this.state.linkData.description}
            onChange={this.handleChangeDescription.bind(this)}
          />
        </FormControl>
        <FormControl fullWidth style={styles.space}>
          <InputLabel htmlFor="link-img">Image</InputLabel>
          <Input
            id="link-img"
            type="text"
            value={(this.state.linkData.img && this.state.linkData.img.url) || ''}
            onChange={this.handleChangeImage.bind(this)}
          />
        </FormControl>
        <TextField
          style={styles.space}
          fullWidth
          value={this.state.categories}
          onChange={this.handleChange('categories')}
          placeholder="Choisissez une ou plusieurs catégories..."
          name="select-categories"
          label="Catégories"
          autoComplete="new-password"
          InputLabelProps={{
            shrink: true
          }}
          InputProps={{
            inputComponent: Select,
            inputProps: {
              creatable: true,
              multi: true,
              instanceId: "select-categories",
              id: "select-categories",
              simpleValue: true,
              options: this.state.getCategories,
            }
          }}
        />
        <Button variant="contained" color="primary" style={styles.space} onClick={this.handleSubmit.bind(this)}>
          Créer
        </Button>
      </div>
    );
  };
}

export default LinksNew;
