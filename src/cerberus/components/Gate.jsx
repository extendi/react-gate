// @flow
import * as React from 'react';
import Predicate from 'predicate';
import invariant from 'invariant';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import type { AuthConfig, Permissions } from '../types';
import closurize from '../utils/closurize';

type GateProps = {
    onlyLogin?: boolean,
    role?: string,
    children: React.Node,
    selectedPermissions: Array<string>,
    permissions: Array<Permissions>,
    userObject: any,
    userRole: string,
    authConfig: AuthConfig,
    availableRoles: Array<string>,
    action?: (authState: string) => {},
};

const AUTH_SUCCESSFUL = 'authSuccess';
const AUTH_FAILED = 'authFailed';

const defaultPredicate = [() => true];

const mapStateToProps = ({ authProvider, authProvider: { internals: { permissions } }, ...state }) => ({
  userObject: authProvider.userObject,
  userRole: authProvider.userRole,
  authConfig: authProvider.internals,
  availableRoles: authProvider.internals.roles,
  permissions: permissions && permissions.map(p => ({ name: p.name, predicates: p.predicates.map(f => closurize(state, f)) })),
});

const mapDispatchToProps = (dispatch, { authConfig: { reduxAction } }) => ({
  action: reduxAction ? result => dispatch(reduxAction(result)) : undefined,
});

class Gate extends React.Component <GateProps, { permissions: Array<any> }> {
    static propTypes = {
      permissions: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        predicates: PropTypes.arrayOf(PropTypes.func),
      })),
      userRole: PropTypes.string,
      /* eslint-disable react/forbid-prop-types */
      userObject: PropTypes.any,
      availableRoles: PropTypes.arrayOf(PropTypes.string),
      onlyLogin: PropTypes.bool,
      role: PropTypes.string,
      children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
      ]).isRequired,
    }

    static defaultProps = {
      permissions: [],
      userRole: undefined,
      userObject: undefined,
      availableRoles: [],
      onlyLogin: undefined,
      role: undefined,
    };

    state = {
      permissions: [defaultPredicate],
    };

    componentDidMount() {
      invariant(
        !(!this.props.onlyLogin && !this.props.role),
        'You must specify one of onlyLogin or role props!',
      );
      invariant(
        this.props.availableRoles.indexOf(this.props.role) !== -1,
        'You have selected an invalid role!',
      );
      // Permission retrieving
      const permissions = this.props.permissions
        .filter(p => this.props.selectedPermissions.indexOf(p.name) !== -1)
        .reduce((x, y) => x.concat(y), []);
      this.setState({ permissions });
    }

    render() {
      const {
        action,
        authConfig,
        role,
        onlyLogin,
        userRole,
        userObject,
      } = this.props;
      if (
        (!onlyLogin && userRole === role && Predicate.and(...this.state.permissions)()) ||
            (userObject && onlyLogin)
      ) {
        if (action) action(AUTH_SUCCESSFUL);
        window.console.log('Here', userRole, role);
        return this.props.children;
      }
      if (authConfig.Component404) {
        if (action) action(AUTH_FAILED);
        return <authConfig.Component404 />;
      }
      if (action) action(AUTH_FAILED);
      return <Redirect to={authConfig.redirectPath} />;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Gate);
