import React, { Component } from 'react';
import 'jodit';
import 'jodit/build/jodit.min.css';
import JoditEditor from "jodit-react";
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

class WikiEdit extends Component {
  state = {
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
    disablePlugins: 'autofocus,source,xpath,pasteStorage,search,iframe,fullsize',
    buttons: 'bold,strikethrough,underline,italic,|,superscript,subscript,|,ul,ol,|,outdent,indent,|,font,fontsize,paragraph,|,image,video,table,link,|,align,undo,redo,\n,hr,symbol,print,about',
  };

  render() {
    return (
      <div>
        <FormControl fullWidth>
          <InputLabel htmlFor="wiki-title">Titre</InputLabel>
          <Input
            id="wiki-title"
            type="text"
            value={this.state.title}
            onChange={this.handleChange('title')}
          />
        </FormControl>
        <JoditEditor
          editorRef={this.setRef}
          value={this.state.content}
          config={this.config}
          onChange={this.updateContent}
        />
      </div>
    );
  }
}

export default WikiEdit;
