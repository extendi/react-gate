import { setupInternals, INITIALIZE_AUTH_INTERNALS } from '../cerberus/redux/actions';
import { defaultConfig } from './common';

describe('Auth action', () => {
  it('Should return correct payload for reducer', () => {
    expect(setupInternals(defaultConfig)).toEqual({ type: INITIALIZE_AUTH_INTERNALS, internals: defaultConfig });
  });
});
