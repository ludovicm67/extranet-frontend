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
import { Link } from 'react-router-dom';

import { getApi } from '../../utils';

import { setErrMsg } from '../../actions/general';
import store from '../../store';

const styles = theme => ({
  intro: {
    paddingBottom: '10px',
  },
  contactCards: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'flex-start',
  },
  projectCards: {
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
  projectCard: {
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
  simpleList: {
    listStyle: 'none',
    padding: 0,
  },
  expansionPanelDetails: {
    display: 'block',
  },
});

class ClientsShow extends Component {
  state = {
    expanded: null,
    invoiceExpanded: null,
    data: {
      id: '',
      name: '',
      contacts: [],
      orders: [],
      subscriptions: [],
      projects: [],
    },
  };

  componentDidMount() {
    getApi(`sellsy_clients/${this.props.match.params.clientId}`, {
      notFound: true,
    }).then(res => {
      if (this.isUnmounted) {
        return;
      }
      if (res.notFound) {
        this.props.history.push('/clients');
      } else {
        this.setState({
          data: res,
        });
      }
    }).catch(e => {
      store.dispatch(setErrMsg(e));
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  handleExpanded = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  handleInvoiceExpanded = panel => (event, invoiceExpanded) => {
    this.setState({
      invoiceExpanded: invoiceExpanded ? panel : false,
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
          <Typography variant="headline" className={classes.partTitle}>Contacts</Typography>
          <div className={classes.contactCards}>{contactsMap}</div>
        </div>
      );
    }

    let projects = null;
    if (this.state.data.projects.length > 0) {
      const projectsMap = this.state.data.projects.map(n => {
        return (
          <Link to={`/projects/${n.id}`} key={n.id} className={classes.projectCard}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="headline" component="h2">
                  {n.name}
                </Typography>
                <Typography component="ul" className={classes.simpleList}>
                  {n.domain ? (<li>{n.domain}</li>) : null}
                </Typography>
              </CardContent>
            </Card>
          </Link>
        );
      });
      projects = (
        <div>
          <Typography variant="headline" className={classes.partTitle}>Projets</Typography>
          <div className={classes.projectCards}>{projectsMap}</div>
        </div>
      );
    }

    let orders = null;
    if (this.state.data.orders.length > 0) {
      const ordersMap = this.state.data.orders.map(n => {
        if (!n.subject) n.subject = '';
        let remainingOrderAmount = n.invoices.reduce((p, c) => {
          return p - parseFloat(c.totalAmountTaxesFree);
        }, parseFloat(n.totalAmountTaxesFree));
        let remainingDueAmount = n.invoices.reduce((p, c) => {
          return p + parseFloat(c.dueAmount);
        }, .0);

        // just to prevent strange behaviors
        if (remainingOrderAmount < 0) remainingOrderAmount = 0;
        if (remainingDueAmount < 0) remainingDueAmount = 0;

        let invoices = null;
        if (n.invoices.length > 0) {
          const invoicesMap = n.invoices.map(n => {
            if (!n.subject) n.subject = '';
            return (
              <ExpansionPanel
                key={n.id}
                expanded={this.state.invoiceExpanded === `panel-invoice-${n.id}`}
                onChange={this.handleInvoiceExpanded(`panel-invoice-${n.id}`)}
              >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>{n.subject.replace(/<[^>]+>/g, ' ')}</Typography>
                  <Typography className={classes.secondaryHeading} style={{ color: n.step_hex }}>
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
                      {n.subject.replace(/<[^>]+>/g, ' ')}
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
          invoices = (
            <div>
              <Typography variant="subheading" className={classes.partTitle}><strong>Factures associées :</strong></Typography>
              {invoicesMap}
            </div>
          );
        }

        return (
          <ExpansionPanel key={n.id} expanded={this.state.expanded === `panel-orders-${n.id}`} onChange={this.handleExpanded(`panel-orders-${n.id}`)}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>{n.subject.replace(/<[^>]+>/g, ' ')}</Typography>
              <Typography className={classes.secondaryHeading} style={{ color: n.step_hex }}>
                {remainingOrderAmount.toLocaleString(undefined, {minimumFractionDigits: 2})} {n.currencysymbol} HT
                {remainingDueAmount > .0 ? (
                  <span>
                    + {remainingDueAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {n.currencysymbol} TTC
                    en attente de paiement
                  </span>
                ) : null}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.expansionPanelDetails}>
              <Typography component="ul" className={classes.simpleList}>
                <li>
                  <strong>Date : </strong>
                  {n.displayedDate}
                </li>
                <li>
                  <strong>Client : </strong>
                  {n.thirdname}
                </li>
                <li>
                  <strong>Sujet : </strong>
                  {n.subject.replace(/<[^>]+>/g, ' ')}
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
                  <strong>Contact : </strong>
                  {n.contactName}
                </li>
                {n.publicLinkShort ? (
                  <li>
                    <strong>Lien vers le bon de commande : </strong>
                    <a href={n.publicLinkShort} target="_blank">
                      {n.publicLinkShort}
                    </a>
                  </li>
                ) : null}
              </Typography>
              {invoices}
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
              <Typography className={classes.heading}>{n.subject.replace(/<[^>]+>/g, ' ')}</Typography>
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
                  {n.subject.replace(/<[^>]+>/g, ' ')}
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
        {projects}
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
