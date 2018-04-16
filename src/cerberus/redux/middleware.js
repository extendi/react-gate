import AuthUpdateAction from './actions';

const createMiddleware = ({ loginSelector, roleSelector }) => store => next => (action) => {
  // First get current store
  const actualState = store.getState();
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
    store.dispatch(AuthUpdateAction(parsedAuthInfo));
  }
  next(action);
};

export default createMiddleware;
