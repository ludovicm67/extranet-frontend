import React, { Component } from 'react';
import moment from 'moment';
import 'moment/locale/fr';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { getApi } from '../utils';

moment.locale('fr');

const styles = theme => ({

});

const today = new Date();
const todayInfos = {
  year: today.getFullYear(),
  month: 1 + today.getMonth(),
};

class Teamview extends Component {
  state = {
    id: this.props.match.params.userId,
    month: todayInfos.month,
    year: todayInfos.year,
  };

  fetchList() {
    getApi(`overtime/${this.state.id}?year=${this.state.year}&month=${this.state.month}`)
    .then(res => {
      if (this.isUnmounted) {
        return;
      }

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
      <div>

      </div>
    );
  }
}

Teamview.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Teamview);
