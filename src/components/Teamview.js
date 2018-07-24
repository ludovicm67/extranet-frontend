import React, { Component } from 'react';
import Timeline from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import moment from 'moment';
import 'moment/locale/fr';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

moment.locale('fr');

const groups = [{ id: 1, title: 'group 1' }, { id: 2, title: 'group 2' },
  { id: 3, title: 'group 1' }, { id: 4, title: 'group 2' },
  { id: 5, title: 'group 1' }, { id: 6, title: 'group 2' },
  { id: 7, title: 'group 1' }, { id: 8, title: 'group 2' },
  { id: 9, title: 'group 1' }, { id: 19, title: 'group 2' },
  { id: 33, title: 'group 1' }, { id: 34, title: 'group 2' },
  { id: 35, title: 'group 1' }, { id: 36, title: 'group 2' },
  { id: 37, title: 'group 1' }, { id: 38, title: 'group 2' },
  { id: 39, title: 'group 1' }, { id: 49, title: 'group 2' },
  { id: 11, title: 'group 1' }, { id: 12, title: 'group 2' },
  { id: 13, title: 'group 1' }, { id: 14, title: 'group 2' }];

const items = [
  {
    id: 1,
    group: 1,
    style: {
      backgroundColor: 'red',
    },
    title: 'item 1',
    start_time: moment(),
    end_time: moment().add(1, 'day')
  },
  {
    id: 2,
    group: 2,
    title: 'item 2',
    start_time: moment().add(-0.5, 'day'),
    end_time: moment().add(0.5, 'day')
  },
  {
    id: 3,
    group: 1,
    title: 'item 3',
    start_time: moment().add(2, 'day'),
    end_time: moment().add(3, 'day')
  }
];

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
  render() {
    const { classes, theme } = this.props;
    return (
      <div className={classes.timelineContainer}>
        <Timeline
          style={styles(theme).timeline}
          lineHeight={40}
          groups={groups}
          items={items}
          sidebarContent={<div>Vue d'équipe</div>}
          itemsSorted
          itemTouchSendsClick={false}
          stackItems
          itemHeightRatio={1}
          showCursorLine
          canMove={false}
          canResize={false}
          defaultTimeStart={moment().add(-3, 'day')}
          defaultTimeEnd={moment().add(8, 'day')}
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
