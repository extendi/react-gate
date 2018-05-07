<p align="center">
    <img src="logo.svg" height="200">
</div>

[![Build Status](https://travis-ci.org/extendi/react-gate.svg?branch=master)](https://travis-ci.org/extendi/react-gate)
[![Coverage Status](https://coveralls.io/repos/github/extendi/react-gate/badge.svg?branch=master)](https://coveralls.io/github/extendi/react-gate?branch=master)


</br>
</br>

`React-Gate` is a permission/authentication solution for React application built on top of `React Router` and `Redux`.


### The Goal

``React Gate`` provides a backend-indipendent solution, you can even choose not to use backend at all.

This library provides a React component called Gate, as the name suggest, you can use the component to deny the access to certain parts of your application according to provided configuration.

The package was thought to be frankly declarative and easy to set up.

# Getting Started

```bash   
    yarn add react-gate
```

Import the Initializer object and the Gate component
```js
    import { Initializer, Gate } from 'react-gate';
```
Configure the Library giving an AuthConfig object to the initializer constructor

```js
const GateConfig = {
    roles: ['admin', 'basic'],
    roleSelector: state => state.user.role,
    loginSelector: state => state.user.id,
    redirectPath: '/noauth',
    permissions: [
        {
        name: 'canWrite',   predicates: [state => state.user.canWrite, state => state.user.canWrite2],
        },
        {
        name: 'canRead',
        predicates: [state => state.user.canRead, state => state.user.canRead2],
        },
    ],
};
const GateInstance = new Initializer(GateConfig);
```

Retrieve the `React Gate` reducer and mount to your existing reducer with the key authProvider

```js
    const { authReducer } = GateInstance.reduxConfig();
    const store = createStore(
        combineReducers({ user: userReducer, authProvider: authReducer }),
    );
```


#### Route locking 

The gate component protects the auth route, in this example is configured to consent access only to logged user.

``` js
    <Route
          exact
          path="/auth"
          render={props => (
            <Gate onlyLogin >
              <Protected {...props} />
            </Gate>
        )}
        />
```
See the [Docs](https://extendi.github.io/react-gate/) for futher details

## Want to contribute?

See the [Contribution](https://extendi.github.io/react-gate/contribute/CONTRIBUTE.html) section of the docs
