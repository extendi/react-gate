// @flow
import invariant from 'invariant';
import type { AuthConfig, Roles, WrapperFunction, PermissionPredicate, Permissions } from './types';
import RouteLocker from './hoc/RouteLocker';

class CerberusAuth {
  configuration: AuthConfig;
  roles: Roles;
  userPermissions: Array<Permissions>;
  constructor(configuration: AuthConfig) {
    this.configuration = configuration;
    this.roles = configuration.roles;
    this.userPermissions = configuration.permissions || [];
  }

  getHOCForRole(role: string, permission?: string): WrapperFunction {
    let userPermissions: Array<PermissionPredicate> = [];
    if (this.roles.indexOf(role) === -1) {
      invariant(!this.roles.indexOf(role) === -1, 'You selected an invalid role!');
    }
    if (permission) {
      const permissionFound = this.userPermissions.filter(p => p.name === permission);
      if (permissionFound.length !== 1) {
        invariant(!(permissionFound.length !== 1), 'The selected permission is not valid!');
      }
      userPermissions = permissionFound[0].predicates;
    }
    return RouteLocker(this.configuration, false, role, userPermissions);
  }

  getHOCForLogin(): WrapperFunction {
    if (!this.configuration.loginSelector) {
      invariant(this.configuration.loginSelector, 'You selected an invalid loginSelector');
    }
    return RouteLocker(this.configuration);
  }
}

export default CerberusAuth;
