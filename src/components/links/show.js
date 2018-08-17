import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

import { getApi, deleteApi, hasPermission } from '../../utils';
import { Link } from 'react-router-dom';

import { setErrMsg } from '../../actions/general';
import store from '../../store';

const styles = theme => ({
  right: {
    float: 'right',
    marginLeft: 10,
    marginBottom: 10,
  },

  intro: {
    paddingBottom: '50px',
  },

  card: {
    marginBottom: 32,
  },

  details: {
    display: 'flex',
    flexDirection: 'column',
  },

  media: {
    height: 0,
    paddingTop: '56.25%',
    [theme.breakpoints.up('md')]: {
      float: 'left',
      maxWidth: 150,
      maxHeight: 150,
      width: 150,
      paddingTop: 150,
    },
  },

  btn: {
    margin: 10,
  },
});

class LinksShow extends Component {
  state = {
    id: this.props.match.params.categoryId || 'all',

    name: 'Tous les liens',
    data: [],
  };

  fetchList() {
    getApi(`links_cat/${this.state.id}`).then(res => {
      if (this.isUnmounted) {
        return;
      }
      let name = 'Tous les liens';
      if (res.name && res.name !== 'all') name = res.name;
      this.setState({
        data: res.links || [],
        name,
      });
    }).catch(e => {
      store.dispatch(setErrMsg(e));
    });
  }

  componentDidMount() {
    this.fetchList();
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  handleDelete(ressource) {
    deleteApi(ressource).then(() => {
      this.fetchList();
    }).catch(e => {
      store.dispatch(setErrMsg(e));
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Typography variant="display1" gutterBottom>
          <Button
            component={Link}
            to="/link_categories"
            variant="contained"
            color="primary"
            className={classes.right}
          >
            <Icon>bookmarks</Icon>
            Catégories
          </Button>
          {hasPermission('links', 'add') && (
            <Button
              component={Link}
              to="/links/new"
              variant="contained"
              color="primary"
              className={classes.right}
            >
              <Icon>add</Icon>
              Ajouter
            </Button>
          )}
          {this.state.name}
        </Typography>

        <Typography style={styles.intro}>Voici les différents liens de cette catégorie ({this.state.data.length})</Typography>

        {this.state.data.map(n => {
          return (
            <Card className={classes.card} key={n.id}>
              {n.image_url && (<CardMedia
                className={classes.media}
                image={n.image_url}
                title={n.title}
              />)}
              <div className={classes.details}>
                <CardContent>
                  <Typography gutterBottom variant="headline" component="h2">
                    <a href={n.url} target="_blank">{n.title}</a>
                  </Typography>
                  {n.description && n.description.split('\n').map((item, key) => {
                    return <p key={key}>{item}</p>
                  })}
                </CardContent>
                <CardActions>
                  {hasPermission('links', 'edit') && (
                    <IconButton component={Link} to={`/links/${n.id}/edit`}>
                      <Icon>edit</Icon>
                    </IconButton>
                  )}
                  {hasPermission('links', 'delete') && (
                    <IconButton onClick={this.handleDelete.bind(this, `links/${n.id}`)}>
                      <Icon>delete</Icon>
                    </IconButton>
                  )}
                </CardActions>
              </div>
            </Card>
          );
        })}
      </div>
    );
  };
}

LinksShow.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(LinksShow);
