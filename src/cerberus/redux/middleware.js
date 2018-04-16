import { updateInfo, setupInternals, INITIALIZE_AUTH_INTERNALS } from './actions';

const createMiddleware = ({ loginSelector, roleSelector, ...rest }) => store => next => (action) => {
  // First get current store
  const actualState = store.getState();
  // Check if the config is in the state
  if (!actualState.authProvider.internals) {
    // Dispatch the auth config in the state
    store.dispatch(setupInternals(rest));
  }
  /* eslint-disable no-param-reassign */
  const parsedAuthInfo = [loginSelector, roleSelector].reduce((result, func) => {
    result[func.name] = func(actualState);
    return result;
  }, {});
  // Check if values are updated
  if (
    actualState.authProvider.userObject !== parsedAuthInfo.loginSelector ||
      actualState.authProvider.userRole !== parsedAuthInfo.roleSelector
  ) {
    store.dispatch(updateInfo(parsedAuthInfo));
  }
  next(action);
};

export default createMiddleware;
