import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

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
      if (this.unMounted) return;
      this.setState({
        linkData: res,
      });
    });
  }

  handleSubmit() {
    postApi('links', {
      url: this.state.linkData.url.final,
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

  componentWillUnmount() {
    this.unMounted = true;
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
        <Button variant="contained" color="primary" style={styles.space} onClick={this.handleSubmit.bind(this)}>
          Créer
        </Button>
      </div>
    );
  };
}

export default LinksNew;
