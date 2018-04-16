export const UPDATE_AUTH_INFO = '@@authManager/UPDATE_AUTH_INFO';

const updateInfo = ({ userObject, userRole }) => ({
  type: UPDATE_AUTH_INFO,
  userObject,
  userRole,
});

export default updateInfo;
