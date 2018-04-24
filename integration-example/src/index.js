import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import NoAuth from './components/NoAuth';
import Protected from './components/Protected';
import userReducer from './reducer';
import { Initializer, Gate } from '../../lib/react-gate';

const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({
  serialize: {
    options: {
      undefined: true,
      function(fn) { return fn.toString(); },
    },
  },
});
const GateConfig = {
  roles: ['admin', 'basic'],
  roleSelector: state => state.user.role,
  loginSelector: state => state.user.id,
  redirectPath: '/noauth',
  permissions: [
    {
      name: 'canWrite',
      predicates: [state => state.user.canWrite, state => state.user.canWrite2],
    },
    {
      name: 'canRead',
      predicates: [state => state.user.canRead, state => state.user.canRead2],
    },
  ],
};

const { authReducer } = new Initializer(GateConfig).reduxConfig();
const store = createStore(
  combineReducers({ user: userReducer, authProvider: authReducer }),
  reduxDevTools,
);

const App = () => (
  <Provider store={store} >
    <HashRouter>
      <Switch>
        <Route exact path="/home" component={Home} />
        <Route
          exact
          path="/auth"
          render={props => (
            <Gate onlyLogin >
              <Protected {...props} />
            </Gate>
        )}
        />
        <Route
          exact
          path="/roleauth"
          render={props => (
            <Gate forRole="admin" >
              <Protected {...props} />
            </Gate>
        )}
        />
        <Route
          exact
          path="/permissionsauth"
          render={() => (
            <Gate
              forRole="admin"
              selectedPermissions={['canRead', 'canWrite']}
              render={authProps => (<Protected {...authProps} />)}
            />
        )}
        />
        <Route exact path="/noauth" component={NoAuth} />
        <Route component={Home} />
      </Switch>
    </HashRouter>
  </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));
