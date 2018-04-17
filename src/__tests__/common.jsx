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
export const defaultRoleSelector = state => state.role;
export const defaultLoggedSelector = state => state.isLogged;
export const defaultAction = { type: 'TEST_ACTION' };
