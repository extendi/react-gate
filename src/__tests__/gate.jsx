import { MemoryRouter, Switch, Route } from 'react-router-dom';
import React from 'react';
import { Provider } from 'react-redux';
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import Gate from '../cerberus/components/Gate';

/* eslint-disable max-len */
const mockedStore = configureStore();
const CustomAction = result => ({ type: 'CUSTOM_ACTION', auth: result });

const normalCerberusConfig = {
  roles: ['admin', 'basic'],
  loginSelector: store => store.logged,
  roleSelector: store => store.role,
  redirectPath: '/noauth',
};

const ProtectedComponent = (props) => {
  console.log('diocane', props);
  return <div id="protected">I am super protected!</div>;
};
const NotFoundComponent = () => (
  <div id="notfound">Nun c sta nient u zì!</div>
);
const NoAuthComponent = () => (
  <div id="noauth">Wagliò aro vaj?!</div>
);

const RouteSkeleton = (store, configuredAuth) => () => (
  <Provider store={store}>
    <MemoryRouter initialEntries={['/test']}>
      <Switch>
        {configuredAuth}
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
    const store = mockedStore({
      role: 'admin',
      isLogged: 252,
      authProvider: {
        userObject: 252,
        userRole: 'admin',
        internals: {
          roles: ['basic'],
          reduxAction: CustomAction,
          permissions: [],
          redirectPath: '/noauth',
        },
      },
    });
    const authJSX = (
      <Route
        exact
        path="/test"
        render={props => (<Gate role="basic"><ProtectedComponent {...props} /></Gate>)}
      />
    );
    const ConfiguredDom = RouteSkeleton(store, authJSX);
    const wrapper = mount(<ConfiguredDom />);
    // expect(wrapper.find('#notfound').length).toEqual(1);
    // const actionsFired = store.getActions();
    // expect(actionsFired).toEqual([{ type: 'CUSTOM_ACTION', auth: 'authFailed' }]);
  });
});
