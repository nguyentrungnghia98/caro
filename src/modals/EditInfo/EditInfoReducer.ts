import {
  OPEN_EDIT_INFO_MODAL,
  CLOSE_EDIT_INFO_MODAL,
  EditInfoModalAction
} from './EditInfoAction';

const editInfo = (state = false, action: EditInfoModalAction) => {
  switch (action.type) {
    case OPEN_EDIT_INFO_MODAL:
      return true;
    case CLOSE_EDIT_INFO_MODAL:
      return false;
    default:
      return state;
  }
};

export default editInfo;
