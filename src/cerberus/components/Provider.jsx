// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AuthManager, { Provider } from '../initializer';
import type { AuthConfig, PermissionPredicate, ReduxAction, Permissions } from '../types';
import closurize from '../utils/closurize';

type State = {
    config: AuthConfig,
};

type Props = {
    authenticator: AuthManager,
    children: React.Node,
    userObject: any,
    userRole: string,
    action?: ReduxAction,
    bindedPredicates: Array<PermissionPredicate>,
};


class AuthProvider extends React.Component<Props, State> {
  static propTypes = {
    authenticator: PropTypes.instanceOf(AuthManager).isRequired,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
  };

  state = {
    config: this.props.authenticator.getConfig(),
  };

  render() {
    return (
      <Provider value={{
        ...this.state,
        userObject: this.props.userObject,
        bindedPredicates: this.props.bindedPredicates,
        currentRole: this.props.userRole,
        bindedAction: this.props.action,
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

const defaultPredicate = [() => true];

const mapStateToProps = (authConfig, permissions) => state => ({
  userObject: authConfig.loginSelector(state),
  userRole: authConfig.roleSelector(state),
  bindedPredicates: permissions.length > 0 ? permissions.map(p => closurize(state, p)) : defaultPredicate,
});

const mapDispatchToProps = ({ reduxAction }) => dispatch => ({
  action: reduxAction ? result => dispatch(reduxAction(result)) : undefined,
});

/* eslint-disable max-len */
const providerConfigurator = (
  authConfig: AuthConfig,
  permissions: Array<Permissions> = [],
): React.ComponentType<any> => connect(mapStateToProps(authConfig, permissions), mapDispatchToProps(authConfig))(AuthProvider);
export default providerConfigurator;
