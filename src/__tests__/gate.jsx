/* eslint-disable max-len */

import { MemoryRouter, Switch, Route } from 'react-router-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import Enzyme, { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import Gate from '../react-gate/components/Gate';
import Initializer from '../react-gate/initializer';
import {
  NotFoundComponent,
  NoAuthComponent,
  defaultRoleSelector,
  defaultLoggedSelector,
  ProtectedComponent,
  defaultAction,
  mockReducer,
  mockActionLogin,
  mockActionRemove,
  bindLocationChanger,
} from './common';

const mockedStore = configureMockStore();

const LocationChanger = bindLocationChanger();
beforeEach(() => {
  jest.spyOn(console, 'error');
  global.console.error.mockImplementation(() => {});
});
afterEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  global.console.error.mockRestore();
});
const defaultConfig = {
  roles: ['admin', 'basic'],
  roleSelector: defaultRoleSelector,
  loginSelector: defaultLoggedSelector,
  redirectPath: '/noauth',
  Component404: NotFoundComponent,
  permissions: [
    {
      name: 'canWrite',
      predicates: [state => state.canWrite, state => state.canWrite2],
    },
    {
      name: 'canRead',
      predicates: [state => state.canRead, state => state.canRead2],
    },
  ],
  reduxAction: defaultAction,
};

/* eslint-disable max-len */
const configRealStore = reducer => createStore(
  combineReducers({ authProvider: reducer, user: mockReducer }),
  { user: { isLogged: true, role: 'basic' } },
);

const RouteSkeleton = (store, configuredAuth) => () => (
  <Provider store={store}>
    <MemoryRouter initialEntries={['/test']}>
      <Switch>
        {configuredAuth}
        <Route exact path="/noauth" render={props => (<LocationChanger><NoAuthComponent {...props} /></LocationChanger>)} />
      </Switch>
    </MemoryRouter>
  </Provider>
);

// Setup enzyme for react testing
beforeAll(() => {
  Enzyme.configure({ adapter: new EnzymeAdapter() });
});

describe('Gate component', () => {
  it('Should first login, than when user object change, fail at login and go to redirectpath', () => {
    const { authReducer } = new Initializer({ ...defaultConfig, Component404: undefined }).reduxConfig();
    const store = configRealStore(authReducer);
    const authJSX = (
      <Route
        exact
        path="/test"
        render={props => (
          <Gate onlyLogin>
            <LocationChanger>
              <ProtectedComponent {...props} />
            </LocationChanger>
          </Gate>
        )}
      />
    );
    const ConfiguredDom = RouteSkeleton(store, authJSX);
    const wrapper = mount(<ConfiguredDom />);
    const noauthRouting = wrapper.find('#routenoauth');
    const authRouting = wrapper.find('#routeprotected');
    expect(noauthRouting.length).toEqual(1);
    expect(authRouting.length).toEqual(1);
    expect(wrapper.find('#protected').length).toEqual(1);
    noauthRouting.simulate('click');
    expect(wrapper.find('#noauth').length).toEqual(1);
    store.dispatch(mockActionRemove());
    authRouting.simulate('click');
    expect(wrapper.find('#noauth').length).toEqual(1);
  });
  it('Should first not login, than when user object change, success at login and go to protected path', () => {
    const { authReducer } = new Initializer({ ...defaultConfig, Component404: undefined }).reduxConfig();
    const store = configRealStore(authReducer);
    const authJSX = (
      <Route
        exact
        path="/test"
        render={props => (
          <Gate onlyLogin>
            <LocationChanger>
              <ProtectedComponent {...props} />
            </LocationChanger>
          </Gate>
        )}
      />
    );
    const ConfiguredDom = RouteSkeleton(store, authJSX);
    store.dispatch(mockActionRemove());
    const wrapper = mount(<ConfiguredDom />);
    const noauthRouting = wrapper.find('#routenoauth');
    const authRouting = wrapper.find('#routeprotected');
    expect(noauthRouting.length).toEqual(1);
    expect(authRouting.length).toEqual(1);
    expect(wrapper.find('#noauth').length).toEqual(1);
    store.dispatch(mockActionLogin());
    authRouting.simulate('click');
    expect(wrapper.find('#protected').length).toEqual(1);
  });

  it('Should throw an invariant error because selected role is not available', () => {
    const { authReducer } = new Initializer({ ...defaultConfig, Component404: undefined }).reduxConfig();
    const store = configRealStore(authReducer);
    const AuthJSX = (
      <Gate forRole="user" store={store} >
        <ProtectedComponent />
      </Gate>
    );
    store.dispatch(mockActionRemove());
    expect(() => mount(AuthJSX)).toThrowError();
  });

  it('Should throw an invariant error because no forRole or onlyLogin props is defined', () => {
    const { authReducer } = new Initializer({ ...defaultConfig, Component404: undefined }).reduxConfig();
    const store = configRealStore(authReducer);
    const AuthJSX = (
      <Gate store={store} >
        <ProtectedComponent />
      </Gate>
    );
    expect(() => mount(AuthJSX)).toThrowError();
  });

  it('Should not permit access to the route because user object is not defined', () => {
    const { authReducer } = new Initializer({ ...defaultConfig, Component404: undefined }).reduxConfig();
    const store = configRealStore(authReducer);
    const AuthJSX = (
      <Route
        exact
        path="/test"
        render={props => (
          <Gate onlyLogin>
            <ProtectedComponent {...props} />
          </Gate>
        )}
      />
    );
    store.dispatch(mockActionRemove());
    const ConfiguredDom = RouteSkeleton(store, AuthJSX);
    const wrapper = mount(<ConfiguredDom />);
    expect(wrapper.find('#noauth').length).toEqual(1);
  });
  it('Should not permit access to the route because role is invalid for the route', () => {
    const { authReducer } = new Initializer({ ...defaultConfig, Component404: undefined }).reduxConfig();
    const store = configRealStore(authReducer);
    const AuthJSX = (
      <Route
        exact
        path="/test"
        render={props => (
          <Gate forRole="admin">
            <ProtectedComponent {...props} />
          </Gate>
        )}
      />
    );
    const ConfiguredDom = RouteSkeleton(store, AuthJSX);
    const wrapper = mount(<ConfiguredDom />);
    expect(wrapper.find('#noauth').length).toEqual(1);
  });
  it('Should not permit access to the route because role is invalid and go to 404 defined component', () => {
    const { authReducer } = new Initializer({ ...defaultConfig }).reduxConfig();
    const store = configRealStore(authReducer);
    const AuthJSX = (
      <Route
        exact
        path="/test"
        render={props => (
          <Gate forRole="admin">
            <ProtectedComponent {...props} />
          </Gate>
        )}
      />
    );
    const ConfiguredDom = RouteSkeleton(store, AuthJSX);
    const wrapper = mount(<ConfiguredDom />);
    expect(wrapper.find('#notfound').length).toEqual(1);
  });
  it('Should dispatch action with appropriate result and redirect to component404', () => {
    const { authReducer } = new Initializer({ ...defaultConfig }).reduxConfig();
    const defaultState = authReducer(undefined, {});
    const store = mockedStore({ user: { isLogged: true, role: 'basic' }, authProvider: defaultState });
    const AuthJSX = (
      <Route
        exact
        path="/test"
        render={props => (
          <Gate forRole="admin">
            <ProtectedComponent {...props} />
          </Gate>
        )}
      />
    );
    const ConfiguredDom = RouteSkeleton(store, AuthJSX);
    const wrapper = mount(<ConfiguredDom />);
    expect(wrapper.find('#notfound').length).toEqual(1);
    const actions = store.getActions();
    expect(actions).toEqual([{ type: 'TEST_ACTION', result: 'authFailed' }]);
  });
  it('Should not dispatch action with appropriate result and redirect to component404', () => {
    const { authReducer } = new Initializer({ ...defaultConfig, reduxAction: undefined }).reduxConfig();
    const defaultState = authReducer(undefined, {});
    const store = mockedStore({ user: { isLogged: true, role: 'basic' }, authProvider: defaultState });
    const AuthJSX = (
      <Route
        exact
        path="/test"
        render={props => (
          <Gate forRole="admin">
            <ProtectedComponent {...props} />
          </Gate>
        )}
      />
    );
    const ConfiguredDom = RouteSkeleton(store, AuthJSX);
    const wrapper = mount(<ConfiguredDom />);
    expect(wrapper.find('#notfound').length).toEqual(1);
    const actions = store.getActions();
    expect(actions).toEqual([]);
  });
  it('Should dispatch action with appropriate result and redirect to redirectPath', () => {
    const { authReducer } = new Initializer({ ...defaultConfig, Component404: undefined }).reduxConfig();
    const defaultState = authReducer(undefined, {});
    const store = mockedStore({ user: { isLogged: true, role: 'basic' }, authProvider: defaultState });
    const AuthJSX = (
      <Route
        exact
        path="/test"
        render={props => (
          <Gate forRole="admin">
            <ProtectedComponent {...props} />
          </Gate>
        )}
      />
    );
    const ConfiguredDom = RouteSkeleton(store, AuthJSX);
    const wrapper = mount(<ConfiguredDom />);
    expect(wrapper.find('#noauth').length).toEqual(1);
    const actions = store.getActions();
    expect(actions).toEqual([{ type: 'TEST_ACTION', result: 'authFailed' }]);
  });
  it('Should not dispatch action with appropriate result and redirect to redirectPath', () => {
    const { authReducer } = new Initializer({ ...defaultConfig, Component404: undefined, reduxAction: undefined }).reduxConfig();
    const defaultState = authReducer(undefined, {});
    const store = mockedStore({ user: { isLogged: true, role: 'basic' }, authProvider: defaultState });
    const AuthJSX = (
      <Route
        exact
        path="/test"
        render={props => (
          <Gate forRole="admin">
            <ProtectedComponent {...props} />
          </Gate>
        )}
      />
    );
    const ConfiguredDom = RouteSkeleton(store, AuthJSX);
    const wrapper = mount(<ConfiguredDom />);
    expect(wrapper.find('#noauth').length).toEqual(1);
    const actions = store.getActions();
    expect(actions).toEqual([]);
  });
  it('Should dispatch action with appropriate result and access the route', () => {
    const { authReducer } = new Initializer({ ...defaultConfig, Component404: undefined }).reduxConfig();
    const defaultState = authReducer(undefined, {});
    const store = mockedStore({ user: { isLogged: true, role: 'basic' }, authProvider: defaultState });
    const AuthJSX = (
      <Route
        exact
        path="/test"
        render={props => (
          <Gate onlyLogin>
            <ProtectedComponent {...props} />
          </Gate>
        )}
      />
    );
    const ConfiguredDom = RouteSkeleton(store, AuthJSX);
    const wrapper = mount(<ConfiguredDom />);
    expect(wrapper.find('#protected').length).toEqual(1);
    const actions = store.getActions();
    expect(actions).toEqual([{ type: 'TEST_ACTION', result: 'authSuccess' }]);
  });
  it('Should build and bind the correct permissions', () => {
    const { authReducer } = new Initializer({ ...defaultConfig, Component404: undefined }).reduxConfig();
    const defaultState = authReducer(undefined, {});
    const store = mockedStore({
      user: { isLogged: true, role: 'basic' },
      canWrite: 'yes',
      canWrite2: 'ohyes',
      canRead: true,
      canRead2: 'ohtrue',
      authProvider: defaultState,
    });
    const AuthJSX = (
      <Gate onlyLogin store={store} selectedPermissions={['canWrite', 'canRead']} >
        <ProtectedComponent />
      </Gate>
    );
    const wrapper = mount(AuthJSX);
    const permissionsInState = wrapper.find('Gate').instance().state.permissions;
    expect(permissionsInState.length).toEqual(4);
    expect(permissionsInState[0]()).toEqual('yes');
    expect(permissionsInState[1]()).toEqual('ohyes');
    expect(permissionsInState[2]()).toEqual(true);
    expect(permissionsInState[3]()).toEqual('ohtrue');
  });
  it('Should login because the user has all the permission', () => {
    const { authReducer } = new Initializer({ ...defaultConfig, Component404: undefined }).reduxConfig();
    const defaultState = authReducer(undefined, {});
    const store = mockedStore({
      user: { isLogged: true, role: 'basic' },
      canWrite: 'yes',
      canWrite2: 'ohyes',
      canRead: true,
      canRead2: 'ohtrue',
      authProvider: defaultState,
    });
    const AuthJSX = (
      <Gate forRole="basic" store={store} selectedPermissions={['canWrite', 'canRead']} >
        <ProtectedComponent />
      </Gate>
    );
    const wrapper = mount(AuthJSX);
    expect(wrapper.find('#protected').length).toEqual(1);
  });
  it('Should login because the props is onlyLogin, so the props of permission are not considered in the auth', () => {
    const { authReducer } = new Initializer({ ...defaultConfig, Component404: undefined }).reduxConfig();
    const defaultState = authReducer(undefined, {});
    const store = mockedStore({
      user: { isLogged: true, role: 'basic' },
      canWrite: 'yes',
      canRead: true,
      canRead2: 'ohtrue',
      authProvider: defaultState,
    });
    const AuthJSX = (
      <Gate onlyLogin store={store} selectedPermissions={['canWrite', 'canRead']} >
        <ProtectedComponent />
      </Gate>
    );
    const wrapper = mount(AuthJSX);
    expect(wrapper.find('#protected').length).toEqual(1);
  });
  it('Should login and dispatch no action because is not provided', () => {
    const { authReducer } = new Initializer({ ...defaultConfig, Component404: undefined, reduxAction: undefined }).reduxConfig();
    const defaultState = authReducer(undefined, {});
    const store = mockedStore({
      user: { isLogged: true, role: 'basic' },
      authProvider: defaultState,
    });
    const AuthJSX = (
      <Gate onlyLogin store={store} >
        <ProtectedComponent />
      </Gate>
    );
    const wrapper = mount(AuthJSX);
    expect(wrapper.find('#protected').length).toEqual(1);
  });
  it('Should login because the props is onlyLogin, so the props of permissions and role are not considered in the auth', () => {
    const { authReducer } = new Initializer({ ...defaultConfig, Component404: undefined }).reduxConfig();
    const defaultState = authReducer(undefined, {});
    const store = mockedStore({
      user: { isLogged: true, role: 'basic' },
      canWrite: 'yes',
      canRead: true,
      canRead2: 'ohtrue',
      authProvider: defaultState,
    });
    const AuthJSX = (
      <Gate onlyLogin forRole="admin" store={store} selectedPermissions={['canWrite', 'canRead']} >
        <ProtectedComponent />
      </Gate>
    );
    const wrapper = mount(AuthJSX);
    expect(wrapper.find('#protected').length).toEqual(1);
  });
  it('Should login because the user has all the permission and correct role', () => {
    const { authReducer } = new Initializer({ ...defaultConfig, Component404: undefined }).reduxConfig();
    const defaultState = authReducer(undefined, {});
    const store = mockedStore({
      user: { isLogged: true, role: 'basic' },
      canWrite: 'yes',
      canWrite2: 'ohyes',
      canRead: true,
      canRead2: 'ohtrue',
      authProvider: defaultState,
    });
    const authJSX = (
      <Route
        exact
        path="/test"
        render={props => (
          <Gate forRole="basic" store={store} selectedPermissions={['canWrite', 'canRead']}>
            <ProtectedComponent {...props} />
          </Gate>
        )}
      />
    );
    const ConfiguredDom = RouteSkeleton(store, authJSX);
    const wrapper = mount(<ConfiguredDom />);
    expect(wrapper.find('#protected').length).toEqual(1);
  });
  it('Should not login because the user has all the permission but incorrect role', () => {
    const { authReducer } = new Initializer({ ...defaultConfig, Component404: undefined }).reduxConfig();
    const defaultState = authReducer(undefined, {});
    const store = mockedStore({
      user: { isLogged: true, role: 'basic' },
      canWrite: 'yes',
      canWrite2: 'ohyes',
      canRead: true,
      canRead2: 'ohtrue',
      authProvider: defaultState,
    });
    const authJSX = (
      <Route
        exact
        path="/test"
        render={props => (
          <Gate forRole="admin" store={store} selectedPermissions={['canWrite', 'canRead']}>
            <ProtectedComponent {...props} />
          </Gate>
        )}
      />
    );
    const ConfiguredDom = RouteSkeleton(store, authJSX);
    const wrapper = mount(<ConfiguredDom />);
    expect(wrapper.find('#noauth').length).toEqual(1);
  });
  it('Should not login because the user has not all the permission and incorrect role', () => {
    const { authReducer } = new Initializer({ ...defaultConfig, Component404: undefined }).reduxConfig();
    const defaultState = authReducer(undefined, {});
    const store = mockedStore({
      user: { isLogged: true, role: 'basic' },
      canWrite2: 'ohyes',
      canRead: true,
      canRead2: 'ohtrue',
      authProvider: defaultState,
    });
    const authJSX = (
      <Route
        exact
        path="/test"
        render={props => (
          <Gate forRole="admin" store={store} selectedPermissions={['canWrite', 'canRead']}>
            <ProtectedComponent {...props} />
          </Gate>
        )}
      />
    );
    const ConfiguredDom = RouteSkeleton(store, authJSX);
    const wrapper = mount(<ConfiguredDom />);
    expect(wrapper.find('#noauth').length).toEqual(1);
  });
});
