// @flow

import type { PermissionPredicate } from '../types';

function closurize(state: any, predicate: PermissionPredicate): PermissionPredicate {
  return function closured() {
    return predicate(state);
  };
}


export default closurize;
