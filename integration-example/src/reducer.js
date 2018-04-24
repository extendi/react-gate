import { LOGOUT_USER, CHANGE_ROLE, RESET_USER, GIVE_PERMISSIONS } from './actions';

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
    case GIVE_PERMISSIONS: {
      return {
        ...state,
        canRead: true,
        canRead2: true,
        canWrite: true,
        canWrite2: true,
      };
    }
    default:
      return state;
  }
}
