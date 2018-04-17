import React from 'react';
import configureStore from 'redux-mock-store';
import createMiddleware from '../cerberus/redux/middleware';
import { UPDATE_AUTH_INFO, INITIALIZE_AUTH_INTERNALS } from '../cerberus/redux/actions';

const mockedStore = configureStore();

const NotFoundComponent = () => (
  <div id="notfound">NOT FOUND</div>
);

const defaultConfig = {
  roleSelector: state => state.role,
  loginSelector: state => state.isLogged,
};

const defaultAction = { type: 'TEST_ACTION' };

const mockFuncs = () => ({
  next: jest.fn(),
  action: jest.fn(),
});
describe('Redux middleware', () => {
  it(' Should not initialize the configuration of library', () => {
    const loginSelector = state => state.isLogged;
    const roleSelector = state => state.role;
    const authConfig = {
      roles: ['admin', 'basic'],
      redirectPath: '/login',
      roleSelector,
      loginSelector,
      Component404: NotFoundComponent,
    };
    const store = mockedStore({
      role: 'admin',
      isLogged: 252,
      authProvider: {
        userObject: 252,
        userRole: 'admin',
        internals: {},
      },
    });
    const middleware = createMiddleware(authConfig);
    const { next, action } = mockFuncs();
    middleware(store)(next)(action);
    const actions = store.getActions();
    expect(actions).toEqual([]);
  });
  it(' Should initialize the configuration of library', () => {
    const loginSelector = state => state.isLogged;
    const roleSelector = state => state.role;
    const authConfig = {
      roles: ['admin', 'basic'],
      redirectPath: '/login',
      roleSelector,
      loginSelector,
      Component404: NotFoundComponent,
    };
    const expectedActionResult = {
      type: INITIALIZE_AUTH_INTERNALS,
      internals: {
        roles: ['admin', 'basic'],
        redirectPath: '/login',
        Component404: NotFoundComponent,
      },
    };
    const store = mockedStore({
      role: 'admin',
      isLogged: 252,
      authProvider: {
        userObject: 252,
        userRole: 'admin',
      },
    });
    const middleware = createMiddleware(authConfig);
    const { next, action } = mockFuncs();
    middleware(store)(next)(action);
    const actions = store.getActions();
    expect(actions).toEqual([expectedActionResult]);
  });
  it('Should call next at the end of the chain with an action', () => {
    const store = mockedStore({
      role: 'admin',
      isLogged: 252,
      authProvider: {
        userObject: 252,
        userRole: 'admin',
        internals: {},
      },
    });
    const middleware = createMiddleware(defaultConfig);
    const { next } = mockFuncs();
    middleware(store)(next)(defaultAction);
    expect(next).toHaveBeenCalledWith(defaultAction);
  });

  it('Should assign default roleSelector when no one is provided', () => {
    const expectedActionResult = {
      type: UPDATE_AUTH_INFO,
      userObject: 252,
    };
    const store = mockedStore({
      role: 'admin',
      isLogged: 252,
      authProvider: {
        userObject: 253,
        internals: {},
        userRole: 'admin',
      },
    });
    const middleware = createMiddleware({ ...defaultConfig, roleSelector: undefined });
    const { next, action } = mockFuncs();
    middleware(store)(next)(action);
    const actions = store.getActions();
    expect(actions).toEqual([expectedActionResult]);
  });

  it('Should call update action because userObject updated', () => {
    const expectedActionResult = {
      type: UPDATE_AUTH_INFO,
      userObject: 252,
      userRole: 'admin',
    };
    const store = mockedStore({
      role: 'admin',
      isLogged: 252,
      authProvider: {
        userObject: 253,
        internals: {},
        userRole: 'admin',
      },
    });
    const middleware = createMiddleware(defaultConfig);
    const { next, action } = mockFuncs();
    middleware(store)(next)(action);
    const actions = store.getActions();
    expect(actions).toEqual([expectedActionResult]);
  });

  it('Should call update action because userRole updated', () => {
    const expectedActionResult = {
      type: UPDATE_AUTH_INFO,
      userObject: 253,
      userRole: 'basic',
    };
    const store = mockedStore({
      role: 'basic',
      isLogged: 253,
      authProvider: {
        userObject: 253,
        userRole: 'admin',
        internals: {},
      },
    });
    const middleware = createMiddleware(defaultConfig);
    const { next, action } = mockFuncs();
    middleware(store)(next)(action);
    const actions = store.getActions();
    expect(actions).toEqual([expectedActionResult]);
  });

  it('Should not call update action because nothing updated', () => {
    const store = mockedStore({
      role: 'basic',
      isLogged: 253,
      authProvider: {
        userObject: 253,
        userRole: 'basic',
        internals: {},
      },
    });
    const middleware = createMiddleware(defaultConfig);
    const { next, action } = mockFuncs();
    middleware(store)(next)(action);
    const actions = store.getActions();
    expect(actions).toEqual([]);
  });
});
