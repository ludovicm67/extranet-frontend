import React, { Component } from 'react';
import 'jodit';
import 'jodit/build/jodit.min.css';
import JoditEditor from 'jodit-react';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { getApi, putApi } from '../../utils';

import { setErrMsg } from '../../actions/general';
import store from '../../store';

const styles = {
  input: {
    marginTop: 20,
    marginBottom: 20,
  },
};

class WikiEdit extends Component {
  state = {
    id: this.props.match.params.postId,
    projectId: this.props.match.params.projectId,

    title: '',
    content: '',
  };

  updateContent = value => {
    this.setState({ content: value });
  }

  handleChange = prop => event => {
    this.setState({
      [prop]: event.target.value,
    });
  };

  /**
   * @property Jodit jodit instance of native Jodit
   */
  jodit;
  setRef = jodit => this.jodit = jodit;

  config = {
    uploader: {
      insertImageAsBase64URI: true,
    },
    toolbarButtonSize: 'large',
    toolbarAdaptive: false,
    toolbarStickyOffset: 64,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    disablePlugins: 'autofocus,source,xpath,pasteStorage,search,iframe,fullsize',
    buttons: 'bold,strikethrough,underline,italic,|,superscript,subscript,|,ul,ol,|,outdent,indent,|,font,fontsize,paragraph,|,image,video,table,link,|,align,undo,redo,\n,hr,symbol,print,about',
  };

  componentDidMount() {
    getApi(`wikis/${this.state.id}`, {
    }).then(res => {
      if (this.unMounted) return;
      this.setState({
        title: res.title || '',
        content: res.content || '',
      });
    }).catch(e => {
      store.dispatch(setErrMsg(e));
    });
  }

  componentWillUnmount() {
    this.unMounted = true;
  }

  handleSubmit() {
    putApi(`wikis/${this.state.id}`, {
      title: this.state.title || '',
      content: this.state.content || '',
    }).then(() => this.props.history.push(
      `/projects/${this.state.projectId}/wiki/${this.state.id}`
    )).catch(e => {
      store.dispatch(setErrMsg(e));
    });
  }

  render() {
    return (
      <div>
        <FormControl fullWidth>
          <InputLabel htmlFor="wiki-title">Titre</InputLabel>
          <Input
            style={styles.input}
            id="wiki-title"
            type="text"
            value={this.state.title}
            onChange={this.handleChange('title')}
          />
        </FormControl>
        <JoditEditor
          style={styles.input}
          editorRef={this.setRef}
          value={this.state.content}
          config={this.config}
          onChange={this.updateContent}
        />
        <Button variant="contained" color="primary" style={styles.input} onClick={this.handleSubmit.bind(this)}>
          Modifier
        </Button>
      </div>
    );
  }
}

export default WikiEdit;
