This folder was created to avoid bloating webpack output in dev.
We currently depends on the execellent `@material-ui/lab` project
which expose a `useAutocomplete` hook which support a lot of feature
to implement your own component with autocompletion.

However, the `useAutocomplete` hook depends on two function from
the `@material-ui/core/utils` module. This folder re-export those
two functions and resolution is made by webpack with an alias.

We could have added the `@material-ui/core` package as a dependency
but this would pull every component that this package has defined
and new developers could be tempted to use them to write their code.

The design we use is not compatible with the material design.
Thus, we want to avoid pulling those components.