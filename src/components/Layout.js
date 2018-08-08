import axios from 'axios';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import LogoutIcon from '@material-ui/icons/PowerSettingsNew';
import DashboardIcon from '@material-ui/icons/Dashboard';
import UpdatesIcon from '@material-ui/icons/Update';
import DomainIcon from '@material-ui/icons/Domain';
import PeopleIcon from '@material-ui/icons/People';
import AccountIcon from '@material-ui/icons/AccountCircle';
import WorkIcon from '@material-ui/icons/Work';

import Users from './users';
import Clients from './clients';
import Contacts from './contacts';
import Roles from './roles';
import Types from './types';
import Teams from './teams';
import Identifiers from './identifiers';
import Tags from './tags';
import Updates from './updates';
import Dashboard from './Dashboard';
import Projects from './projects';
import Teamview from './Teamview';
import Contracts from './contracts';
import Requests from './requests';
import Overtime from './Overtime';
import Documents from './Documents';
import PdfCompta from './PdfCompta';
import Export from './Export';
import Search from './Search';

import { logout } from '../actions/auth';
import store from '../store';
import constants from '../constants';

import { Route, Switch, Link, NavLink } from 'react-router-dom';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'auto',
    position: 'relative',
    display: 'flex',
    width: '100%',
    minHeight: '100vh',
  },
  flex: {
    flexGrow: 1,
  },
  appBar: {
    position: 'fixed',
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    [theme.breakpoints.up('md')]: {
      marginLeft: drawerWidth,
    },
  },
});

class Layout extends React.Component {
  state = {
    mobileOpen: false,
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  handleLogout() {
    axios.get(`${constants.API_ENDPOINT}/auth/logout?token=${store.getState().auth.auth.token}`)
         .finally(() => {
           store.dispatch(logout());
           this.props.history.push('/login');
         });
  }

  render() {
    const { classes, theme } = this.props;

    const drawer = (
      <div>
        <div className={classes.toolbar} />
        <List style={{
          marginTop: '-8px',
        }}>
          <Divider />
          <ListItem
            component={NavLink}
            to="/"
            button
            activeClassName="activeNavLink"
            exact
            onClick={() => this.setState({ mobileOpen: false })}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText inset primary="Tableau de bord" />
          </ListItem>
          <Divider />
          <ListItem
            component={NavLink}
            to="/teamview"
            button
            activeClassName="activeNavLink"
            exact
            onClick={() => this.setState({ mobileOpen: false })}
          >
            <ListItemIcon>
              <Icon>today</Icon>
            </ListItemIcon>
            <ListItemText inset primary="Vue d'équipe" />
          </ListItem>
          <ListItem
            component={NavLink}
            to="/requests"
            button
            activeClassName="activeNavLink"
            exact
            onClick={() => this.setState({ mobileOpen: false })}
          >
            <ListItemIcon>
              <Icon>live_help</Icon>
            </ListItemIcon>
            <ListItemText inset primary="Demandes" />
          </ListItem>
          <Divider />
          <ListItem
            component={NavLink}
            to="/clients"
            button
            activeClassName="activeNavLink"
            exact
            onClick={() => this.setState({ mobileOpen: false })}
          >
            <ListItemIcon>
              <DomainIcon />
            </ListItemIcon>
            <ListItemText inset primary="Clients" />
          </ListItem>
          <Divider />
          <ListItem
            component={NavLink}
            to="/projects"
            button
            activeClassName="activeNavLink"
            exact
            onClick={() => this.setState({ mobileOpen: false })}
          >
            <ListItemIcon>
              <WorkIcon />
            </ListItemIcon>
            <ListItemText inset primary="Projets" />
          </ListItem>
          <Divider />
          <ListItem
            component={NavLink}
            to="/contacts"
            button
            activeClassName="activeNavLink"
            exact
            onClick={() => this.setState({ mobileOpen: false })}
          >
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText inset primary="Contacts" />
          </ListItem>
          <Divider />
          <ListItem
            component={NavLink}
            to="/users"
            button
            activeClassName="activeNavLink"
            exact
            onClick={() => this.setState({ mobileOpen: false })}
          >
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText inset primary="Utilisateurs" />
          </ListItem>
          <ListItem
            component={NavLink}
            to="/users/me"
            button
            activeClassName="activeNavLink"
            exact
            onClick={() => this.setState({ mobileOpen: false })}
          >
            <ListItemIcon>
              <AccountIcon />
            </ListItemIcon>
            <ListItemText inset primary="Mon compte" />
          </ListItem>
          <Divider />
          <ListItem
            component={NavLink}
            to="/updates"
            button
            activeClassName="activeNavLink"
            exact
            onClick={() => this.setState({mobileOpen: false})}
          >
            <ListItemIcon>
              <UpdatesIcon />
            </ListItemIcon>
            <ListItemText inset primary="Mises à jour" />
          </ListItem>
          <Divider />
          <ListItem button onClick={this.handleLogout.bind(this)}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText inset primary="Déconnexion" />
          </ListItem>
          <Divider />
        </List>
      </div>
    );

    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.navIconHide}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" noWrap className={classes.flex}>
              Extranet
            </Typography>
            <IconButton component={Link} to="/search" color="inherit">
              <Icon>search</Icon>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Hidden mdUp>
          <SwipeableDrawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={this.state.mobileOpen}
            onOpen={() => this.setState({ mobileOpen: true })}
            onClose={this.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </SwipeableDrawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <main className={classes.content}>
          <div className={classes.toolbar} />
            <Switch>
              <Route path="/users" component={Users} />
              <Route path="/clients" component={Clients} />
              <Route path="/contacts" component={Contacts} />
              <Route path="/roles" component={Roles} />
              <Route path="/types" component={Types} />
              <Route path="/teams" component={Teams} />
              <Route path="/identifiers" component={Identifiers} />
              <Route path="/tags" component={Tags} />
              <Route path="/updates" component={Updates} />
              <Route path="/project_identifier" component={Projects} />
              <Route path="/projects" component={Projects} />
              <Route path="/teamview" component={Teamview} />
              <Route path="/overtime/:userId" component={Overtime} />
              <Route path="/documents/:userId" component={Documents} />
              <Route path="/documents" component={Documents} />
              <Route path="/contracts" component={Contracts} />
              <Route path="/leave" component={Requests} />
              <Route path="/expenses" component={Requests} />
              <Route path="/requests" component={Requests} />
              <Route path="/export/:typeId/:tagId/:tagValue" component={Export} />
              <Route path="/export/:typeId/:tagId" component={Export} />
              <Route path="/export/:typeId" component={Export} />
              <Route path="/export" component={Export} />
              <Route path="/search" component={Search} />
              <Route path="/pdf/compta" component={PdfCompta} />
              <Route path="/" component={Dashboard} />
            </Switch>
        </main>
      </div>
    );
  }
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Layout);
