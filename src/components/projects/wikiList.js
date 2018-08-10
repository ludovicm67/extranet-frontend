import React, { Component } from 'react';
import 'jodit';
import 'jodit/build/jodit.min.css';
import { getApi } from '../../utils';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const styles = {
  right: {
    float: 'right',
    marginLeft: 10,
    marginBottom: 10,
  },
  cursor: {
    cursor: 'pointer',
  },
};

class WikiList extends Component {
  state = {
    id: this.props.match.params.projectId,

    data: [],
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
    getApi(`project_wikis/${this.state.id}`, {
    }).then(res => {
      if (this.unMounted) return;
      this.setState({
        data: res || [],
      });
    });
  }

  componentWillUnmount() {
    this.unMounted = true;
  }

  handleLocation(url) {
    this.props.history.push(url);
  }

  render() {
    return (
      <div>
        <Typography variant="display1" gutterBottom>
          <Button
            component={Link}
            to={`/projects/${this.state.id}/wiki/new`}
            variant="contained"
            color="primary"
            style={styles.right}
          >
            <Icon>add</Icon>
            Ajouter
          </Button>
          <Button
            component={Link}
            to={`/projects/${this.state.id}`}
            variant="contained"
            color="primary"
            style={styles.right}
          >
            <Icon>arrow_back</Icon>
            Projet
          </Button>
          Wiki
        </Typography>
        {this.state.data.length > 0 && (
          <Paper>
            <Table>
              <TableBody>
                {this.state.data.map(e => (
                  <TableRow style={styles.cursor} key={e.id} onClick={this.handleLocation.bind(this, `/projects/${e.project_id}/wiki/${e.id}`)}>
                    <TableCell>{`${e.title}`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </div>
    );
  }
}

export default WikiList;
