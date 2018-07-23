import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '../layout/Select';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import { DatePicker } from 'material-ui-pickers';

import { getApi } from '../../utils';

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

class ProjectsShow extends Component {
  state = {
    id: this.props.match.params.projectId,

    clients: [],
    tags: [],
    contacts: [],
    orders: [],
    users: [],

    name: '',
    domain: '',
    client: '',
    contact: '',
    order: '',
    user: '',
    next_action: '',
    end_at: null,
    tag: [],
    url: [],
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

  componentDidMount() {
    getApi(`projects/${this.state.id}`).then(res => {
      if (this.isUnmounted) {
        return;
      }
      const parsedDate = res.end_at && new Date(Date.parse(res.end_at));

      const contacts = (res.contacts) ? res.contacts.map(e => e.id).join(',') : '';
      const orders = (res.orders) ? res.orders.map(e => e.id).join(',') : '';
      const users = (res.users) ? res.users.map(e => e.id).join(',') : '';
      const tags = (res.tags) ? res.tags.map(e => ({
        id: e.pivot.tag_id,
        value: e.pivot.value || '',
      })) : [];

      this.setState({
        name: res.name || '',
        domain: res.domain || '',
        client: res.client_id || '',
        contact: contacts,
        order: orders,
        user: users,
        next_action: res.next_action || '',
        end_at: parsedDate || null,
        tag: tags,
        url: res.urls || [],
      });
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  formatDate(date) {
    if (!date || date === '') return '';

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
          {this.state.name}
        </Typography>
        <Typography style={styles.intro}>Affichages d'informations concernant le projet</Typography>

        {this.state.domain &&
          <Typography>
            <strong>Domaine principal : </strong>
            {this.state.domain}
          </Typography>
        }

        {this.state.client &&
          <Typography>
            <strong>Client : </strong>
            {this.state.client}
          </Typography>
        }

        {this.state.next_action &&
          <Typography>
            <strong>Prochaine action à effectuer : </strong><br />
            {this.state.next_action && this.state.next_action.split('\n').map((item, key) => {
              return <span key={key}>{item}<br /></span>
            })}
          </Typography>
        }

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
                label="Valeur du tag (peut être laissé vide)"
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
                label="Nom de l'URL"
                value={val.name || ''}
                margin="normal"
                onChange={this.handleUpdateArray('url', key, 'name')}
              />
              <TextField
                id={`project-url-${key}-value`}
                label="URL"
                value={val.value || ''}
                margin="normal"
                onChange={this.handleUpdateArray('url', key, 'value')}
              />
            </FormControl>
          </Paper>
        })}
      </div>
    );
  };
}

export default ProjectsShow;
