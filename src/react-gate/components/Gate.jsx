// @flow
import * as React from 'react';
import Predicate from 'predicate';
import invariant from 'invariant';
import warning from 'warning';
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
  render: (props: any) => React.Node,
  action: (reduxAction: any, result: string) => {},
  forRole?: string,
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
    Component404,
    redirectPath,
  }, ...state
}) => ({
  authInfo: {
    userObject: loginSelector(state),
    userRole: roleSelector(state),
    authConfig: { Component404, redirectPath },
    availableRoles: roles,
    reduxAction,
    /* eslint-disable max-len */
    permissions: permissions && permissions.map(p => ({ name: p.name, predicates: p.predicates.map(f => closurize(state, f)) })),
  },
});

const mapDispatchToProps = dispatch => ({
  action: (reduxAction, result) => dispatch(reduxAction(result)),
});

class Gate extends React.Component <GateProps, { permissions: Array<any> }> {
  static defaultProps = {
    authInfo: {
      permissions: [],
      userRole: undefined,
      userObject: undefined,
      availableRoles: [],
    },
    selectedPermissions: [],
    onlyLogin: undefined,
    children: undefined,
    render: undefined,
    forRole: undefined,
  };
  constructor(props) {
    super(props);
    invariant(
      this.props.onlyLogin || this.props.forRole,
      'You must specify one of onlyLogin or role props!',
    );
    invariant(
      !(this.props.onlyLogin === undefined && this.props.authInfo.availableRoles.indexOf(this.props.forRole) === -1)
      , 'Invalid role selected',
    );
    warning(
      !(this.props.children && this.props.render),
      'You should specify one of children or render props, children will be ignored',
    );
    this.state = {
      permissions: this.props.authInfo.permissions
        .filter(p => this.props.selectedPermissions.indexOf(p.name) !== -1)
        .map(p => p.predicates)
        .reduce((x, y) => x.concat(y), []),
    };
  }

  render() {
    const {
      authInfo: {
        reduxAction,
        authConfig,
        userRole,
        userObject,
      },
      forRole,
      onlyLogin,
      action,
      render,
      selectedPermissions,
    } = this.props;
    const renderProps = { forRole, onlyLogin, selectedPermissions };
    if (
      (!onlyLogin && userObject && userRole === forRole && Predicate.and(...this.state.permissions)()) ||
            (userObject && onlyLogin)
    ) {
      if (reduxAction) action(reduxAction, AUTH_SUCCESSFUL);
      if (render) return render(renderProps);
      return this.props.children ? React.Children.only(this.props.children) : null;
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
  forRole: PropTypes.string,
  render: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default connect(mapStateToProps, mapDispatchToProps)(Gate);
