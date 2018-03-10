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

const defaultPredicate = [() => true];

const mapStateToProps = (authConfig, permissions) => state => ({
  userObject: authConfig.loginSelector(state),
  userRole: authConfig.roleSelector(state),
  bindedPredicates: permissions.length > 0 ? permissions.map(p => closurize(state, p)) : defaultPredicate,
});

const mapDispatchToProps = ({ reduxAction }) => dispatch => ({
  action: reduxAction ? () => dispatch(reduxAction()) : undefined,
});

const RouteLocker = (
  authConfig: AuthConfig,
  onlyLogin: boolean = false,
  currentRole: string = '',
  permissions: Array<PermissionPredicate> = [],
) => (Component: React.ComponentType<any>): React.ComponentType<any> => {
  window.console.log('Authconfig', authConfig);
  window.console.log('Permissions', permissions);
  
  const decorated = class extends React.Component<AuthProps, any> {
    static defaultProps = {
      userObject: {},
    }
    state = {};
    componentDidMount() {
      window.console.log('There are the props ', this.props);
      if (this.props.action) {
        this.props.action();
      }
    }
    render() {
      if (
        (!onlyLogin && this.props.userRole.indexOf(currentRole) !== -1 && Predicate.and(...this.props.bindedPredicates)()) ||
        (this.props.userObject && onlyLogin)
      ) {
        window.console.log('Here', this.props.userRole, currentRole);
        return <Component {...this.props} />;
      }
      if (authConfig.Component404) {
        return <authConfig.Component404 />;
      }
      return <Redirect to={authConfig.redirectPath} />;
    }
  };
  return connect(mapStateToProps(authConfig, permissions), mapDispatchToProps(authConfig))(decorated);
};

export default RouteLocker;