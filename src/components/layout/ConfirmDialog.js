import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import store from '../../store';
import { closeConfirm } from '../../actions/general';

class ResponsiveDialog extends React.Component {
  state = {
    open: false,
    content: '',
    title: '',
    callback: () => {},
    unsubscribe: () => {},
  };

  handleClose = () => {
    this.setState({ open: false });
    store.dispatch(closeConfirm());
  };

  handleAccept = () => {
    this.state.callback();
    this.setState({ open: false });
    store.dispatch(closeConfirm());
  };

  componentDidMount() {
    this.setState({
      unsubscribe: store.subscribe(() => {
        const generalState = store.getState().general;
        if (!generalState || !generalState.confirm) return;
        this.setState({
          open: generalState.confirm.open,
          title: generalState.confirm.title || 'Confirmer ?',
          content: generalState.confirm.content,
          callback: generalState.confirm.callback,
        });
      }),
    })
  }

  componentWillUnmount() {
    this.state.unsubscribe();
  }

  render() {
    const { fullScreen } = this.props;

    return (
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">{this.state.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{this.state.content}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose}>Annuler</Button>
            <Button onClick={this.handleAccept} color="primary" autoFocus>Confirmer</Button>
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
