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
  closeWinnerModal
} from '../../../actions/caro';
import { openAlertError, openAlertQuestion } from '../../../actions/alert';

const mapStateToProps = state => {
  const { history, turn } = state.onePlayer;
  const { isWinner, winnerSquares, winner } = state.winner;
  const { moveStep, isIncrease } = state.step;
  return {
    history,
    moveStep,
    turn,
    isWinner,
    winner,
    winnerSquares,
    isIncrease
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
    moveToStep,
    closeWinnerModal
  }
)(TwoPlayer);
