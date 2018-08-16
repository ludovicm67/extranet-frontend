import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { getApi, hasPermission, urlApi } from '../../utils';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from "@material-ui/core/TextField";
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import store from '../../store';

const styles = _theme => ({
  intro: {
    paddingBottom: '20px',
  },
  submit: {
    marginTop: '42px',
    marginRight: 10,
  },
  formControl: {
    marginTop: 20,
  },
  paper: {
    display: 'block',
    marginTop: 30,
    padding: 22,
  },
});

class PdfEdit extends Component {
  state = {
    month: this.props.match.params.month,
    year: this.props.match.params.year,

    data: {
      name: '',
      period: '',
      lines: [],
    },
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

  componentDidMount() {
    getApi(`pdf/edit?year=${this.state.year}&month=${this.state.month}`, {
      name: '',
      period: '',
      lines: [],
    }).then(res => {
      if (this.isUnmounted) return;
      this.setState({data: res});
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  handleChangeName(val) {
    let data = this.state.data;
    data.name = val.target.value;
    this.setState({
      data,
    });
  }

  handleChangePeriod(val) {
    let data = this.state.data;
    data.period = val.target.value;
    this.setState({
      data,
    });
  }

  handleUpdateArray = (key, prop) => event => {
    let data = this.state.data;
    data.lines[key][prop] = event.target.value;
    this.setState({
      data,
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <form action={urlApi(`pdf/edit?token=${store.getState().auth.auth.token}`)} method="post" target="_blank">
        <Typography variant="display1" gutterBottom>
          Modifier un PDF comptable
        </Typography>
        <Typography className={classes.intro}>Éditez un pdf pour effectuer quelques ajustement</Typography>

        <FormControl fullWidth className={classes.formControl}>
          <InputLabel htmlFor="form-name">Nom</InputLabel>
          <Input
            id="form-name"
            name="name"
            type="text"
            value={this.state.data.name}
            onChange={this.handleChangeName.bind(this)}
          />
        </FormControl>
        <FormControl fullWidth className={classes.formControl}>
          <InputLabel htmlFor="form-period">Période</InputLabel>
          <Input
            id="form-period"
            name="period"
            type="text"
            value={this.state.data.period}
            onChange={this.handleChangePeriod.bind(this)}
          />
        </FormControl>


        {this.state.data.lines.map((val, key) => {
          return (
            <Paper key={key} className={classes.paper}>
              <FormControl fullWidth className={classes.formControl}>
                <TextField
                  id={`line-${key}-name`}
                  label="Nom de la personne"
                  value={val.name || ''}
                  margin="normal"
                  onChange={this.handleUpdateArray(key, 'name')}
                  name={`lines[${key}][name]`}
                />

                <TextField
                  id={`line-${key}-contract`}
                  label="Contrat"
                  value={val.contract || ''}
                  margin="normal"
                  onChange={this.handleUpdateArray(key, 'contract')}
                  name={`lines[${key}][contract]`}
                />

                <TextField
                  id={`line-${key}-overtime`}
                  label="Heures supplémentaires (heures)"
                  value={val.overtime || ''}
                  margin="normal"
                  onChange={this.handleUpdateArray(key, 'overtime')}
                  name={`lines[${key}][overtime]`}
                  type="number"
                  inputProps={{
                    min: 0,
                    step: 1,
                  }}
                />

                <TextField
                  id={`line-${key}-conges`}
                  label="Congés (jours)"
                  value={val.conges || ''}
                  margin="normal"
                  onChange={this.handleUpdateArray(key, 'conges')}
                  name={`lines[${key}][conges]`}
                  type="number"
                  inputProps={{
                    min: 0,
                    step: .5,
                  }}
                />

                <TextField
                  id={`line-${key}-maladie`}
                  label="Maladie (jours)"
                  value={val.maladie || ''}
                  margin="normal"
                  onChange={this.handleUpdateArray(key, 'maladie')}
                  name={`lines[${key}][maladie]`}
                  type="number"
                  inputProps={{
                    min: 0,
                    step: .5,
                  }}
                />

                <TextField
                  id={`line-${key}-autre`}
                  label="Autre (jours)"
                  value={val.autre || ''}
                  margin="normal"
                  onChange={this.handleUpdateArray(key, 'autre')}
                  name={`lines[${key}][autre]`}
                  type="number"
                  inputProps={{
                    min: 0,
                    step: .5,
                  }}
                />

                <TextField
                  id={`line-${key}-transports`}
                  label="Frais de transports (€)"
                  value={val.transports || ''}
                  margin="normal"
                  onChange={this.handleUpdateArray(key, 'transports')}
                  name={`lines[${key}][transports]`}
                  type="number"
                  inputProps={{
                    min: 0,
                    step: .01,
                  }}
                />

                <TextField
                  id={`line-${key}-expenses`}
                  label="Dépenses (€)"
                  value={val.expenses || ''}
                  margin="normal"
                  onChange={this.handleUpdateArray(key, 'expenses')}
                  name={`lines[${key}][expenses]`}
                  type="number"
                  inputProps={{
                    min: 0,
                    step: .01,
                  }}
                />

                <TextField
                  id={`line-${key}-details`}
                  label="Observations"
                  value={val.details || ''}
                  margin="normal"
                  multiline
                  rowsMax="10"
                  onChange={this.handleUpdateArray(key, 'details')}
                  name={`lines[${key}][details]`}
                />
              </FormControl>
            </Paper>
          )
        })}

        {hasPermission('pdf', 'edit') && (
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Générer le pdf
          </Button>
        )}

      </form>
    );
  }
}

PdfEdit.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(PdfEdit);
