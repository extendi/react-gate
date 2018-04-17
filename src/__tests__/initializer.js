import Initializer from '../cerberus/initializer';
import { NotFoundComponent, defaultRoleSelector, defaultLoggedSelector, defaultAction } from './common';

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

describe('Library initializer', () => {
  it('Should not throw an error for configuration input', () => {
    const instance = () => new Initializer(defaultConfig);
    expect(instance).not.toThrowError();
  });
  it('Should trow an error if no loginSelector provided', () => {
    const instance = () => new Initializer({ ...defaultConfig, loginSelector: undefined });
    expect(instance).toThrowError();
  });
  it('Should trow an error if no redirectPath or Component404 provided', () => {
    const instance = () => new Initializer({ ...defaultConfig, Component404: undefined, redirectPath: undefined });
    expect(instance).toThrowError();
  });
  it('Should return the redux configuration', () => {
    const intializer = new Initializer(defaultConfig);
    const spyed = jest.spyOn(intializer, 'reduxConfig');
    const result = intializer.reduxConfig();
    expect(spyed.mock.instances[0].configuration).toEqual(defaultConfig);
    expect(result).toHaveProperty('authReducer');
    expect(result).toHaveProperty('middleware');
  });
});
