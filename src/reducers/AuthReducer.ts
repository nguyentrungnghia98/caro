import { SIGN_OUT, FETCH_USER, SIGN_IN } from '../actions/types';
import { ActionLogin, User } from '../actions/index';

export interface AuthReducer {
  user?: User;
  isSignedIn?: boolean;
}

const INITAL_STATE: AuthReducer = {
  user: undefined,
  isSignedIn: false
};

export default (state = INITAL_STATE, action: ActionLogin): AuthReducer => {
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        user: { ...state.user, ...action.user },
        isSignedIn: true
      };

    case FETCH_USER:
      return {
        ...state,
        user: { ...state.user, ...action.user },
        isSignedIn: true
      };

    case SIGN_OUT:
      return { ...INITAL_STATE };
    default:
      return { ...state };
  }
};
