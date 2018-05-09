# Configuration Object {#confobject}

The object passed to AuthConfig constructor, holds all the important stuff of library.
Let's analyze the flow type of the object in order to understand all these parts:

```js
    type LoginSelector = (state: any) => boolean;
    type RoleSelector = (state: any) => any;
    type NotFoundComponent = React.ComponentType<any>;
    type PermissionPredicate = (state: any) => boolean;
    type Permissions = {
        name: string,
        predicates: Array<PermissionPredicate>,
    };
    type AuthConfig = {
        roles?: Array<string>,
        loginSelector: LoginSelector,
        permissions?: Array<Permissions>,
        roleSelector?: RoleSelector,
        reduxAction?: ReduxAction,
        redirectPath?: string,
        Component404?: NotFoundComponent,
    };
```

The loginSelector and one of redirectPath or Component404 are the only mandatory fields.

Let's break it in small pieces

### The selectors {#selectors}

Selectors are the core concept of the framework, these functions take the redux state as first argument, so you can intercept the property in the state that corresponds to your login and role status.

`LoginSelector` should not return in a false way (`undefined` /  `false`), you can intercept whatever property is meaningful for your login status (The id of user for example)

`RoleSelector` should return a string, and it represents the current role of the user.

#### Examples

```js
    roleSelector: state => state.user.role
    loginSelector: state => state.user.id
```

### RedirectPath & NotFoundComponent {#redirect}

The redirect path should be a string that represents a route in your application, the route should be binded to a React Router route.

NotFoundComponent takes a react component, that component will be shown instead of protected route.

If both of them are provided, the NotFoundComponent has the priority over the redirectPath.

Obviously, both RedirectPath and NotFoundComponent are shown when the authentication for that route fails.

#### Examples

```js
    import NotFound from 'components/notFound';

    configurationObject = {
        ...authObject,
        Component404: NotFound,
        redirectPath: '/noauth',
    }
```
### Roles {#roles}

The roles are simply an array of strings, they will be compared with the currentRole returned from roleSelector.

### Permissions

The permission object has two fields, one is the name of permission and the other is the array of predicates.

#### Predicates Array

Is an array of predicates that will take as first argument the redux state, so you can intercept all the properties that defined your permission.

You don't have a fixed number of permissions neither in the release of the config object nor in the Gate component.
#### Example

```js
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
```

All the permissions and all the predicates are in AND condition when check for authentication.

### ReduxAction {#redux}

You can specify a custom redux action to dispatch when the authentication phase for each route access is complete.

`ReactGate` will pass, as first argument to your action, the 'result' of the authentication phase.

The result can be:

- `authSuccess` - When the phase succeeds
- `authFailed` - When the phase fails

### Example

```js
    function customAction(authState){
        return {
            type: 'MY_CUSTOM_AUTH_ACTION'
            authState,
        }
    }
```

When you pass this action, it will be dispatched as

```js
    dispatch(customAction(injectedAuthStatus))
    Where injectedAuthStatus is the current authentication phase status.
```