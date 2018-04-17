import { updateInfo } from './actions';

const defaultRoleSelector = () => undefined; // For the sake of clarity

const createMiddleware = ({
  loginSelector,
  roleSelector = defaultRoleSelector,
}) => store => next => (action) => {
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
    next(updateInfo(parsedAuthInfo));
  }
  return next(action);
};

export default createMiddleware;
