import { MemoryRouter, Switch, Route } from 'react-router-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import Enzyme, { mount, render, shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { setupInternals } from '../cerberus/redux/actions';
import Gate from '../cerberus/components/Gate';
import Initializer from '../cerberus/initializer';
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
  mockActionUpdate,
  errorBoundary,
  mockActionNewSelector,
  bindLocationChanger,
} from './common';

const LocationChanger = bindLocationChanger();
beforeEach(() => {
  jest.spyOn(console, 'error');
  global.console.error.mockImplementation(() => {});
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
      predicates: [state => state.canWrite],
    },
    {
      name: 'canRead',
      predicates: [state => state.canRead],
    },
  ],
  reduxAction: defaultAction,
};

/* eslint-disable max-len */
const configRealStore = reducer => createStore(
  combineReducers({ authProvider: reducer, user: mockReducer }),
  { user: { isLogged: true, role: 'basic' } },
);
const CustomAction = result => ({ type: 'CUSTOM_ACTION', auth: result });

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
    const ErrorHandler = errorBoundary();
    const authJSX = (
      <Route
        exact
        path="/test"
        render={props => (
          <ErrorHandler>
            <Gate onlyLogin>
              <LocationChanger>
                <ProtectedComponent {...props} />
              </LocationChanger>
            </Gate>
          </ErrorHandler>
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

  it('Should first not login, because role is not present, than login when roles changed in the configuration', () => {
    const { authReducer } = new Initializer({ ...defaultConfig, Component404: undefined }).reduxConfig();
    const store = configRealStore(authReducer);
    const ErrorHandler = errorBoundary();
    const AuthJSX = (
      <ErrorHandler>
        <Gate role="user" store={store} >
          <ProtectedComponent />
        </Gate>
      </ErrorHandler>
    );
    store.dispatch(mockActionRemove());
    mount(AuthJSX)
    /*
    const noauthRouting = wrapper.find('#routenoauth');
    const authRouting = wrapper.find('#routeprotected');
    expect(noauthRouting.length).toEqual(1);
    expect(authRouting.length).toEqual(1);
    expect(wrapper.find('#noauth').length).toEqual(1); */
    /*
    store.dispatch(mockActionNewSelector());
    store.dispatch(setupInternals({ loginSelector: state => state.newSelector }));
    console.log(store.getState().authProvider.loginSelector.toString());
    authRouting.simulate('click');
    expect(wrapper.find('#protected').length).toEqual(1); */
  });
});
