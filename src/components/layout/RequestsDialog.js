import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import store from '../../store';
import { closeReq, setErrMsg } from '../../actions/general';

import moment from 'moment';
import 'moment/locale/fr';
import { urlApi, postApi, hasPermission } from '../../utils';

const styles = {
  block: {
    display: 'block',
  },
};

class ResponsiveDialog extends React.Component {
  state = {
    open: false,
    leave: null,
    callback: () => {},
    unsubscribe: () => {},
  };

  handleClose = () => {
    this.setState({ open: false });
    store.dispatch(closeReq());
  };

  handleAccept = () => {
    if (!this.state.leave || !this.state.leave.id) return;
    postApi(`leave/${this.state.leave.id}/accept`).then(() => {
      this.state.callback();
    }).catch(e => {
      store.dispatch(setErrMsg(e));
    }).finally(() => {
      this.setState({ open: false });
      store.dispatch(closeReq());
    });
  };

  handleReject = () => {
    if (!this.state.leave || !this.state.leave.id) return;
    postApi(`leave/${this.state.leave.id}/reject`).then(() => {
      this.state.callback();
    }).catch(e => {
      store.dispatch(setErrMsg(e));
    }).finally(() => {
      this.setState({ open: false });
      store.dispatch(closeReq());
    });
  };

  componentDidMount() {
    this.setState({
      unsubscribe: store.subscribe(() => {
        const generalState = store.getState().general;
        if (!generalState || !generalState.req) return;
        this.setState({
          open: generalState.req.open,
          leave: generalState.req.leave || null,
          callback: generalState.req.callback,
        });
      }),
    })
  }

  componentWillUnmount() {
    this.state.unsubscribe();
  }

  render() {
    const { fullScreen } = this.props;

    const isAccepted = this.state.leave
      && this.state.leave.accepted
      && parseInt(this.state.leave.accepted, 10) === 1;

    const dialogTitle = (this.state.leave && this.state.leave.user && this.state.leave.reason)
      ? `${this.state.leave.reason} de ${this.state.leave.user.firstname} ${this.state.leave.user.lastname}`
      : 'Congés';

    return (
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">{dialogTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {this.state.leave && (
                <React.Fragment>
                  <Typography component="span" style={styles.block}>
                    <strong>Début : </strong>
                    {moment(this.state.leave.start).format('LLLL')}
                  </Typography>
                  <Typography component="span" style={styles.block}>
                    <strong>Fin : </strong>
                    {moment(this.state.leave.end).format('LLLL')}
                  </Typography>

                  {this.state.leave.file && (
                    <Typography component="span" style={styles.block}>
                      <strong>Justificatif : </strong>
                      <a href={urlApi(`storage/${this.state.leave.file}`)} target="_blank">Consulter</a>
                    </Typography>
                  )}

                  {this.state.leave.details && (
                    <Typography component="span" style={styles.block}>
                      <strong>Commentaire : </strong>
                      {this.state.leave.details}
                    </Typography>
                  )}
                </React.Fragment>
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose}>Fermer</Button>
            {!isAccepted && hasPermission('request_management', 'edit') && (
              <React.Fragment>
                <Button onClick={this.handleReject}>Refuser</Button>
                <Button onClick={this.handleAccept} color="primary" autoFocus>Confirmer</Button>
              </React.Fragment>
            )}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

ResponsiveDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog()(ResponsiveDialog);
