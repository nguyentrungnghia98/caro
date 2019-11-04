import { connect } from 'react-redux';
import TwoPlayer from './TwoPlayer';
import {
  changeTurn,
  updateWinnerUI,
  restartCaro,
  openWinnerModal,
  openLoserModal,
  clickSquareTwoPlayer,
  moveToStep,
  closeWinnerModal,
  initialCaro,
  setOpponent
} from '../../../actions/caro';
import {
  openAlertError,
  openAlertQuestion,
  openAlertWarning,
  openAlertInfo,
  closeAlert
} from '../../../actions/alert';

const mapStateToProps = state => {
  const { history, turn } = state.caro;
  const { isWinner, winnerSquares, winner } = state.winner;
  const { moveStep, isIncrease, moveStepLocation } = state.step;
  return {
    history,
    moveStep,
    turn,
    isWinner,
    winner,
    winnerSquares,
    isIncrease,
    user: state.auth.user,
    moveStepLocation
  };
};

export default connect(
  mapStateToProps,
  {
    clickSquare: clickSquareTwoPlayer,
    changeTurn,
    updateWinnerUI,
    restartCaro,
    openWinnerModal,
    openLoserModal,
    openAlertError,
    openAlertQuestion,
    openAlertInfo,
    openAlertWarning,
    closeAlert,
    moveToStep,
    closeWinnerModal,
    initialCaro,
    setOpponent
  }
)(TwoPlayer);
