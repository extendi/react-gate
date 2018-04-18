// @flow
import invariant from 'invariant';
import type { AuthConfig, Roles, Permissions } from './types';
import createMiddleware from './redux/middleware';
import authReducer from './redux/reducer';


class CerberusAuth {
  configuration: AuthConfig;
  roles: Roles;
  userPermissions: Array<Permissions>;
  constructor(configuration: AuthConfig) {
    invariant(
      configuration.loginActionType,
      'You need to specify your login action type',
    );
    invariant(
      configuration.loginSelector,
      'You need to specify a loginSelector in order to use the library.',
    );
    invariant(
      configuration.redirectPath || configuration.Component404,
      'You need to specify a redirect path or a 404 component.',
    );
    this.configuration = configuration;
  }
  reduxConfig() {
    return {
      authReducer: authReducer(this.configuration),
      middleware: createMiddleware(this.configuration),
    };
  }
}

export default CerberusAuth;
