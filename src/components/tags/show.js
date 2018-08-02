import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom';

import { getApi } from '../../utils';

const styles = {
  right: {
    float: 'right',
  },
  intro: {
    paddingBottom: '50px',
  },
  submit: {
    marginTop: '42px',
  },
};

class TagsShow extends Component {
  state = {
    id: this.props.match.params.tagId,
    value: this.props.match.params.tagValue || '',
    name: '',
    projects: [],
  };

  fetchList() {
    getApi(`tags/${this.state.id}`).then(res => {
      if (this.isUnmounted) {
        return;
      }

      const getProjects = res.projects || [];
      const projects = this.state.value
        ? getProjects.filter(p => p.pivot && p.pivot.value === this.state.value)
        : getProjects;

      this.setState({
        name: res.name || '',
        projects,
      });
    });
  }

  componentDidMount() {
    this.fetchList();
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  handleRemoveFilter() {
    this.props.history.push({ pathname: `/tags/${this.state.id}` });
    this.setState({
      value: '',
    });
    this.fetchList();
  }

  handleAddFilter(value) {
    this.props.history.push({ pathname: `/tags/${this.state.id}/${value}` });
    this.setState({
      value,
    });
    this.fetchList();
  }

  render() {
    const tagRemoveFilter = (this.state.value) ? (
      <Button
        onClick={this.handleRemoveFilter.bind(this)}
        variant="contained"
        color="primary"
        style={styles.right}
      >
        <Icon>clear</Icon>
        Retirer le filtre
      </Button>
    ) : null;

    const tagVal = (this.state.value) ? (
      <small>{this.state.value}</small>
    ) : null;
    return (
      <div>
        <Typography variant="display1" gutterBottom>
          {tagRemoveFilter}
          {this.state.name} {tagVal}
        </Typography>
        <Typography style={styles.intro}>Affichage des projets utilisant ce tag</Typography>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Prochaine action à effectuer</TableCell>
                <TableCell>Valeur du tag</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.projects.map((n, key) => {
                return (
                  <TableRow key={key}>
                    <TableCell component="th" scope="row">
                      <Link to={`/projects/${n.id}`}>{n.name}</Link>
                    </TableCell>
                    <TableCell>
                      {n.next_action && n.next_action.split('\n').map((item, key) => {
                        return <span key={key}>{item}<br /></span>
                      })}
                    </TableCell>
                    <TableCell>
                      <span onClick={this.handleAddFilter.bind(this, n.pivot && n.pivot.value)}>{(n.pivot && n.pivot.value)}</span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  };
}

export default TagsShow;
