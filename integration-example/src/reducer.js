import { LOGOUT_USER, CHANGE_ROLE, RESET_USER } from './actions';

const initialState = {
  id: 42,
  role: 'admin',
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
    default:
      return state;
  }
}
