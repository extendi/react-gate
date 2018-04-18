import { UPDATE_AUTH_INFO } from './actions';


// Using switch in order to suggest to support more actions in the future.
const authenticationReducer = initialConfiguration => (state = { internals: initialConfiguration }, action) => {
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

export default authenticationReducer;