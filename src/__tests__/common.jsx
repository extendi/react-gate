import React from 'react';

export const ProtectedComponent = (props) => {
  console.log('diocane', props);
  return <div id="protected">I am super protected!</div>;
};
export const NotFoundComponent = () => (
  <div id="notfound">Nun c sta nient u zì!</div>
);
export const NoAuthComponent = () => (
  <div id="noauth">Wagliò aro vaj?!</div>
);
export const defaultRoleSelector = state => state.user.role;
export const defaultLoggedSelector = state => state.user.isLogged;
export const defaultAction = { type: 'TEST_ACTION' };
export const mockActionLogin = () => ({ type: 'LOGIN_USER' });
export const mockActionUpdate = () => ({ type: 'UPDATE_USER' });
export const mockActionRemove = () => ({ type: 'REMOVE_USER' });

export function mockReducer(state = {}, action) {
  switch (action.type) {
    case 'LOGIN_USER': {
      return {
        isLogged: true,
        role: 'admin',
      };
    }
    case 'UPDATE_USER': {
      return {
        isLogged: 'asd',
        role: 'dog',
      };
    }
    case 'REMOVE_USER': {
      return {
        isLogged: undefined,
        role: undefined,
      };
    }
    default: {
      return state;
    }
  }
}
