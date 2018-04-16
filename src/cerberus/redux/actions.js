export const UPDATE_AUTH_INFO = '@@authManager/UPDATE_AUTH_INFO';

const updateInfo = ({ loginSelector, roleSelector }) => ({
  type: UPDATE_AUTH_INFO,
  userObject: loginSelector,
  userRole: roleSelector,
});

export default updateInfo;
