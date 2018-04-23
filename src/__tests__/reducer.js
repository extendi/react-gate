import Reducer from '../cerberus/redux/reducer';
import { defaultConfig } from './common';
import { INITIALIZE_AUTH_INTERNALS } from '../cerberus/redux/actions';


describe('Auth reducer', () => {
  it('Should return default state', () => {
    const reducer = Reducer(defaultConfig);
    expect(reducer(undefined, {})).toEqual(defaultConfig);
  });

  it('Should initialize auth state', () => {
    const reducer = Reducer(defaultConfig);
    expect(reducer(undefined, { type: INITIALIZE_AUTH_INTERNALS, internals: { Component404: undefined } }))
      .toEqual({ ...defaultConfig, Component404: undefined });
  });
});
