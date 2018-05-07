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

Retrieve the `ReactGate` reducer and mount to your existing reducer with the key authProvider

```js
    const { authReducer } = GateInstance.reduxConfig();
    const store = createStore(
        combineReducers({ user: userReducer, authProvider: authReducer }),
    );
```

Now, you are ready!

#### Route locking example

The gate component protects the auth route, and it is configured to consent access only to logged user.

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

See Components and Configuration in order to learn more about the Gate props and configuration object.