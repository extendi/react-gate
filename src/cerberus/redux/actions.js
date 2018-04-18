export const INITIALIZE_AUTH_INTERNALS = '@@authManager/SETUP_AUTH_INTERNALS';

export const setupInternals = internals => ({
  type: INITIALIZE_AUTH_INTERNALS,
  internals,
});
