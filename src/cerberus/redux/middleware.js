import { updateInfo, UPDATE_AUTH_INFO, INITIALIZE_AUTH_INTERNALS, setupInternals } from './actions';

const defaultRoleSelector = () => undefined; // For the sake of clarity
/* eslint-disable max-len */
const authStateShouldUpdate = (authProvider, { loginSelector, roleSelector }, currentAction) => (((authProvider.userObject !== loginSelector || authProvider.userRole !== roleSelector) &&
    (currentAction !== UPDATE_AUTH_INFO && currentAction !== INITIALIZE_AUTH_INTERNALS)));

const createMiddleware = ({
  loginSelector,
  roleSelector = defaultRoleSelector,
}) => store => next => (action) => {
  // First get current store
  const { authProvider, ...actualState } = store.getState();
  /* eslint-disable no-param-reassign */
  const parsedAuthInfo = {
    loginSelector: loginSelector(actualState),
    roleSelector: roleSelector(actualState),
  };
  console.log(action.type)
  //if(action.type === 'LOGIN_USER') console.log('Dio cane');
  //// Check if values are updated
  if (authStateShouldUpdate(authProvider, parsedAuthInfo, action.type)) {
    /* const actionPromise = new Promise(resolve => resolve())
    actionPromise.then(() => store.dispatch(setupInternals())).then(() => action(next) */
    console.log(action.type)
    next(setupInternals());
  }
  if (action.type === INITIALIZE_AUTH_INTERNALS) {
    console.log('Dispatching new user stuff', parsedAuthInfo);
    store.dispatch(updateInfo(parsedAuthInfo));
  }
  next(action);
};

export default createMiddleware;
