import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import { getApi } from '../../utils';

const styles = theme => ({
  intro: {
    paddingBottom: '50px',
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
    flexBasis: '50%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: 15,
    color: '#0000008a',
  },
  simpleList: {
    listStyle: 'none',
    padding: 0,
  },
});

class ClientsShow extends Component {
  state = {
    expanded: null,
    data: {
      id: '',
      name: '',
      contacts: [],
      orders: [],
      subscriptions: [],
    },
  };

  componentDidMount() {
    getApi(`sellsy_clients/${this.props.match.params.clientId}`).then(res => {
      this.setState({
        data: res,
      });
    });
  }

  handleExpanded = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  render() {
    const { classes } = this.props;
    let contacts = null;
    if (this.state.data.contacts.length > 0) {
      const contactsMap = this.state.data.contacts.map(n => {
        return (
          <Card key={n.id} className={classes.contactCard}>
            <CardContent>
              <Typography gutterBottom variant="headline" component="h2">
                {n.fullName}
              </Typography>
              <Typography component="ul" className={classes.simpleList}>
                {n.position ? (<li>{n.position}</li>) : null}
                {n.email ? (<li><a href={`mailto:${n.email}`}>{n.email}</a></li>) : null}
                {n.tel ? (<li><a href={`tel:${n.tel}`}>{n.tel}</a></li>) : null}
                {n.mobile ? (<li><a href={`tel:${n.mobile}`}>{n.mobile}</a></li>) : null}
              </Typography>
            </CardContent>
          </Card>
        );
      });
      contacts = (
        <div>
          <Typography variant="headline">Contacts</Typography>
          <div className={classes.contactCards}>{contactsMap}</div>
        </div>
      );
    }

    let orders = null;
    if (this.state.data.orders.length > 0) {
      const ordersMap = this.state.data.orders.map(n => {
        if (!n.subject) n.subject = '';
        return (
          <ExpansionPanel key={n.id} expanded={this.state.expanded === `panel-orders-${n.id}`} onChange={this.handleExpanded(`panel-orders-${n.id}`)}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>{n.subject.replace(/<[^>]+>/g, '')}</Typography>
              <Typography className={classes.secondaryHeading}>Montant restant...</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                Plus de détails à venir ici...
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        );
      });
      orders = (
        <div>
          <Typography variant="headline" className={classes.partTitle}>Commandes</Typography>
          {ordersMap}
        </div>
      );
    }

    let subscriptions = null;
    if (this.state.data.subscriptions.length > 0) {
      const subscriptionsMap = this.state.data.subscriptions.map(n => {
        if (!n.subject) n.subject = '';
        return (
          <ExpansionPanel key={n.id} expanded={this.state.expanded === `panel-subs-${n.id}`} onChange={this.handleExpanded(`panel-subs-${n.id}`)}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>{n.subject.replace(/<[^>]+>/g, '')}</Typography>
              <Typography className={classes.secondaryHeading} style={{color: n.step_hex}}>
                {n.formatted_dueAmount} TTC
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography component="ul" className={classes.simpleList}>
                <li>
                  <strong>Date : </strong>
                  {n.displayedDate}
                </li>
                <li>
                  <strong>Sujet : </strong>
                  {n.subject.replace(/<[^>]+>/g, '')}
                </li>
                <li>
                  <strong>Statut : </strong>
                  <span style={{ color: n.step_hex }}>{n.step_label}</span>
                </li>
                <li>
                  <strong>Montant total HT : </strong>
                  {n.formatted_totalAmountTaxesFree} HT
                </li>
                <li>
                  <strong>Montant total TTC : </strong>
                  {n.formatted_totalAmount} TTC
                </li>
                <li>
                  <strong>Reste à payer : </strong>
                  {n.formatted_dueAmount} TTC
                </li>
                <li>
                  <strong>Contact : </strong>
                  {n.contactName}
                </li>
                {n.publicLinkShort ? (
                  <li>
                    <strong>Lien vers la facture : </strong>
                    <a href={n.publicLinkShort} target="_blank">
                      {n.publicLinkShort}
                    </a>
                  </li>
                ) : null}
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        );
      });
      subscriptions = (
        <div>
          <Typography variant="headline" className={classes.partTitle}>Factures liées aux abonnements</Typography>
          {subscriptionsMap}
        </div>
      );
    }

    return (
      <div>
        <Typography variant="display1" gutterBottom>
          {this.state.data.name}
        </Typography>
        <Typography className={classes.intro}>Affichage de quelques informations à propos de ce client</Typography>
        {contacts}
        {orders}
        {subscriptions}
      </div>
    );
  };
}

ClientsShow.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(ClientsShow);
