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
  authInfo: {
    permissions: Array<Permissions>,
    userObject: any,
    userRole: string,
    authConfig: AuthConfig,
    availableRoles: Array<string>,
    reduxAction?: () => {},
  },
  children: React.Node,
  onlyLogin?: boolean,
  action: (reduxAction: any, result: string) => {},
  role?: string,
  selectedPermissions: Array<string>,
};

const AUTH_SUCCESSFUL = 'authSuccess';
const AUTH_FAILED = 'authFailed';

const mapStateToProps = ({
  authProvider: {
    roleSelector,
    loginSelector,
    roles,
    permissions,
    reduxAction,
  }, ...state
}) => ({
  authInfo: {
    userObject: loginSelector(state),
    userRole: roleSelector(state),
    authConfig: state.authProvider,
    availableRoles: roles,
    reduxAction,
    permissions: permissions && permissions.map(p => ({ name: p.name, predicates: p.predicates.map(f => closurize(state, f)) })),
  },
});

const mapDispatchToProps = dispatch => ({
  action: (reduxAction, result) => dispatch(reduxAction(result)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { reduxAction } = stateProps.authConfig;
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    action: reduxAction ? result => dispatchProps.action(reduxAction, result) : undefined,
  };
};

class Gate extends React.Component <GateProps, { permissions: Array<any> }> {
  constructor(props) {
    super(props);

    console.log(this.props.authInfo);
    invariant(
      this.props.onlyLogin || this.props.role,
      'You must specify one of onlyLogin or role props!',
    );
    invariant(
      !(this.props.onlyLogin === undefined && this.props.authInfo.availableRoles.indexOf(this.props.role) === -1)
      , 'Invalid role selected',
    );

    this.state = {
      permissions: this.props.authInfo.permissions
        .filter(p => this.props.selectedPermissions.indexOf(p.name) !== -1)
        .map(p => p.predicates)
        .reduce((x, y) => x.concat(y), []),
    };
  }

  shouldComponentUpdate(nextProps) {
    return this.props.authInfo !== nextProps.authInfo;
  }
  render() {
    const {
      authInfo: {
        reduxAction,
        authConfig,
        userRole,
        userObject,
      },
      role,
      onlyLogin,
      action,
    } = this.props;

    if (
      (!onlyLogin && userRole === role && Predicate.and(...this.state.permissions)()) ||
            (userObject && onlyLogin)
    ) {
      if (reduxAction) action(reduxAction, AUTH_SUCCESSFUL);
      window.console.log('Here', userRole, role);
      return this.props.children;
    }
    if (authConfig.Component404) {
      if (reduxAction) action(reduxAction, AUTH_FAILED);
      return <authConfig.Component404 />;
    }
    if (reduxAction) action(reduxAction, AUTH_FAILED);
    return <Redirect to={authConfig.redirectPath} />;
  }
}

Gate.propTypes = {
  authInfo: PropTypes.shape({
    permissions: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      predicates: PropTypes.arrayOf(PropTypes.func),
    })),
    userRole: PropTypes.string,
    /* eslint-disable react/forbid-prop-types */
    userObject: PropTypes.any,
    availableRoles: PropTypes.arrayOf(PropTypes.string),
    reduxAction: PropTypes.func,
  }),
  selectedPermissions: PropTypes.arrayOf(PropTypes.string),
  onlyLogin: PropTypes.bool,
  role: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

Gate.defaultProps = {
  authInfo: {
    permissions: [],
    userRole: undefined,
    userObject: undefined,
    availableRoles: [],
  },
  selectedPermissions: [],
  onlyLogin: undefined,
  role: undefined,
};

export default connect(mapStateToProps, mapDispatchToProps)(Gate);
