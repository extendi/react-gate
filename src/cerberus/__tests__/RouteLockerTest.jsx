import React from 'react';
import { MemoryRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { shallow, mount, render } from 'enzyme';
import configureStore from 'redux-mock-store';
import CerberusAuth from '../../cerberus';
import Enzyme from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';

const mockedStore = configureStore();

const normalCerberusConfig = {
  roles: ['admin', 'basic'],
  loginSelector: store => store.logged,
  roleSelector: store => store.role,
  redirectPath: '/noauth',
};

const CustomAction = { type: 'CUSTOM_ACTION' };
const ProtectedComponent = (props) => {
  console.log('diocane', props)
 return  <div id="protected">I am super protected!</div>
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
});
