import Reducer from '../cerberus/redux/reducer';
import AuthInfoUpdate from '../cerberus/redux/actions';


describe('Auth reducer', () => {
  it('Should return default state', () => {
    expect(Reducer(undefined, {})).toEqual({});
  });

  it('Should handle auth stuff updating', () => {
    const reducerResult = Reducer({
        userRole: 'basic',
        userObject: 'lol',
    }, AuthInfoUpdate({ loginSelector: true, roleSelector: 'admin' }));
    expect(reducerResult).toEqual({ userRole: 'admin', userObject: true });
  });
});
