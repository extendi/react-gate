export const UPDATE_AUTH_INFO = '@@authManager/UPDATE_AUTH_INFO';
export const INITIALIZE_AUTH_INTERNALS = '@@authManager/SETUP_AUTH_INTERNALS';

export const updateInfo = ({ loginSelector, roleSelector }) => ({
  type: UPDATE_AUTH_INFO,
  userObject: loginSelector,
  userRole: roleSelector,
});

export const setupInternals = authConfig => ({
  type: INITIALIZE_AUTH_INTERNALS,
  internals: authConfig,
});

export default updateInfo;
