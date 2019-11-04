export const addStepMove = (row, column) => {
  return {
    type: 'ADD_STEP_MOVE',
    payload: {
      row,
      column
    }
  };
};

export const clickSquare = (row, column) => async (dispatch, getState) => {
  const { moveStep } = getState().step;
  dispatch({ type: 'CLICK_SQUARE', payload: { row, column, moveStep } });
};

export const changeTurn = () => {
  return {
    type: 'CHANGE_TURN'
  };
};

export const updateWinnerUI = (squares, winner = null) => {
  return {
    type: 'UPDATE_WINNER_UI',
    payload: squares,
    winner
  };
};

export const moveToStep = step => {
  return {
    type: 'MOVE_TO_STEP',
    payload: step
  };
};

export const changeOrderStep = () => {
  return {
    type: 'CHANGE_ORDER_STEP'
  };
};

export const restartCaro = () => {
  return {
    type: 'RESTART_CARO'
  };
};

export const checkWinner = (row, column) => {
  return {
    type: 'SELECT_SQUARE',
    payload: {
      row,
      column
    }
  };
};

export const openWinnerModal = () => {
  return {
    type: 'OPEN_WIN_MODAL'
  };
};

export const openLoserModal = () => {
  return {
    type: 'OPEN_LOSE_MODAL'
  };
};

export const closeWinnerModal = () => {
  return {
    type: 'CLOSE_MODAL'
  };
};

export const generateNextCaroPending = () => {
  return {
    type: 'GENERATE_NEXT_CARO_PENDING'
  };
};

export const generateNextCaroDone = () => {
  return {
    type: 'GENERATE_NEXT_CARO_DONE'
  };
};

export const clickSquareTwoPlayer = (row, column, symbol) => async (
  dispatch,
  getState
) => {
  const { moveStep } = getState().step;
  dispatch({
    type: 'CLICK_SQUARE_TWO_PLAYER',
    payload: { row, column, moveStep, symbol }
  });
};

export const initialCaro = ({
  history,
  lastPosition,
  lastTurn,
  moveStep,
  moveStepLocation
}) => {
  return {
    type: 'INITIAL_CARO',
    payload: {
      row: lastPosition.i,
      column: lastPosition.j,
      symbol: lastTurn,
      history,
      moveStep,
      moveStepLocation
    }
  };
};

export const setOpponent = opponent => {
  return {
    type: 'SET_OPPONENT',
    payload: opponent
  };
};
