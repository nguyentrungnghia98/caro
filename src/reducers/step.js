const INITIAL_CARO = {
  moveStepLocation: {},
  moveStep: 0,
  isIncrease: true,
  opponent: 'Computer'
};

const Step = (state = INITIAL_CARO, action) => {
  switch (action.type) {
    case 'SET_OPPONENT':
      return { ...state, opponent: action.payload };

    case 'CLICK_SQUARE':
    case 'CLICK_SQUARE_TWO_PLAYER':
      return {
        ...state,
        moveStep: state.moveStep + 1,
        moveStepLocation: {
          ...state.moveStepLocation,
          [state.moveStep +
          1]: `${action.payload.row}, ${action.payload.column}`
        }
      };

    case 'INITIAL_CARO':
      return {
        ...state,
        moveStep: action.payload.moveStep + 1,
        moveStepLocation: {
          ...action.payload.moveStepLocation,
          [action.payload.moveStep +
          1]: `${action.payload.row}, ${action.payload.column}`
        }
      };

    case 'MOVE_TO_STEP':
      return { ...state, moveStep: action.payload };

    case 'CHANGE_ORDER_STEP':
      return { ...state, isIncrease: !state.isIncrease };

    case 'RESTART_CARO':
      return INITIAL_CARO;

    default:
      return state;
  }
};

export default Step;
