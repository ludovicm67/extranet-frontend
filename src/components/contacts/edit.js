import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from "@material-ui/core/TextField";
import FormControl from '@material-ui/core/FormControl';
import Select from '../layout/Select';

import { getApi, putApi } from '../../utils';

import { setErrMsg } from '../../actions/general';
import store from '../../store';

const styles = {
  intro: {
    paddingBottom: '20px',
  },
  submit: {
    marginTop: '42px',
  },
  formControl: {
    marginTop: '20px',
  },
};

class ContactsEdit extends Component {
  state = {
    id: this.props.match.params.contactId,
    types: [],
    name: '',
    typeId: '',
    mail: '',
    phone: '',
    address: '',
    other: '',
  };

  componentDidMount() {
    getApi('types').then(res => {
      if (this.isUnmounted) {
        return;
      }
      const types = [
        {
          label: 'Aucun type',
          value: 0,
        }
      ];
      types.push(...res.map(e => {
        return {
          label: e.name,
          value: e.id,
        };
      }));
      this.setState({
        types,
      });
    }).catch(e => {
      store.dispatch(setErrMsg(e));
    });
    getApi(`contacts/${this.state.id}`).then(res => {
      if (this.isUnmounted) {
        return;
      }
      this.setState({
        name: res.name,
        typeId: res.type_id || 0,
        mail: res.mail,
        phone: res.phone,
        address: res.address,
        other: res.other,
      });
    }).catch(e => {
      store.dispatch(setErrMsg(e));
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  handleSubmit() {
    putApi(`contacts/${this.state.id}`, {
      name: this.state.name,
      type_id: this.state.typeId || 0,
      mail: this.state.mail,
      phone: this.state.phone,
      address: this.state.address,
      other: this.state.other,
    }).then(() => this.props.history.push('/contacts')).catch(e => {
      store.dispatch(setErrMsg(e));
    });
  }

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

  render() {
    return (
      <div>
        <Typography variant="display1" gutterBottom>
          Modifier un contact
        </Typography>
        <Typography style={styles.intro}>Entrez ici les informations concernant le contact</Typography>
        <FormControl fullWidth style={styles.formControl}>
          <InputLabel htmlFor="contact-name">Nom</InputLabel>
          <Input
            id="contact-name"
            type="text"
            value={this.state.name}
            onChange={this.handleChange('name')}
            autoComplete="new-password"
          />
        </FormControl>
        <TextField
          style={styles.formControl}
          fullWidth
          value={this.state.typeId}
          onChange={this.handleChange('typeId')}
          placeholder="Choisissez le type de contact..."
          name="select-type"
          label="Type de contact"
          autoComplete="new-password"
          InputLabelProps={{
            shrink: true
          }}
          InputProps={{
            inputComponent: Select,
            inputProps: {
              creatable: true,
              multi: false,
              instanceId: "select-type",
              id: "select-type",
              simpleValue: true,
              options: this.state.types,
            }
          }}
        />
        <FormControl fullWidth style={styles.formControl}>
          <InputLabel htmlFor="contact-mail">Adresse mail</InputLabel>
          <Input
            id="contact-mail"
            type="email"
            value={this.state.mail}
            onChange={this.handleChange('mail')}
            autoComplete="new-password"
          />
        </FormControl>
        <FormControl fullWidth style={styles.formControl}>
          <InputLabel htmlFor="contact-phone">Téléphone</InputLabel>
          <Input
            id="contact-phone"
            type="tel"
            value={this.state.phone}
            onChange={this.handleChange('phone')}
            autoComplete="new-password"
          />
        </FormControl>
        <FormControl fullWidth style={styles.formControl}>
          <InputLabel htmlFor="contact-address">Adresse</InputLabel>
          <Input
            id="contact-address"
            type="text"
            value={this.state.address}
            onChange={this.handleChange('address')}
            autoComplete="new-password"
          />
        </FormControl>
        <FormControl fullWidth style={styles.formControl}>
          <TextField
            id="contact-other"
            label="Autres informations"
            multiline
            rowsMax="10"
            value={this.state.other}
            onChange={this.handleChange('other')}
            margin="normal"
          />
        </FormControl>

        <Button variant="contained" color="primary" style={styles.submit} onClick={this.handleSubmit.bind(this)}>
          Modifier
        </Button>
      </div>
    );
  };
}

export default ContactsEdit;
