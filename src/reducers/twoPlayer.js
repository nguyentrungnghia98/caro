const LENGTH = 20;

const INITIAL_CARO = {
  history: [
    {
      squares: Array(LENGTH)
        .fill(0)
        .map(() => Array(LENGTH).fill(0))
    }
  ]
};

const onePlayer = (state = INITIAL_CARO, action) => {
  switch (action.type) {
    case 'CLICK_SQUARE_TWO_PLAYER': {
      const { history: fullHistory } = state;
      const { row, column, moveStep, symbol } = action.payload;

      const history = fullHistory.slice(0, moveStep + 1);
      const current = history[history.length - 1];
      const squares = JSON.parse(JSON.stringify(current.squares));
      squares[row][column] = symbol;

      return {
        ...state,
        history: history.concat([{ squares }])
      };
    }

    case 'RESTART_CARO_TWO_PLAYER':
      return INITIAL_CARO;

    default:
      return state;
  }
};
export default onePlayer;
