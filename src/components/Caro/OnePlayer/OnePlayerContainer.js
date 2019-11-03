import { connect } from 'react-redux';
import OnePlayer from './OnePlayer';
import {
  clickSquare,
  changeTurn,
  updateWinnerUI,
  restartCaro,
  openWinnerModal,
  openLoserModal
} from '../../../actions/caro';

const mapStateToProps = state => {
  const { history, turn } = state.onePlayer;
  const { isWinner, winnerSquares } = state.winner;
  const { moveStep, isIncrease } = state.step;
  return {
    history,
    moveStep,
    turn,
    isWinner,
    winnerSquares,
    isIncrease
  };
};

export default connect(
  mapStateToProps,
  {
    clickSquare,
    changeTurn,
    updateWinnerUI,
    restartCaro,
    openWinnerModal,
    openLoserModal
  }
)(OnePlayer);
