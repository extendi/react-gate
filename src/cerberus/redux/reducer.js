import { UPDATE_AUTH_INFO, INITIALIZE_AUTH_INTERNALS } from './actions';

const initialState = { lol: 'asd'}; //  todo add initial state internals from config

// Using switch in order to suggest to support more actions in the future.
export default function authenticationReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_AUTH_INFO:
      return {
        ...state,
        userObject: action.userObject,
        userRole: action.userRole,
      };
    case INITIALIZE_AUTH_INTERNALS:
      return {
        ...state,
        internals: action.internals,
      };
    default:
      return state;
  }
}
