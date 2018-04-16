import Reducer from '../cerberus/redux/reducer';
import { updateInfo, setupInternals } from '../cerberus/redux/actions';


describe('Auth reducer', () => {
  it('Should return default state', () => {
    expect(Reducer(undefined, {})).toEqual({});
  });

  it('Should handle auth stuff updating', () => {
    const reducerResult = Reducer({
      userRole: 'basic',
      userObject: 'lol',
    }, updateInfo({ loginSelector: true, roleSelector: 'admin' }));
    expect(reducerResult).toEqual({ userRole: 'admin', userObject: true });
  });

  it('Should handle auth initialization', () => {
    const loginSelector = jest.fn();
    const roleSelector = jest.fn();
    const reducerResult = Reducer({
      userRole: 'basic',
      userObject: 'lol',
    }, setupInternals({
      loginSelector,
      roleSelector,
      redirectPath: '/login',
    }));
    expect(reducerResult).toEqual({
      userRole: 'basic',
      userObject: 'lol',
      internals: {
        loginSelector,
        roleSelector,
        redirectPath: '/login',
      },
    });
  });
});
