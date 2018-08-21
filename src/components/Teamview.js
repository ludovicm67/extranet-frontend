import React, { Component } from 'react';
import Timeline from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import moment from 'moment';
import 'moment/locale/fr';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { getApi } from '../utils';

import { setErrMsg } from '../actions/general';
import store from '../store';

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
          const team = e.team ? ` (${e.team.name})` : '';
          const lastname = e.lastname ? `${e.lastname[0]}.` : '';
          e.leave && e.leave.map(l => {
            if (l.accepted < 0) return null;
            const momentStart = moment(l.start);
            const startHour = momentStart.hour() <= 10 ? 0 : 12;
            momentStart.hour(startHour);

            const momentEnd = moment(l.end);
            if (momentEnd.hour() >= 14) {
              momentEnd.hour(23);
              momentEnd.minute(59);
              momentEnd.second(59);
            } else {
              momentEnd.hour(12);
              momentEnd.minute(0);
              momentEnd.second(0);
            }

            items.push({
              id: l.id,
              group: l.user_id,
              title: l.reason,
              start_time: momentStart,
              end_time: momentEnd,
              style: {
                opacity: l.accepted > 0 ? 1 : .4,
                background: e.team.color,
              },
              itemProps: {
                onClick: () => {
                  console.log(l);
                },
              },
            });
            return null;
          });
          return {
            id: e.id,
            title: `${e.firstname} ${lastname}${team}`,
        }}),
        items,
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
          defaultTimeStart={moment().add(-2, 'day')}
          defaultTimeEnd={moment().add(25, 'day')}
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
