import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';

import { getApi, deleteApi } from '../../utils';

const styles = theme => ({
  intro: {
    paddingBottom: 20,
  },
  submit: {
    marginTop: '42px',
  },
  formControl: {
    marginTop: 20,
  },
  right: {
    float: 'right',
    marginLeft: 10,
  },
  paper: {
    display: 'block',
    marginTop: 30,
    padding: 22,
  },
  tag: {
    cursor: 'pointer',
    marginTop: 0,
    marginBottom: 20,
    marginRight: 12,
    marginLeft: 0,
  },
  contactCards: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'flex-start',
  },
  contactCard: {
    width: 'calc(50% - 10px)',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    marginTop: '15px',
  },
  partTitle: {
    marginTop: 36,
  },
  heading: {
    fontSize: 15,
    flexBasis: '55%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: 15,
    color: '#0000008a',
  },
});

class ProjectsShow extends Component {
  state = {
    id: this.props.match.params.projectId,

    name: '',
    identifiers: [],
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

  handleDateChange = (date) => {
    this.setState({ end_at: date });
  }

  handleDelete(ressource) {
    deleteApi(ressource).then(() => {
      this.fetchList();
    });
  }

  componentDidMount() {
    getApi(`projects/${this.state.id}/identifiers`, {
      notFound: true,
    }).then(res => {
      if (this.isUnmounted) {
        return;
      }
      if (res.notFound) {
        this.props.history.push('/projects');
        return;
      }

      this.setState({
        name: res.name || '',
        identifiers: res.identifiers || [],
      });
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Typography variant="display1" gutterBottom>
          <Button
            component={Link}
            to={`/projects/${this.state.id}/identifiers/new`}
            variant="contained"
            color="primary"
            className={classes.right}
          >
            <Icon>add</Icon>
            Ajouter
          </Button>
          <Button
            component={Link}
            to={`/projects/${this.state.id}`}
            variant="contained"
            color="primary"
            className={classes.right}
          >
            <Icon>arrow_back</Icon>
            Projet
          </Button>
          {this.state.name}
        </Typography>
        <Typography className={classes.intro}>Les différents identifiants pour le projet</Typography>

        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Valeur</TableCell>
                <TableCell>Confidentiel ?</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.identifiers.map((n, _key) => {
                return (
                  <TableRow key={n.id}>
                    <TableCell component="th" scope="row">
                      {n.type && n.type.name}
                    </TableCell>
                    <TableCell>
                      {n.value && n.value.split('\n').map((item, key) => {
                        return <span key={key}>{item}<br /></span>
                      })}
                    </TableCell>
                    <TableCell>
                      {parseInt(n.confidential, 10) ? 'Oui' : 'Non'}
                    </TableCell>
                    <TableCell>
                      <IconButton component={Link} to={`/projects/${n.id}/edit`}>
                        <Icon>edit</Icon>
                      </IconButton>
                      <IconButton onClick={this.handleDelete.bind(this, `projects/${n.id}`)}>
                        <Icon>delete</Icon>
                      </IconButton>
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

ProjectsShow.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(ProjectsShow);
