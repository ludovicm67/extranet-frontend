import React, { Component } from 'react';
import 'jodit';
import 'jodit/build/jodit.min.css';
import JoditEditor from 'jodit-react';
import { getApi } from '../../utils';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';

const styles = {
  right: {
    float: 'right',
    marginLeft: 10,
    marginBottom: 10,
  },
  title: {
    marginBottom: 50,
  },
};

class WikiShow extends Component {
  state = {
    id: this.props.match.params.postId,
    projectId: this.props.match.params.projectId,

    title: '',
    content: '',
    updated_at: '',
    user: '',
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

  componentDidMount() {
    getApi(`wikis/${this.state.id}`, {
    }).then(res => {
      if (this.unMounted) return;
      const user = (res.user && ` par ${res.user.firstname} ${res.user.lastname} (${res.user.email})`) || '';
      this.setState({
        title: res.title || '',
        content: res.content || '',
        user,
        updated_at: (res.updated_at && `, le ${res.updated_at} UTC.`) || '',
      });
    });
  }

  componentWillUnmount() {
    this.unMounted = true;
  }

  render() {
    return (
      <div>
        <Typography variant="display1" style={styles.title} gutterBottom>
          <Button
            component={Link}
            to={`/projects/${this.state.projectId}/wiki/${this.state.id}/edit`}
            variant="contained"
            color="primary"
            style={styles.right}
          >
            <Icon>edit</Icon>
            Modifier
          </Button>
          <Button
            component={Link}
            to={`/projects/${this.state.projectId}`}
            variant="contained"
            color="primary"
            style={styles.right}
          >
            <Icon>work</Icon>
            Projet
          </Button>
          <Button
            component={Link}
            to={`/projects/${this.state.projectId}/wiki`}
            variant="contained"
            color="primary"
            style={styles.right}
          >
            <Icon>arrow_back</Icon>
            Wiki
          </Button>
          {this.state.title}
        </Typography>
        <JoditEditor
          editorRef={this.setRef}
          value={this.state.content}
          config={this.config}
          onChange={this.updateContent}
        />
        <em>Dernière mise à jour{this.state.user}{this.state.updated_at}</em>
      </div>
    );
  }
}

export default WikiShow;
