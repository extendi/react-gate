import {
  LOGOUT_USER,
  CHANGE_ROLE,
  RESET_USER,
  PERMISSIONS_TOGGLE,
} from './actions';

const initialState = {
  id: 42,
  role: 'basic',
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_ROLE: {
      return {
        ...state,
        role: action.role,
      };
    }
    case LOGOUT_USER: {
      return {};
    }
    case RESET_USER: {
      return {
        ...initialState,
      };
    }
    case PERMISSIONS_TOGGLE: {
      return {
        ...state,
        canRead: !state.canRead,
        canRead2: !state.canRead,
        canWrite: !state.canWrite,
        canWrite2: !state.canWrite2,
      };
    }
    default:
      return state;
  }
}
