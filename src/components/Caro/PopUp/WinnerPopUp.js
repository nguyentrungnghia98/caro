/* eslint-disable react/no-deprecated */
/* eslint-disable react/prop-types */
/* eslint-disable no-return-assign */
import React, { Fragment } from 'react';
import { Dialog, DialogContent } from '@material-ui/core';
import { connect } from 'react-redux';
import { restartCaro, closeWinnerModal } from '../../../actions/caro';

const WinnerPopUp = props => {
  const { toggle, onCloseModal, onRestart, winner } = props;

  function restart() {
    onRestart();
    onCloseModal();
  }

  return (
    <Dialog open={toggle} onRequestClose={closeWinnerModal}>
      <button type="button" className="btn btn--close" onClick={onCloseModal}>
        <div>x</div>
      </button>
      <DialogContent className="card custom-card">
        <Fragment>
          <h3>Winner!</h3>
          <div className="symbol">{winner}</div>
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
    toggle: state.winnerModal,
    winner: state.caro.turn ? 'X' : 'O'
  };
};

export default connect(
  mapStateToProps,
  {
    onCloseModal: closeWinnerModal,
    onRestart: restartCaro
  }
)(WinnerPopUp);
