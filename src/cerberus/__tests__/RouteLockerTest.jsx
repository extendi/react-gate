import React from 'react';
import { MemoryRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import Enzyme, { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import CerberusAuth from '../../cerberus';

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

const NoAuthComponent = () => (
  <div id="noauth">Wagliò aro vaj?!</div>
);

const RouteSkeleton = (store, authHOC) => () => (
  <Provider store={store}>
    <MemoryRouter initialEntries={['/test']}>
      <Switch>
        <Route exact path="/test" component={authHOC(ProtectedComponent)} />
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
  it('Should block access to non logged users', () => {
    const cerberusInstance = new CerberusAuth(normalCerberusConfig);
    const loggedHoc = cerberusInstance.getHOCForLogin();
    const ConfiguredDom = RouteSkeleton(mockedStore({ logged: false }), loggedHoc);
    const wrapper = mount(<ConfiguredDom />);
    expect(wrapper.find('#noauth').length).toEqual(1);
  });

  it('Should consent access to logged users', () => {
    const cerberusInstance = new CerberusAuth(normalCerberusConfig);
    const loggedHoc = cerberusInstance.getHOCForLogin();
    const ConfiguredDom = RouteSkeleton(mockedStore({ logged: true }), loggedHoc);
    const wrapper = mount(<ConfiguredDom />);
    expect(wrapper.find('#protected').length).toEqual(1);
  });

  it('Should block access to non admin users', () => {
    const cerberusInstance = new CerberusAuth(normalCerberusConfig);
    const adminHOC = cerberusInstance.getHOCForRole('admin');
    const ConfiguredDom = RouteSkeleton(mockedStore({ role: 'basic' }), adminHOC);
    const wrapper = mount(<ConfiguredDom />);
    expect(wrapper.find('#noauth').length).toEqual(1);
  });

  it('Should consent access to admin users', () => {
    const cerberusInstance = new CerberusAuth(normalCerberusConfig);
    const adminHOC = cerberusInstance.getHOCForRole('admin');
    const ConfiguredDom = RouteSkeleton(mockedStore({ role: 'admin' }), adminHOC);
    const wrapper = mount(<ConfiguredDom />);
    expect(wrapper.find('#protected').length).toEqual(1);
  });

  it('Should consent access to admin users and fire redux action with appropriate result', () => {
    const cerberusInstance = new CerberusAuth({ ...normalCerberusConfig, reduxAction: CustomAction });
    const adminHOC = cerberusInstance.getHOCForRole('admin');
    const mockStore = mockedStore({ role: 'admin' });
    const ConfiguredDom = RouteSkeleton(mockStore, adminHOC);
    const wrapper = mount(<ConfiguredDom />);
    expect(wrapper.find('#protected').length).toEqual(1);
    const actionsFired = mockStore.getActions();
    expect(actionsFired).toEqual([{ type: 'CUSTOM_ACTION', auth: 'authSuccess' }]);
  });

  it('Should block access to admin users and fire redux action with appropriate result', () => {
    const cerberusInstance = new CerberusAuth({ ...normalCerberusConfig, reduxAction: CustomAction });
    const adminHOC = cerberusInstance.getHOCForRole('admin');
    const mockStore = mockedStore({ role: 'basic' });
    const ConfiguredDom = RouteSkeleton(mockStore, adminHOC);
    const wrapper = mount(<ConfiguredDom />);
    expect(wrapper.find('#noauth').length).toEqual(1);
    const actionsFired = mockStore.getActions();
    expect(actionsFired).toEqual([{ type: 'CUSTOM_ACTION', auth: 'authFailed' }]);
  });

  it('Should consent access to logged users and fire redux action with appropriate result', () => {
    const cerberusInstance = new CerberusAuth({ ...normalCerberusConfig, reduxAction: CustomAction });
    const adminHOC = cerberusInstance.getHOCForLogin();
    const mockStore = mockedStore({ logged: true });
    const ConfiguredDom = RouteSkeleton(mockStore, adminHOC);
    const wrapper = mount(<ConfiguredDom />);
    expect(wrapper.find('#protected').length).toEqual(1);
    const actionsFired = mockStore.getActions();
    expect(actionsFired).toEqual([{ type: 'CUSTOM_ACTION', auth: 'authSuccess' }]);
  });

  it('Should block access to logged users and fire redux action with appropriate result', () => {
    const cerberusInstance = new CerberusAuth({ ...normalCerberusConfig, reduxAction: CustomAction });
    const adminHOC = cerberusInstance.getHOCForLogin();
    const mockStore = mockedStore({ logged: false });
    const ConfiguredDom = RouteSkeleton(mockStore, adminHOC);
    const wrapper = mount(<ConfiguredDom />);
    expect(wrapper.find('#noauth').length).toEqual(1);
    const actionsFired = mockStore.getActions();
    expect(actionsFired).toEqual([{ type: 'CUSTOM_ACTION', auth: 'authFailed' }]);
  });

  it('Should consent access to admin users with write/read permission and fire redux action with appropriate result', () => {
    const cerberusInstance = new CerberusAuth({
      ...normalCerberusConfig,
      reduxAction: CustomAction,
      permissions: [{ name: 'write', predicates: [state => state.canWrite, state => state.canRead] }],
    });
    const adminHOC = cerberusInstance.getHOCForRole('admin', 'write');
    const mockStore = mockedStore({ role: 'admin', canWrite: true, canRead: true });
    const ConfiguredDom = RouteSkeleton(mockStore, adminHOC);
    const wrapper = mount(<ConfiguredDom />);
    expect(wrapper.find('#protected').length).toEqual(1);
    const actionsFired = mockStore.getActions();
    expect(actionsFired).toEqual([{ type: 'CUSTOM_ACTION', auth: 'authSuccess' }]);
  });

  it('Should block access to basic users without write/read permission and fire redux action with appropriate result', () => {
    const cerberusInstance = new CerberusAuth({
      ...normalCerberusConfig,
      reduxAction: CustomAction,
      permissions: [{ name: 'write', predicates: [state => state.canWrite, state => state.canRead] }],
    });
    const adminHOC = cerberusInstance.getHOCForRole('basic', 'write');
    const mockStore = mockedStore({ role: 'basic', canWrite: true, canRead: false });
    const ConfiguredDom = RouteSkeleton(mockStore, adminHOC);
    const wrapper = mount(<ConfiguredDom />);
    expect(wrapper.find('#noauth').length).toEqual(1);
    const actionsFired = mockStore.getActions();
    expect(actionsFired).toEqual([{ type: 'CUSTOM_ACTION', auth: 'authFailed' }]);
  });

  it('Should block access to admin users with write/read permission because his role is not basic and fire redux action with appropriate result', () => {
    const cerberusInstance = new CerberusAuth({
      ...normalCerberusConfig,
      reduxAction: CustomAction,
      permissions: [{ name: 'wr', predicates: [state => state.canWrite, state => state.canRead] }],
    });
    const adminHOC = cerberusInstance.getHOCForRole('basic', 'wr');
    const mockStore = mockedStore({ role: 'admin', canWrite: true, canRead: false });
    const ConfiguredDom = RouteSkeleton(mockStore, adminHOC);
    const wrapper = mount(<ConfiguredDom />);
    expect(wrapper.find('#noauth').length).toEqual(1);
    const actionsFired = mockStore.getActions();
    expect(actionsFired).toEqual([{ type: 'CUSTOM_ACTION', auth: 'authFailed' }]);
  });
});
