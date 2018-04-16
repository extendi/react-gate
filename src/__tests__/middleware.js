import createMiddleware from '../cerberus/redux/middleware';

const defaultConfig = {
  roleSelector: state => state.role,
  loginSelector: state => state.isLogged,
};

const mockFuncs = () => ({
  next: jest.fn(),
  action: jest.fn(),
});
describe('Redux middleware', () => {
  it('Should call next at the end of the chain', () => {
    const middleware = createMiddleware(defaultConfig);
    const { next } = mockFuncs();
    
  });
});
