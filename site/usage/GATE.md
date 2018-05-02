# Gate Component

The Gate component is the core of the library.

## AvailableProps

```js
    children?: React.Node,
    onlyLogin?: boolean,
    render?: (props: any) => React.Node,
    forRole?: string,
    selectedPermissions?: Array<string>,
```

### Children & Render props

You can choose to render the protected component in two different ways.

#### Render prop

The function passed to `render` prop, takes as first argument these props

```js
{
    forRole, // The role selected for the route
    onlyLogin, // Access to all logged user boolean
    selectedPermissions // Selected permissions for route
}
```

#### Examples

Gate component definition
``` js
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
```
Protected component
```js
    const ProtectedComponent = ({ onlyLogin, selectedPermissions, forRole }) => (
  <div>
    <h2>I am the protected component</h2>
    { onlyLogin && <p> Route rendered for all logged users </p>}
    { forRole && <p> Route rendered for user with role {forRole} </p>}
    { selectedPermissions.length > 0 ?
      <div>
          Requested permissions for this route <br />
        { selectedPermissions.map((p, index) => (
          <p key={index} > {p} </p>
          ))}
      </div>
    : <p> No permissions are requested for this route </p> }
  </div>
);
```

#### Children Prop

You can render your protected component as a Gate's child

```js
    <Route
          exact
          path="/auth"
          render={() => (
            <Gate onlyLogin >
              <Protected />
            </Gate>
        )}
```

### onlyLogin

This boolean prop is used to permit the route access to anyone who did the login.

This prop have priority over forRole and selectedPermission props, so if no role is provided, permissions will be checked for the authentication.

With this prop the component will pick the loginStatus using loginSelector, defined in the configuration object.

### forRole

This prop defines the role which has access to the route and the selected role must be among the possible roles declared in the configuration.

If this is not true, the component will raise an error.

#### Example

```js
    <Route
          exact
          path="/permissionsauth"
          render={() => (
            <Gate
              forRole="admin"
              render={authProps => (<Protected {...authProps} />)}
            />
        )}
        />
```

### selectedPermissions

This prop should be an array of strings which should indicate the names of the permissions we want to apply to the route.

The names of the permissions must be the ones declared in the configuration.

It is possible to show multiple permissions for single routes.

The permissions will be in AND condition with the role.

Permissions should be specified with forRole prop.

#### Example

```js
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
```