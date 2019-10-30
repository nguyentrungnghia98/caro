export const OPEN_EDIT_INFO_MODAL = 'OPEN_EDIT_INFO_MODAL';
export const CLOSE_EDIT_INFO_MODAL = 'CLOSE_EDIT_INFO_MODAL';

export interface EditInfoModalAction {
  type: string;
}

export const openEditInfoModal = () => {
  return {
    type: OPEN_EDIT_INFO_MODAL
  };
};
export const closeEditInfoModal = () => {
  return {
    type: CLOSE_EDIT_INFO_MODAL
  };
};
