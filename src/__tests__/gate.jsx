import { MemoryRouter, Switch, Route } from 'react-router-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import Gate from '../cerberus/components/Gate';
import Initializer from '../cerberus/initializer';

import {
  NotFoundComponent,
  NoAuthComponent,
  defaultRoleSelector,
  defaultLoggedSelector,
  ProtectedComponent,
  defaultAction,
} from './common';

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
const mockedStore = configureStore();
const configRealStore = (reducer, middlewares) => createStore(combineReducers({ authProvider: reducer }), applyMiddleware(...middlewares));
const CustomAction = result => ({ type: 'CUSTOM_ACTION', auth: result });

const RouteSkeleton = (store, configuredAuth) => () => (
  <Provider store={store}>
    <MemoryRouter initialEntries={['/test']}>
      <Switch>
        <Route exact path="/noauth" component={NoAuthComponent} />
      </Switch>
    </MemoryRouter>
  </Provider>
);

// Setup enzyme for react testing
beforeAll(() => {
  Enzyme.configure({ adapter: new EnzymeAdapter() });
});

describe('RouteLocker component', () => {
  it('Should throw an error because no role or login is provided to gate component', () => {
    const { authReducer, middleware } = new Initializer(defaultConfig).reduxConfig();
    const store = configRealStore(authReducer, [middleware]);
    /*
    const store = mockedStore({
      role: 'admin',
      canWrite: true,
      canRead: true,
      isLogged: 252,
      authProvider: {
        userObject: 252,
        userRole: 'basic',
        internals: {
          // roles: ['basic'],
          reduxAction: CustomAction,
          /*
          permissions: [
              {
                  name: 'canWrite',
                  predicates: [state => state.canWrite],
              },
              {
                name: 'canRead',
                predicates: [state => state.canRead],
            }
            ],
          redirectPath: '/noauth',
        },
      },
    }); */
    const authJSX = (
      <Route
        exact
        path="/test"
        render={props => (<Gate onlyLogin><ProtectedComponent {...props} /></Gate>)}
      />
    );
    const ConfiguredDom = RouteSkeleton(store, authJSX);
    const wrapper = mount(<ConfiguredDom />);
    // expect(wrapper.find('#notfound').length).toEqual(1);
    // store.dispatch({type: 'TEST'})
    const actionsFired = store.getState();
    console.log(actionsFired.authProvider);
    //expect(actionsFired).toEqual([{ type: 'CUSTOM_ACTION', auth: 'authSuccess' }]);
  });
});
