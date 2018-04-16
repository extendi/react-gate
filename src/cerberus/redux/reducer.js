import { UPDATE_AUTH_INFO } from './actions';

const initialState = {};

// Using switch in order to suggest to support more actions in the future.
export default function authenticationReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_AUTH_INFO:
      return {
        ...state,
        userObject: action.userObject,
        userRole: action.userRole,
      };
    default:
      return state;
  }
}
