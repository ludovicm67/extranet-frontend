import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { getApi, urlApi } from '../utils';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Icon from '@material-ui/core/Icon';
import { Link } from 'react-router-dom';
import Autolinker from 'autolinker';
import store from '../store';

const styles = _theme => ({
  right: {
    float: 'right',
    margin: 5,
  },
});


class Export extends Component {
  state = {
    type: this.props.match.params.typeId || '',
    tag: this.props.match.params.tagId || '',
    value: this.props.match.params.tagValue || '',

    data: [],
  };

  fetchList() {
    getApi(`contacts/export?type=${encodeURIComponent(this.state.type)}&tag=${encodeURIComponent(this.state.tag)}&value=${encodeURIComponent(this.state.value)}`).then(res => {
      if (this.isUnmounted) {
        return;
      }

      this.setState({
        data: res,
      });
    });
  }

  componentDidMount() {
    this.fetchList();
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  render() {
    const { classes } = this.props;
    const token = store.getState().auth.auth.token;

    return (
      <div>
        <Typography variant="display1" gutterBottom>
          <Button
            component="a"
            href={urlApi(`contacts/csv?type=${encodeURIComponent(this.state.type)}&tag=${encodeURIComponent(this.state.tag)}&value=${encodeURIComponent(this.state.value)}&token=${token}`)}
            target="_blank"
            variant="contained"
            color="primary"
            className={classes.right}
          >
            <Icon>import_export</Icon>
            Exporter en CSV
          </Button>
          Exporter des contacts
        </Typography>
        <Typography className={classes.intro}>Exportez des contacts en filtrant sur le type et par tags de projets sur lesquels ils sont affectés ({this.state.data.length})</Typography>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Adresse mail</TableCell>
                <TableCell>Téléphone</TableCell>
                <TableCell>Projet</TableCell>
                <TableCell>Domaine</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.data.map(n => {
                return (
                  <TableRow key={n.key}>
                    <TableCell component="th" scope="row">
                      <Link to={`/contacts/${n.id}`}>{n.name}</Link>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {n.type}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <a href={`mailto:${n.mail}`}>{n.mail}</a>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <a href={`tel:${n.phone}`}>{n.phone}</a>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Link to={`/projects/${n.project_id}`}>{n.project_name}</Link>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <span dangerouslySetInnerHTML={{ __html: Autolinker.link(n.project_domain) }} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}

Export.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Export);
