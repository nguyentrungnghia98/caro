const LENGTH = 20;

const INITIAL_CARO = {
  history: [
    {
      squares: Array(LENGTH)
        .fill(0)
        .map(() => Array(LENGTH).fill(0))
    }
  ],
  turn: true
};

const caro = (state = INITIAL_CARO, action) => {
  switch (action.type) {
    case 'CLICK_SQUARE': {
      const { history: fullHistory } = state;
      const { row, column, moveStep } = action.payload;

      const history = fullHistory.slice(0, moveStep + 1);
      const current = history[history.length - 1];
      const squares = JSON.parse(JSON.stringify(current.squares));
      squares[row][column] = state.turn ? 'X' : 'O';

      return {
        ...state,
        history: history.concat([{ squares }])
      };
    }

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

    case 'INITIAL_CARO': {
      const {
        row,
        column,
        symbol,
        moveStep,
        history: fullHistory
      } = action.payload;
      const history = fullHistory.slice(0, moveStep + 1);
      const current = history[history.length - 1];
      const squares = JSON.parse(JSON.stringify(current.squares));
      squares[row][column] = symbol;
      return { ...state, history: history.concat([{ squares }]) };
    }

    case 'CHANGE_TURN':
      return { ...state, turn: !state.turn };

    case 'MOVE_TO_STEP':
      return { ...state, turn: action.payload % 2 === 0 };

    case 'RESTART_CARO':
      return INITIAL_CARO;

    default:
      return state;
  }
};
export default caro;
