import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';

import { getApi } from '../../utils';

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
  line: {
    display: 'block',
  },
};

class ContactShow extends Component {
  state = {
    id: this.props.match.params.contactId,
    name: '',
    mail: '',
    other: '',
    type: 'Aucun',
  };

  componentDidMount() {
    getApi(`contacts/${this.state.id}`).then(res => {
      if (this.isUnmounted) {
        return;
      }
      this.setState({
        name: res.name || '',
        mail: res.mail || '',
        other: res.other || '',
        type: (res.type && res.type.name) || 'Aucun',
      });
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  render() {
    let other = this.state.other.split('\n').map((item, i) => <span key={i} style={styles.line}>{item}</span>);
    return (
      <div>
        <Typography variant="display1" gutterBottom>
          {this.state.name}
        </Typography>
        <Typography style={styles.intro}>Affichage des informations à propos de ce contact</Typography>
        <Typography>
          <strong>Type : </strong>
          {this.state.type}
        </Typography>
        <Typography>
          <strong>Adresse mail : </strong>
          <a href={`mailto:${this.state.mail}`}>{this.state.mail}</a>
        </Typography>
        <Typography>
          <strong>Autres informations : </strong>
          {other}
        </Typography>
      </div>
    );
  };
}

export default ContactShow;
