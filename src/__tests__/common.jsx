import React from 'react';
import { withRouter } from 'react-router-dom';

export const ProtectedComponent = props => <div id="protected">I am super protected!</div>;
export const NotFoundComponent = () => (
  <div id="notfound">Nun c sta nient u zì!</div>
);
export const NoAuthComponent = () => (
  <div id="noauth">Wagliò aro vaj?!</div>
);
export const defaultRoleSelector = state => state.user.role;
export const defaultLoggedSelector = state => state.user.isLogged;
export const defaultAction = () => ({ type: 'TEST_ACTION' });
export const mockActionLogin = () => ({ type: 'LOGIN_USER' });
export const mockActionUpdate = () => ({ type: 'UPDATE_USER' });
export const mockActionRemove = () => ({ type: 'REMOVE_USER' });
export const mockActionNewSelector = () => ({ type: 'NEW_SELECTOR' });

export const errorBoundary = () => (class ErrorCatcher extends React.Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }
  
  componentDidCatch(error, info) {
    window.console.log('Error catched :)', error, info);
    this.setState({ error: info });
  }

  render() {
    return this.props.children;
  }
});
export const bindLocationChanger = () => withRouter(class RouteChanger extends React.Component {
  constructor(props) {
    super(props);

    this.changeRouting = this.changeRouting.bind(this);
  }

  changeRouting(route) {
    this.props.history.push(route);
  }

  render() {
    return (
      <React.Fragment>
        <button onClick={() => this.changeRouting('/noauth')} id="routenoauth">Change</button>
        <button onClick={() => this.changeRouting('/test')} id="routeprotected">Change</button>

        {this.props.children}
      </React.Fragment>
    );
  }
});
export function mockReducer(state = {}, action) {
  switch (action.type) {
    case 'LOGIN_USER': {
      return {
        isLogged: true,
        role: 'admin',
      };
    }
    case 'UPDATE_USER': {
      return {
        isLogged: 'asd',
        role: 'dog',
      };
    }
    case 'REMOVE_USER': {
      return {
        isLogged: undefined,
        role: undefined,
      };
    }
    case 'NEW_SELECTOR': {
      return {
        ...state,
        newSelector: true,
      };
    }
    default: {
      return state;
    }
  }
}
