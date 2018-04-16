// @flow
import * as React from 'react';
import invariant from 'invariant';
import PropTypes from 'prop-types';
import type { AuthConfig, Roles, WrapperFunction, PermissionPredicate, Permissions } from './types';
import closurize from '../utils/closurize';

type GateProps = {
    onlyLogin?: boolean,
    role?: string,
    children: React.Node,
    permissions?: Array<string>,
};

class Gate extends React.Component <GateProps> {
    static propTypes = {
      onlyLogin: PropTypes.bool,
      role: PropTypes.string,
      children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
      ]).isRequired,
    }

    state = {
      permissions: [],
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
      const permissions = this.props.availablePermissions
        .filter(p => this.props.permissions.indexOf(p.name) !== -1)
        .map(p => ...p.predicates.map(f => closurize(state, f)))
    }
}
