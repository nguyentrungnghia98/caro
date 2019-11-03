const INITIAL_CARO = {
  isWinner: false,
  winner: null,
  winnerSquares: []
};

const winner = (state = INITIAL_CARO, action) => {
  switch (action.type) {
    case 'UPDATE_WINNER_UI':
      console.log('UPDATE_WINNER_UI');
      return {
        ...state,
        isWinner: true,
        winnerSquares: action.payload,
        winner: action.winner
      };

    case 'RESTART_CARO':
      return INITIAL_CARO;

    default:
      return state;
  }
};

export default winner;
