// @flow
import * as React from 'react';

export type Roles = Array<string>;
type UserRoles = Array<String> | string;
export type WrapperFunction = (Component: React.ComponentType<any>) => React.ComponentType<any>;
export type PermissionPredicate = (state: any) => boolean;

export type ReduxAction = (...args: any) => any;
type LoginSelector = (state: any) => boolean;
type RoleSelector = (state: any) => UserRoles;
type RedirectPath = string;
type NotFoundComponent = React.ComponentType<any>;

export type Permissions = {
  name: string,
  predicates: Array<PermissionPredicate>,
};

export type AuthConfig = {
  roles: Roles,
  loginSelector: LoginSelector,
  permissions?: Array<Permissions>,
  roleSelector: RoleSelector,
  reduxAction?: ReduxAction,
  redirectPath?: RedirectPath,
  Component404?: NotFoundComponent,
};
