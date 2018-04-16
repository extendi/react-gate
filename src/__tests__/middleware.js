import configureStore from 'redux-mock-store';
import createMiddleware from '../cerberus/redux/middleware';
import { UPDATE_AUTH_INFO } from '../cerberus/redux/actions';

const mockedStore = configureStore();

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
  it('Should call next at the end of the chain with an action', () => {
    const store = mockedStore({
      role: 'admin',
      isLogged: 252,
      authProvider: {
        userObject: 252,
        userRole: 'admin',
      },
    });
    const middleware = createMiddleware(defaultConfig);
    const { next } = mockFuncs();
    middleware(store)(next)(defaultAction);
    expect(next).toHaveBeenCalledWith(defaultAction);
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
      },
    });
    const middleware = createMiddleware(defaultConfig);
    const { next, action } = mockFuncs();
    middleware(store)(next)(action);
    const actions = store.getActions();
    expect(actions).toEqual([]);
  });

});
