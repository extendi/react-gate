import { updateInfo, UPDATE_AUTH_INFO, INITIALIZE_AUTH_INTERNALS, setupInternals } from './actions';

const defaultRoleSelector = () => undefined; // For the sake of clarity

const createMiddleware = ({
  loginSelector,
  roleSelector = defaultRoleSelector,
  loginActionType,
}) => store => next => (action) => {
  // First get current store
  if (action.type === loginActionType) {
    const { authProvider, ...actualState } = store.getState();
    /* eslint-disable no-param-reassign */
    const parsedAuthInfo = {
      loginSelector: loginSelector(actualState),
      roleSelector: roleSelector(actualState),
    };
    store.dispatch(updateInfo(parsedAuthInfo));
  }
  next(action);
};

export default createMiddleware;
