// @flow
import * as React from 'react';
import invariant from 'invariant';
import PropTypes from 'prop-types';
import type { AuthConfig, Roles, WrapperFunction, PermissionPredicate, Permissions } from './types';

type GateProps = {
    onlyLogin: boolean,
    role: string,
    children: React.Node,
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

    componentDidMount(){
        invariant(
            !(!this.props.onlyLogin && !this.props.role),
            'You must specify one of onlyLogin or role props!'
        );
    }
}
