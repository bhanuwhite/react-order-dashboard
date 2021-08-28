# Fetcher

[Back to CONTRIBUTING.md](../../../CONTRIBUTING.md)

This is an in-house implementation of a simplified version of [Relay](https://relay.dev).
There are a lot of differences but the core idea is the same:

  * Each React component declares its fetch dependencies independently.
  * It send the minimum number of request required to fulfill those dependencies.

## How do I use it

You render your React tree as usual, and make use of the MobX store
as well as call to `useXXXFetcher` whenever you want to fetch the data
for a particular endpoint.

The simplest component that uses a `useXXXFetcher` looks like this:

```tsx
const MyCompo: SFC<{}> = observer(({}) => {

    // Notify mobx that we are observing this property
    const xxx = store.domain.xxx;

    // Let the fetcher know that we want to fetch XXX
    // The fetcher probably needs some info from the store that we provide here.
    const { loading, error } = useXXXFetcher(store.view.activeuser.authUserId);

    if (!xxx && !error) {
      if (loading) {
          return <Spinner />;
      }
      return <NotFound />;
    }

    if (error) {
      return <ErrorBox>{error.message}</ErrorBox>;
    }


    return <div>{xxx.prop}</div>;
});
```

## How does it works

When React mount components, all `useXXXFetcher` hooks will let the
`FetcherInstance` know what endpoint they want to fetch.

The only optimization performed is to deduped fetch requests demanded
by different components mounted at the same time. This allows
components to use a declarative style to express which information
they need, allowing them to be mounted anymore without having each of
them to force a parent to fetch information for them.

This means that if you don't have data and then decide to not render your
children components (sometimes you can't), you'll get a **waterfall effect**.

> :info:
>
> You can learn more about waterfall here:
>  - https://relay.dev/docs/guided-tour/rendering/queries/#render-as-you-fetch
>  - https://reactjs.org/docs/concurrent-mode-suspense.html#for-library-authors

> :warning:
>
> This currently rely on the fact that react process all `useEffect` synchronously.
> If this were to change the code would have to be changed a bit.
>
> The currently concurrent mode (experimental) from React might break
> this assumption. This would have to be checked before we migrate
> to a more recent version of React.
>
> See https://reactjs.org/docs/concurrent-mode-intro.html

## Background

Historically, instead of the Fetcher we had something called the poller.
The poller flow was much simpler, but also less flexible. It worked like
this:

```
     observer access store properties
                    |
                    |
                    v
  mobx notify poller property being observed
                    |
                    |
                    v
  poller polls relevant endpoints for as long as
        at least one observer is mounted
```

The nice thing is that the views (observers) don't care about
the poller at all. They are totally decoupled from the fetching
step.

But this has a downside:

You can't pass fetch parameters to the poller without going
through the store. Additionally, the poller was using the properties
being observed as a way to decide which endpoint to poll.

This worked pretty well for the MAS APIs but broke as soon as we
decided to add the Enrollment APIs.

In spirit the Fetcher is similar to the poller. We still decouple
the rendering step from the fetching. But we coupled the API requirement
with the view layer.

The main reason for this is [Relay](https://relay.dev). Facebook is
using Relay in prod with a much larger codebase than us. The coupling
isn't an issue with them. So I'm confident it won't be for us either.

I also want to stress that decoupling is always achieved by adding an additional
level of indirection. It can take multiple forms and it is required at multiple
levels.

## TODOs

 * Compile the fetcher's path with `path-to-regexp` at build time.
   (Looks like TypeScript doesn't support macros so we might have
   to hack something in webpack. Probably https://www.npmjs.com/package/string-replace-loader
   will be enough)

 * Certains endpoints can fetch the same information. For instance, fetching
   from the mas `/mas/v2/nodes?depth=3` make it unecessary to fetch `/mas/v2/nodes?unit_serials=123`.
   We could have an API of the fetcher that allow extending the dedup capabilities of
   the fetcher. Ideally, this should be a really high level API or at the very least
   we should build a high level API on top of it.