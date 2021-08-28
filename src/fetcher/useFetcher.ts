/**
 * Fetcher
 * -------
 *
 * This component will communicate with the ex
 *
 *
 * The Fetcher is not perfect and suffer from the waterfall
 * problem mentioned by Relay. We have to render the components
 * to know what data they want us to fetch, so in a deep tree
 * parents will get their data first and children last.
 *
 * This problem is solved with static analysis in Relay but for
 * us, in places where this causes a problem we can move the
 * Fetcher instance higher up in the tree.
 */

import * as React from 'react';
import { useFetcherInstance } from './context';
import { FetchOptions, FetchError } from './instance';
import { FetchState, StateChangeCallback } from './instance/observer';

export interface UseFetcherState extends FetchState {
    /**
     * Force a fetch now. Can be handy if you want to refresh based on
     * a user event (such as a button click.)
     */
    fetchNow(): Promise<void>
}

/**
 * Fetch data on the backend associated with the provided endpoint.
 * For more information see `@/fetcher/README.md`
 *
 * @param endpoint endpoint to fetch
 * @param options fetch options
 */
export function useFetcher(endpoint: string, options: FetchOptions = {}): UseFetcherState {

    const { isInvalid } = options;
    const fetcherInstance = useFetcherInstance();
    const [{ loading, error }, setState] = React.useState(fetcherInstance.getDefaultFetchState());
    const optsRef = React.useRef({ endpoint, options: { ...options } });

    const fetchNow = React.useCallback(() => {
        if (!isInvalid) {
            return fetcherInstance.fetchNow(endpoint);
        }
        return Promise.resolve();
    }, [ endpoint, isInvalid ]);

    React.useEffect(() => {

        // Update the values in optsRef
        optsRef.current.endpoint = endpoint;
        optsRef.current.options = { ...options };

        // Register interest in fetching with provided props
        // Deregister interest in fetching with provided props
        if (!isInvalid) {
            fetcherInstance.registerInterest(endpoint, options, setState);
        }
        return () => {
            if (!isInvalid) {
                fetcherInstance.unregisterInterest(endpoint, options, setState);
            }
        };
    }, [endpoint, options.isInvalid, options.pollInterval]);

    return {
        // If isInvalid is true, then the loading state is irrelevant
        loading: (
            loading ||
            // Loading should be true if the endpoint was just changed or if the options have just changed
            (
                optsRef.current.endpoint !== endpoint ||
                optsRef.current.options.isInvalid !== options.isInvalid ||
                optsRef.current.options.pollInterval !== options.pollInterval
            )
        ) && !isInvalid,
        // Similar logic for error, if it's not loading and not invalid
        // we show the error. Otherwise, it's irrelevant.
        error: !loading && !isInvalid ? error : undefined,
        fetchNow,
    };
}

/**
 * Fetch data on the backend associated with zero or more endpoints.
 * You have to be careful to always provide a different array whenever the array
 * content has changed.
 * Otherwise this hook won't work correctly. It will not fetch when it should.
 * The implementation prevent overfetching if the array content hasn't changed.
 * Note that changing the element order in the endpoints array will trigger a fetch.
 *
 * @param endpoints list of endpoints to fetch
 * @param options fetch options
 */
export function useFetchEndpoints(endpoints: string[], options: FetchOptions = {}): UseFetcherState {

    // For this fetcher we ignore the isInvalid options
    if (process.env.NODE_ENV === 'development' && options.isInvalid) {
        console.warn('options.isInvalid is unused for useFetchers. Make sure you only provide an array with valid endpoints');
    }

    // Stable endpoints is basically the same array as endpoints but the array reference
    // doesn't change if the endpoints array content hasn't changed.
    const fetcherInstance = useFetcherInstance();
    const [stableEndpoints, setStableEndpoints] = React.useState(endpoints);
    const endpointIsLoading = React.useRef([] as boolean[]);
    const [{ loading, error }, setAggregatedState] = React.useState(fetcherInstance.getDefaultFetchState());

    React.useEffect(() => {
        // Small optimization for the first render.
        if (endpoints === stableEndpoints) {
            return;
        }

        // Small optimization for when size has changed.
        if (endpoints.length !== stableEndpoints.length) {
            setStableEndpoints([...endpoints]);
            return;
        }

        // Deep comparison
        for (let i = 0; i < endpoints.length; ++i) {
            if (endpoints[i] !== stableEndpoints[i]) {
                setStableEndpoints([...endpoints]);
                break;
            }
        }

    }, [endpoints]); // Re-run whenever the endpoints array has changed.

    function setState(endpointId: number): StateChangeCallback {
        return (newState) => {
            endpointIsLoading.current[endpointId] = newState.loading;

            if (newState.error) {
                // Change the entire aggregated state if there's an error.
                setAggregatedState({
                    loading: endpointIsLoading.current.some(el => el),
                    error: newState.error,
                });
            } else {
                // Only updated the loading status.
                setAggregatedState((prevState) => ({
                    ...prevState,
                    loading: endpointIsLoading.current.some(el => el),
                }));
            }
        };
    }

    React.useEffect(() => {

        // We keep the created callbacks, because we have to specify the
        // same callback reference to unregisterInterest.
        const setStateCallbacks = [] as StateChangeCallback[];
        const loadingMap = endpointIsLoading.current;

        // Clear the map, because it contains outdated information
        loadingMap.splice(0, loadingMap.length);

        // Iterate over all endpoint and register interest for them.
        for (let i = 0; i < stableEndpoints.length; i++) {
            const endpoint = stableEndpoints[i];
            const setStateForEndpoint = setState(i);
            loadingMap.push(true);
            setStateCallbacks.push(setStateForEndpoint);
            fetcherInstance.registerInterest(endpoint, options, setStateForEndpoint);
        }

        return () => {
            for (let i = 0; i < setStateCallbacks.length; i++) {
                const endpoint = stableEndpoints[i];
                const setStateForEndpoint = setStateCallbacks[i];
                fetcherInstance.unregisterInterest(endpoint, options, setStateForEndpoint);
            }
        };
    }, [stableEndpoints, options.pollInterval]);

    async function fetchNow() {
        await Promise.all(stableEndpoints.map(endpoint => fetcherInstance.fetchNow(endpoint)));
    }

    return { loading, error, fetchNow };
}

/**
 * Merge multiple useFetcher state together for convenience.
 * This allow to combine multiple calls to useFetcher such that
 * in the situation where we want to add a `useFetcher` call to `/baz`,
 * we change the following code:
 *
 * ```ts
 * const { loading, error } = useFetcher('/foobar');
 * ```
 *
 * to:
 *
 * ```ts
 * const { loading, error } = mergeFetchers(
 *     useFetcher('/foobar'),
 *     useFetcher('/baz', { fetchNow: true }),
 * );
 * ```
 * @param useFetchers call to useXXXFetcher to merge together.
 */
export function mergeFetchers(...useFetchers: UseFetcherState[]): UseFetcherState {

    let loading = false;
    let error: FetchError | undefined;

    for (const fetcher of useFetchers) {
        loading = loading || fetcher.loading;
        error = error || fetcher.error;
    }

    async function fetchNow() {
        await Promise.all(useFetchers.map(f => f.fetchNow()));
    }

    return {
        loading,
        error,
        fetchNow,
    };
}