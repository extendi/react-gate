import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import NotFound from './components/NotFound';
import NoAuth from './components/NoAuth';
import userReducer from './reducer';

const store = createStore(userReducer);

const App = () => (
  <Provider store={store} >
    <HashRouter>
      <Switch>
        <Route exact path="/home" component={Home} />
        <Route component={Home} />
      </Switch>
    </HashRouter>
  </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));
