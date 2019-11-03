/* eslint-disable react/no-deprecated */
/* eslint-disable react/prop-types */
/* eslint-disable no-return-assign */
import React, { Fragment } from 'react';
import { Dialog, DialogContent } from '@material-ui/core';
import { connect } from 'react-redux';
import { closeWinnerModal } from '../../../actions/caro';
import './WinnerPopUp.scss';
import WinIcon from '../../../assets/images/you-win.png';
import LoseIcon from '../../../assets/images/you-lose.png';

const WinnerPopUp = props => {
  const { toggle, type, onCloseModal, onRestart } = props;

  function restart() {
    onRestart();
    onCloseModal();
  }

  return (
    <Dialog open={toggle} className="winner-modal">
      <button type="button" className="btn btn__close" onClick={onCloseModal}>
        <div>x</div>
      </button>
      <DialogContent className="card custom-card">
        <Fragment>
          {type === 'win' ? (
            <Fragment>
              {' '}
              <h3 className="text--success">Congratulations!</h3>
              <img src={WinIcon} alt="win-icon" />{' '}
            </Fragment>
          ) : (
            <Fragment>
              <h3 className="text--error">Oops!</h3>
              <img src={LoseIcon} alt="win-icon" />
            </Fragment>
          )}

          <button type="button" className="btn btn-restart" onClick={restart}>
            Restart
          </button>
        </Fragment>
      </DialogContent>
    </Dialog>
  );
};

const mapStateToProps = state => {
  return {
    toggle: state.winnerModal.open,
    type: state.winnerModal.type
  };
};

export default connect(
  mapStateToProps,
  {
    onCloseModal: closeWinnerModal
  }
)(WinnerPopUp);
