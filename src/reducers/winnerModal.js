const INITIAL_STATE = {
  open: false,
  type: 'win'
};

const winnerModal = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'OPEN_WIN_MODAL':
      console.log('OPEN_WIN_MODAL');
      return { ...state, open: true, type: 'win' };
    case 'OPEN_LOSE_MODAL':
      return { ...state, open: true, type: 'lose' };
    case 'CLOSE_MODAL':
      return { ...state, open: false };
    default:
      return state;
  }
};

export default winnerModal;
