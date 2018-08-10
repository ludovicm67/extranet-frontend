import React, { Component } from 'react';
import 'jodit';
import 'jodit/build/jodit.min.css';
import JoditEditor from 'jodit-react';

class WikiShow extends Component {
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
    readonly: true,
    toolbar: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,

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

  render() {
    return (
      <div>
        <h1>{this.state.title}</h1>
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

export default WikiShow;
