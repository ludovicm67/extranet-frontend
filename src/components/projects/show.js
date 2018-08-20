import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import { Link } from 'react-router-dom';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import amber from '@material-ui/core/colors/amber';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';

import { getApi, hasPermission } from '../../utils';
import Autolinker from 'autolinker';

import { setErrMsg } from '../../actions/general';
import store from '../../store';

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
    marginBottom: 10,
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
  simpleList: {
    listStyle: 'none',
    padding: 0,
  },
  expansionPanelDetails: {
    display: 'block',
  },
  dateOld: {
    color: amber[500],
  },
});

class ProjectsShow extends Component {
  state = {
    expanded: null,
    invoiceExpanded: null,

    tags: [],
    name: '',
    domain: '',
    client: null,
    users: [],
    orders: [],
    contacts: [],
    next_action: '',
    end_at: null,
    urls: [],
    parent: null,
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

  fetchData(projectId) {
    getApi(`projects/${projectId}`, {
      notFound: true,
    }).then(res => {
      if (this.isUnmounted) {
        return;
      }
      if (res.notFound) {
        this.props.history.push('/projects');
        return;
      }

      const parsedDate = res.end_at && new Date(Date.parse(res.end_at));

      const tags = (res.tags) ? res.tags.map(e => {
        let value = e.pivot.value || '';
        return {
          id: e.pivot.tag_id,
          name: e.name,
          value,
          url: `/tags/${e.pivot.tag_id}/${encodeURIComponent(value)}`,
        }
      }) : [];

      this.setState({
        name: res.name || '',
        domain: res.domain || '',
        client: res.client || '',
        contacts: res.contacts || [],
        orders: res.orders || [],
        users: res.users || [],
        next_action: res.next_action || '',
        end_at: parsedDate || null,
        tags,
        urls: res.urls || [],
        parent: res.parent || null,
      });
    }).catch(e => {
      store.dispatch(setErrMsg(e));
    });
  }

  componentWillReceiveProps(p) {
    this.fetchData(p.match.params.projectId);
  }

  componentDidMount() {
    this.fetchData(this.props.match.params.projectId);
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  formatDate(date) {
    if (!date || date === '') return '';

    let year = date.getFullYear().toString();
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();

    return (day[1] ? day : '0' + day[0]) + '/'
      + (month[1] ? month : '0' + month[0])
      + '/' + year;
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
    if (this.state.contacts.length > 0) {
      const contactsMap = this.state.contacts.map(n => {
        return (
          <Card key={n.id} className={classes.contactCard}>
            <CardContent>
              <Typography gutterBottom variant="headline" component="h2">
                <Link to={`/contacts/${n.id}`}>{n.name}</Link>
              </Typography>
              <Typography component="ul" className={classes.simpleList}>
                {n.type ? (<li>{n.type.name}</li>) : null}
                {n.mail ? (<li><a href={`mailto:${n.mail}`}>{n.mail}</a></li>) : null}
                {n.phone ? (<li><a href={`tel:${n.phone}`}>{n.phone}</a></li>) : null}
                {n.address ? (<li>{n.address}</li>) : null}
                {n.other ? (<li>{n.other}</li>) : null}
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


    let orders = null;
    if (this.state.orders.length > 0) {
      const ordersMap = this.state.orders.map(n => {
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
                {remainingOrderAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {n.currencysymbol} HT
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

    const parsedDate = new Date(Date.parse(this.state.end_at));
    const now = new Date();
    const isPast = parsedDate < now;

    return (
      <div>
        <Typography variant="display1" gutterBottom>
          <Button
            component={Link}
            to={`/projects/${this.props.match.params.projectId}/identifiers`}
            variant="contained"
            color="primary"
            className={classes.right}
          >
            <Icon>vpn_key</Icon>
            Identifiants
          </Button>
          <Button
            component={Link}
            to={`/projects/${this.props.match.params.projectId}/wiki`}
            variant="contained"
            color="primary"
            className={classes.right}
          >
            <Icon>import_contacts</Icon>
            Wiki
          </Button>
          {hasPermission('projects', 'edit', this.props.match.params.projectId) && (
            <Button
              component={Link}
              to={`/projects/${this.props.match.params.projectId}/edit`}
              variant="contained"
              color="primary"
              className={classes.right}
            >
              <Icon>edit</Icon>
              Modifier
            </Button>
          )}
          {this.state.name}
        </Typography>
        <Typography className={classes.intro}>Affichages d'informations concernant le projet</Typography>

        {this.state.tags &&
          this.state.tags.map((v, k) => {
            let content = v.name;
            if (v.value) content = `${content}: ${v.value}`;
            return <Chip key={k} className={classes.tag} component={Link} to={v.url} label={content} />
          })
        }

        {this.state.domain &&
          <Typography>
            <strong>Domaine principal : </strong>
            <span dangerouslySetInnerHTML={{__html: Autolinker.link(this.state.domain)}} />
          </Typography>
        }

        {this.state.parent &&
          <div>
            <Typography>
              <strong>Ce projet a pour parent : </strong>
              <Link to={`/projects/${this.state.parent.id}`}>{this.state.parent.name}</Link>
            </Typography>
          </div>
        }

        {this.state.end_at &&
          <Typography className={isPast ? classes.dateOld : null}>
            <strong>Fin de projet souhaité : </strong>
            {this.formatDate(this.state.end_at)}
          </Typography>
        }

        {this.state.client &&
          <div>
            <Typography variant="headline" className={classes.formControl}>
              Client principal
            </Typography>
            <Typography>
            <strong>Le client principal de ce projet est : </strong>
              <Link to={`/clients/${this.state.client.id}`}>{this.state.client.fullName}</Link>
            </Typography>
          </div>
        }

        {contacts}

        {this.state.users &&
          <div>
            <Typography variant="headline" className={classes.formControl}>
              Utilisateurs assignés
            </Typography>
            <Typography component="ul">
              {this.state.users.map((item, key) => {
                let name = `${item.firstname} ${item.lastname} (${item.email})`;
                return (<li key={key}>
                  <Link to={`/users/${item.id}`}>{name}</Link>
                </li>)
              })}
            </Typography>
          </div>
        }

        {this.state.next_action &&
          <div>
            <Typography variant="headline" className={classes.formControl}>
              Prochaine action à effectuer
            </Typography>
            <Typography>
              {this.state.next_action && this.state.next_action.split('\n').map((item, key) => {
                return <span key={key}>{item}<br /></span>
              })}
            </Typography>
          </div>
        }

        {orders}

        {this.state.urls &&
          <div>
            <Typography variant="headline" className={classes.formControl}>
              URLs
            </Typography>
            <Typography component="ul">
              {this.state.urls.map((item, key) => {
                let name = item.name || 'URL';
              return <li key={key}>{name} : <span dangerouslySetInnerHTML={{ __html: Autolinker.link(item.value) }} /></li>
              })}
            </Typography>
          </div>
        }
      </div>
    );
  };
}

ProjectsShow.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(ProjectsShow);
