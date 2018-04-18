export const UPDATE_AUTH_INFO = '@@authManager/UPDATE_AUTH_INFO';
export const INITIALIZE_AUTH_INTERNALS = '@@authManager/SETUP_AUTH_INTERNALS';

export const updateInfo = ({ loginSelector, roleSelector }) => ({
  type: UPDATE_AUTH_INFO,
  userObject: loginSelector,
  userRole: roleSelector,
});

export const setupInternals = () => ({
  type: INITIALIZE_AUTH_INTERNALS,
});

export default updateInfo;
