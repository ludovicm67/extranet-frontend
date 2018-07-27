import React, { Component } from 'react';
import Timeline from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import moment from 'moment';
import 'moment/locale/fr';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { getApi } from '../utils';

moment.locale('fr');

const styles = theme => ({
  timelineContainer: {
    position: 'absolute',
    top: 56,
    [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
      top: 48,
    },
    [theme.breakpoints.up('sm')]: {
      top: 64,
    },
    bottom: 0,
    right: 0,
    left: 0,
    padding: 0,
    margin: 0,
    [theme.breakpoints.up('md')]: {
      left: 240,
    },
  },
});


class Teamview extends Component {
  state = {
    groups: [
      {
        id: 0,
        title: 'Chargement...',
      }
    ],
    items: [],
  };

  fetchList() {
    getApi('team').then(res => {
      if (this.isUnmounted) {
        return;
      }
      const items = [];
      this.setState({
        groups: res.map(e => {
          const lastname = e.lastname ? `${e.lastname[0]}.` : '';
          e.leave && e.leave.map(l => {
            items.push({
              id: l.id,
              group: l.user_id,
              title: l.reason,
              start_time: moment(l.start),
              end_time: moment(l.end),
              style: {
                opacity: l.accepted > 0 ? 1 : .4,
              }
            });
            return null;
          });
          return {
            id: e.id,
            title: `${e.firstname} ${lastname}`,
        }}),
        items,
      });
    });
  }

  componentDidMount() {
    this.fetchList();
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.timelineContainer}>
        <Timeline
          lineHeight={40}
          groups={this.state.groups}
          items={this.state.items}
          sidebarContent={<div>Vue d'équipe</div>}
          itemsSorted
          itemTouchSendsClick={false}
          stackItems
          itemHeightRatio={1}
          showCursorLine
          canMove={false}
          canResize={false}
          defaultTimeStart={moment().add(-1, 'day')}
          defaultTimeEnd={moment().add(7, 'day')}
        />
      </div>
    );
  }
}

Teamview.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Teamview);
