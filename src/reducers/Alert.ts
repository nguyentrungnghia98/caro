import { OPEN_ALERT, CLOSE_ALERT } from '../actions/types';
import { ActionAlert } from '../actions';
import { DataAlert } from '../actions/alert';

export interface AlertReducer {
  isOpen: boolean;
  data: DataAlert;
}

const INITAL_STATE: AlertReducer = {
  isOpen: false,
  data: {
    type: 'success',
    title: '',
    subtitle: '',
    okText: '',
    confirmText: '',
    cancelText: '',
    onYesFn: (): void => {}
  }
};

export default (state = INITAL_STATE, action: ActionAlert): AlertReducer => {
  switch (action.type) {
    case OPEN_ALERT:
      return {
        ...state,
        isOpen: true,
        data: action.data
      };
    case CLOSE_ALERT:
      return { ...INITAL_STATE };

    default:
      return { ...state };
  }
};
