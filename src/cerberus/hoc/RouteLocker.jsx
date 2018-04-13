// @flow
import * as React from 'react';
import Predicate from 'predicate';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import type { AuthConfig, PermissionPredicate, ReduxAction } from '../types';
import closurize from '../utils/closurize';

type AuthProps = {
  userObject: any,
  userRole: string,
  action?: ReduxAction,
  bindedPredicates: Array<PermissionPredicate>,
};
const AUTH_SUCCESSFUL = 'authSuccess';
const AUTH_FAILED = 'authFailed';

const defaultPredicate = [() => true];

const mapStateToProps = (authConfig, permissions) => state => ({
  userObject: authConfig.loginSelector(state),
  userRole: authConfig.roleSelector(state),
  bindedPredicates: permissions.length > 0 ? permissions.map(p => closurize(state, p)) : defaultPredicate,
});

const mapDispatchToProps = ({ reduxAction }) => dispatch => ({
  action: reduxAction ? result => dispatch(reduxAction(result)) : undefined,
});

const RouteLocker = (
  authConfig: AuthConfig,
  onlyLogin: boolean = true,
  currentRole: string = '',
  permissions: Array<PermissionPredicate> = [],
) => (Component: React.ComponentType<any>): React.ComponentType<any> => {
  window.console.log('Authconfig', authConfig);
  // window.console.log('Permissions', permissions);

  const decorated = (props: AuthProps) => {
    const { action } = props;
    if (
      (!onlyLogin && props.userRole === currentRole && Predicate.and(...props.bindedPredicates)()) ||
        (props.userObject && onlyLogin)
    ) {
      if (action) action(AUTH_SUCCESSFUL);
      window.console.log('Here', props.userRole, currentRole);
      return <Component {...props} />;
    }
    if (authConfig.Component404) {
      if (action) action(AUTH_FAILED);
      return <authConfig.Component404 />;
    }
    if (action) action(AUTH_FAILED);
    return <Redirect to={authConfig.redirectPath} />;
  };
  decorated.defaultProps = {
    action: null,
  };
  return connect(mapStateToProps(authConfig, permissions), mapDispatchToProps(authConfig))(decorated);
};

export default RouteLocker;
