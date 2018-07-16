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
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import LogoutIcon from '@material-ui/icons/PowerSettingsNew';
import DashboardIcon from '@material-ui/icons/Dashboard';
import LockIcon from '@material-ui/icons/Lock';
import UpdatesIcon from '@material-ui/icons/Update';
import DomainIcon from '@material-ui/icons/Domain';
import PeopleIcon from '@material-ui/icons/People';
import AccountIcon from '@material-ui/icons/AccountCircle';

import Users from './users';
import Clients from './clients';
import Roles from './roles';
import Updates from './updates';
import Dashboard from './Dashboard';

import { logout } from '../actions/auth';
import store from '../store';
import constants from '../constants';

import { Route, Switch, Link } from 'react-router-dom';

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
         });
  }

  componentDidMount() {
    if (store.getState().auth.auth.userData.id <= 0) {
      setTimeout(() => {
        this.props.history.push(`/login?redirect=${window.location.pathname}`)
      }, 20);
    }
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
            component={Link}
            to="/"
            button
            onClick={() => this.setState({ mobileOpen: false })}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText inset primary="Tableau de bord" />
          </ListItem>
          <Divider />
          <ListItem
            component={Link}
            to="/clients"
            button
            onClick={() => this.setState({ mobileOpen: false })}
          >
            <ListItemIcon>
              <DomainIcon />
            </ListItemIcon>
            <ListItemText inset primary="Clients" />
          </ListItem>
          <Divider />
          <ListItem
            component={Link}
            to="/"
            button
            onClick={() => this.setState({ mobileOpen: false })}
          >
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText inset primary="Contacts" />
          </ListItem>
          <Divider />
          <ListItem
            component={Link}
            to="/roles"
            button
            onClick={() => this.setState({ mobileOpen: false })}
          >
            <ListItemIcon>
              <LockIcon />
            </ListItemIcon>
            <ListItemText inset primary="Rôles" />
          </ListItem>
          <ListItem
            component={Link}
            to="/users"
            button
            onClick={() => this.setState({ mobileOpen: false })}
          >
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText inset primary="Utilisateurs" />
          </ListItem>
          <ListItem
            component={Link}
            to="/users/me"
            button
            onClick={() => this.setState({ mobileOpen: false })}
          >
            <ListItemIcon>
              <AccountIcon />
            </ListItemIcon>
            <ListItemText inset primary="Mon compte" />
          </ListItem>
          <Divider />
          <ListItem
            component={Link}
            to="/updates"
            button
            onClick={() => this.setState({mobileOpen: false})}
          >
            <ListItemIcon>
              <UpdatesIcon />
            </ListItemIcon>
            <ListItemText inset primary="Mises à jour" />
          </ListItem>
          <Divider />
          <ListItem button onClick={this.handleLogout}>
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
            <Typography variant="title" color="inherit" noWrap>
              Extranet
            </Typography>
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
              <Route path="/roles" component={Roles} />
              <Route path="/updates" component={Updates} />
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
