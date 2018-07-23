import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '../layout/Select';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import { DatePicker } from 'material-ui-pickers';

import { getApi, postApi } from '../../utils';

const styles = {
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
  },
  paper: {
    display: 'block',
    marginTop: 30,
    padding: 22,
  },
};

class ProjectsNew extends Component {
  state = {
    clients: [],
    tags: [],
    contacts: [],
    orders: [],
    users: [],

    name: '',
    domain: '',
    client: null,
    contact: null,
    order: null,
    user: null,
    next_action: '',
    end_at: null,
    tag: [],
    url: [],
  };

  handleSubmit() {
    postApi('projects', {
      name: this.state.name,
      domain: this.state.domain,
      client: this.state.client || '',
      contacts: this.state.contact
        ? this.state.contact.split(',').map(i => i.trim()) : '',
      orders: this.state.order
        ? this.state.order.split(',').map(i => i.trim()) : '',
      users: this.state.user
        ? this.state.user.split(',').map(i => i.trim()) : '',
      next_action: this.state.next_action,
      end_at: this.formatDate(this.state.end_at),
      tag: this.state.tag,
      url: this.state.url,
    }).then(() => this.props.history.push('/projects'));
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

  handleDateChange = (date) => {
    this.setState({ end_at: date });
  }

  componentDidMount() {
    getApi('clients').then(res => {
      if (this.isUnmounted) {
        return;
      }
      const clients = [];
      clients.push(...res.map(e => {
        return {
          label: e.name,
          value: e.id,
        };
      }));
      this.setState({
        clients,
      });
    });
    getApi('tags').then(res => {
      if (this.isUnmounted) {
        return;
      }
      const tags = [];
      tags.push(...res.map(e => {
        return {
          label: e.name,
          value: e.id,
        };
      }));
      this.setState({
        tags,
      });
    });
    getApi('sellsy_contacts').then(res => {
      if (this.isUnmounted) {
        return;
      }
      const contacts = [];
      contacts.push(...res.map(e => {
        return {
          label: e.fullName,
          value: e.id,
        };
      }));
      this.setState({
        contacts,
      });
    });
    getApi('sellsy_orders').then(res => {
      if (this.isUnmounted) {
        return;
      }
      const orders = [];
      orders.push(...res.map(e => {
        return {
          label: `${e.thirdname} :: ${e.subject.replace(/<[^>]+>/g, ' ')}`,
          value: e.id,
        };
      }));
      this.setState({
        orders,
      });
    });
    getApi('users').then(res => {
      if (this.isUnmounted) {
        return;
      }
      const users = [];
      users.push(...res.map(e => {
        return {
          label: `${e.firstname} ${e.lastname} (${e.email})`,
          value: e.id,
        };
      }));
      this.setState({
        users,
      });
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  formatDate(date) {
    if (!date) return '';

    let year = date.getFullYear().toString();
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();

    return year + '-' + (month[1] ? month : '0' + month[0])
           + '-' + (day[1] ? day : '0' + day[0]);
  }

  handleAddTag() {
    this.setState({
      tag: [...this.state.tag, {
        id: '',
        value: '',
      }]
    });
  }

  handleAddUrl() {
    this.setState({
      url: [...this.state.url, {
        name: '',
        value: '',
      }]
    });
  }

  handleUpdateArray = (mainprop, key, prop) => event => {
    let newValue;
    if (event && event.target && event.target.value !== undefined) {
      newValue = event.target.value;
    } else {
      newValue = event;
    }
    let main = this.state[mainprop];
    main[key][prop] = newValue;
    this.setState({
      [mainprop]: main,
    });
  }

  handleDeleteArray = (mainprop, key) => {
    const main = this.state[mainprop].filter((_v, k) => {
      return k !== key;
    });

    this.setState({
      [mainprop]: main,
    });
  }

  handleChangeOrder = (mainprop, key, direction = 'up') => {
    const directionCoef = (direction === 'down') ? 1 : -1;
    let main = this.state[mainprop];

    let t = main[key], c = key + directionCoef;
    if (c < 0 || c >= main.length) return;
    main[key] = main[c];
    main[c] = t;

    this.setState({
      [mainprop]: main,
    });
  }

  render() {
    return (
      <div>
        <Typography variant="display1" gutterBottom>
          Créer un nouveau projet
        </Typography>
        <Typography style={styles.intro}>Entrez ici les informations concernant le projet</Typography>
        <FormControl fullWidth style={styles.formControl}>
          <InputLabel htmlFor="project-name">Nom du projet</InputLabel>
          <Input
            id="project-name"
            type="text"
            value={this.state.name}
            onChange={this.handleChange('name')}
          />
        </FormControl>
        <FormControl fullWidth style={styles.formControl}>
          <InputLabel htmlFor="project-domain">Domaine principal</InputLabel>
          <Input
            id="project-domain"
            type="text"
            value={this.state.domain}
            onChange={this.handleChange('domain')}
          />
        </FormControl>

        <TextField
          style={styles.formControl}
          fullWidth
          value={this.state.client}
          onChange={this.handleChange('client')}
          placeholder="Choisissez un client..."
          name="select-client"
          label="Client principal"
          autoComplete="new-password"
          InputLabelProps={{
            shrink: true
          }}
          InputProps={{
            inputComponent: Select,
            inputProps: {
              creatable: false,
              multi: false,
              instanceId: "select-client",
              id: "select-client",
              simpleValue: true,
              options: this.state.clients,
            }
          }}
        />
        <TextField
          style={styles.formControl}
          fullWidth
          value={this.state.contact}
          onChange={this.handleChange('contact')}
          placeholder="Choisissez un ou plusieurs interlocuteurs..."
          name="select-contact"
          label="Interlocuteurs"
          autoComplete="new-password"
          InputLabelProps={{
            shrink: true
          }}
          InputProps={{
            inputComponent: Select,
            inputProps: {
              creatable: false,
              multi: true,
              instanceId: "select-contact",
              id: "select-contact",
              simpleValue: true,
              options: this.state.contacts,
            }
          }}
        />
        <TextField
          style={styles.formControl}
          fullWidth
          value={this.state.order}
          onChange={this.handleChange('order')}
          placeholder="Choisissez une ou plusieurs commandes..."
          name="select-order"
          label="Commandes"
          autoComplete="new-password"
          InputLabelProps={{
            shrink: true
          }}
          InputProps={{
            inputComponent: Select,
            inputProps: {
              creatable: false,
              multi: true,
              instanceId: "select-order",
              id: "select-order",
              simpleValue: true,
              options: this.state.orders,
            }
          }}
        />
        <TextField
          style={styles.formControl}
          fullWidth
          value={this.state.user}
          onChange={this.handleChange('user')}
          placeholder="Choisissez un ou plusieurs utilisateurs..."
          name="select-user"
          label="Utilisateurs affectés"
          autoComplete="new-password"
          InputLabelProps={{
            shrink: true
          }}
          InputProps={{
            inputComponent: Select,
            inputProps: {
              creatable: false,
              multi: true,
              instanceId: "select-user",
              id: "select-user",
              simpleValue: true,
              options: this.state.users,
            }
          }}
        />

        <FormControl fullWidth style={styles.formControl}>
          <TextField
            id="project-next_action"
            label="Prochaine action à effectuer"
            multiline
            rowsMax="10"
            value={this.state.next_action}
            onChange={this.handleChange('next_action')}
            margin="normal"
          />
        </FormControl>
        <FormControl fullWidth style={styles.formControl}>
          <DatePicker
            keyboard
            clearable={true}
            label="Fin du projet souhaité"
            cancelLabel="Annuler"
            invalidDateMessage="Format de date invalide"
            invalidLabel="Inconnu"
            clearLabel="Vider"
            maxDateMessage="La date dépasse la date maximale"
            minDateMessage="La date ne doit pas être avant la date minimale"
            todayLabel="Aujourd'hui"
            showTodayButton={true}
            format="DD/MM/YYYY"
            placeholder="jj/mm/aaaa"
            mask={value => (value ? [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/] : [])}
            value={this.state.end_at}
            onChange={this.handleDateChange}
            disableOpenOnEnter
            animateYearScrolling={false}
          />
        </FormControl>

        <Typography variant="headline" style={styles.formControl}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            style={styles.right}
            onClick={this.handleAddTag.bind(this)}
          >
            <Icon>add</Icon>
            Ajouter
          </Button>
          Tags
        </Typography>

        {this.state.tag.map((val, key) => {
          return <Paper key={key} style={styles.paper}>
            <Button
              size="small"
              disabled={key <= 0}
              onClick={this.handleChangeOrder.bind(this, 'tag', key, 'up')}
            >
              <Icon>keyboard_arrow_up</Icon>
            </Button>
            <Button
              disabled={key >= this.state.tag.length - 1}
              size="small"
              onClick={this.handleChangeOrder.bind(this, 'tag', key, 'down')}
            >
              <Icon>keyboard_arrow_down</Icon>
            </Button>
            <Button
              size="small"
              style={styles.right}
              onClick={this.handleDeleteArray.bind(this, 'tag', key)}
            >
              <Icon>delete</Icon>
            </Button>
            <FormControl fullWidth style={styles.formControl}>
              <TextField
                style={styles.formControl}
                fullWidth
                value={val.id}
                onChange={this.handleUpdateArray('tag', key, 'id')}
                placeholder="Choisissez un tag..."
                name={`project-tag-${key}-id`}
                label="Tag"
                autoComplete="new-password"
                InputLabelProps={{
                  shrink: true
                }}
                InputProps={{
                  inputComponent: Select,
                  inputProps: {
                    creatable: true,
                    multi: false,
                    instanceId: `project-tag-${key}-id`,
                    id: `project-tag-${key}-id`,
                    simpleValue: true,
                    options: this.state.tags,
                  }
                }}
              />
              <TextField
                id={`project-tag-${key}-value`}
                label="Url"
                value={val.value}
                margin="normal"
                onChange={this.handleUpdateArray('tag', key, 'value')}
              />
            </FormControl>
          </Paper>
        })}

        <Typography variant="headline" style={styles.formControl}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            style={styles.right}
            onClick={this.handleAddUrl.bind(this)}
          >
            <Icon>add</Icon>
            Ajouter
          </Button>
          Urls
        </Typography>

        {this.state.url.map((val, key) => {
          return <Paper key={key} style={styles.paper}>
            <Button
              size="small"
              disabled={key <= 0}
              onClick={this.handleChangeOrder.bind(this, 'url', key, 'up')}
              >
              <Icon>keyboard_arrow_up</Icon>
            </Button>
            <Button
              disabled={key >= this.state.url.length - 1}
              size="small"
              onClick={this.handleChangeOrder.bind(this, 'url', key, 'down')}
            >
              <Icon>keyboard_arrow_down</Icon>
            </Button>
            <Button
              size="small"
              style={styles.right}
              onClick={this.handleDeleteArray.bind(this, 'url', key)}
            >
              <Icon>delete</Icon>
            </Button>
            <FormControl fullWidth style={styles.formControl}>
              <TextField
                id={`project-url-${key}-name`}
                label="Nom"
                value={val.name}
                margin="normal"
                onChange={this.handleUpdateArray('url', key, 'name')}
              />
              <TextField
                id={`project-url-${key}-value`}
                label="Url"
                value={val.value}
                margin="normal"
                onChange={this.handleUpdateArray('url', key, 'value')}
              />
            </FormControl>
          </Paper>
        })}

        <Button variant="contained" color="primary" style={styles.submit} onClick={this.handleSubmit.bind(this)}>
          Créer
        </Button>
      </div>
    );
  };
}

export default ProjectsNew;
