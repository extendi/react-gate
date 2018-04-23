export const LOGOUT_USER = 'USER_LOGOUT';
export const CHANGE_ROLE = 'CHANGE_ROLE';
export const RESET_USER = 'RESET_USER';

export const userReset = () => ({
  type: RESET_USER,
});

export const changeRole = role => ({
  type: CHANGE_ROLE,
  role,
});

export const userLogout = () => ({
  type: LOGOUT_USER,
});
