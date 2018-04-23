import { INITIALIZE_AUTH_INTERNALS } from './actions';


// Using switch in order to suggest to support more actions in the future.
const authenticationReducer = initialConfiguration => (state = { ...initialConfiguration }, action) => {
  switch (action.type) {
    case INITIALIZE_AUTH_INTERNALS:
      return {
        ...state,
        ...action.internals,
      };
    default:
      return state;
  }
};

export default authenticationReducer;
