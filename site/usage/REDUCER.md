# Reducer

`ReactGate` should be initialized by the store with the authProvider reducer.

This reducer holds the configuration of library and handles the runtime changing of settings.

## Changing configuration 

You can change the configuration which is the object passed to Initializer constructor to app runtime.

To do it it is necessary the using of the `RefreshConfig` action.

The action takes as only parameter another configuration object, which will be merged in the old configuration object.

### Example

```js
    Previous configuration
    {
        ...,
        Component404: NotFoundComponent,
        redirectPath: '/noauth',
    }
    Then
    import { RefreshConfig } from 'react-gate';

    dispatch(RefreshConfig({
        redirectPath: '/notlogged',
        Component404: undefined,
    }));

    Updated Configuration
    {
        ...,
        redirectPath: '/notlogged',
        Component404: undefined,
    }
```