import { Store } from '@/store';
import { RequestMerger, MergeOperation } from './request-mergers';
import { FetchAndResponseDispatcher, EndpointData, ResponseHandler, FetchError } from './fetch';
import { FetchObservers, StateChangeCallback, FetchState } from './observer';
import { PollInterval } from './poll-interval';

export type { FetchError };

export interface FetchOptions {
    /**
     * Ask the fetcher to poll for that entry every pollInterval milliseconds.
     * If multiple views ask for different pollInterval, only the smaller
     * value is respected.
     */
    pollInterval?: number

    /**
     * Is the constructed fetch URL valid?
     *
     * There are many cases where during render the data hasn't been fully initialized
     * and we will request data to invalid endpoints. To cope with that we have this
     * flag. It skip the fetch if the request is invalid.
     */
    isInvalid?: boolean
}

export class FetcherInstance {

    constructor(
        private store: Store,
    ) {}

    // Fetcher send request and dispatch them on a
    private fetcher = new FetchAndResponseDispatcher(this.store);
    // Request merger tries to merge request together
    private requestMerger = new RequestMerger();
    // StateChangeCallback are basically observers and they observe a single endpoint
    private observers = new Map<EndpointData, FetchObservers>();
    // Poll interval values provided by observers.
    private pollIntervals = new Map<EndpointData, PollInterval>();

    // Query waiting to be sent
    private waitingQueries = new Set<EndpointData>();
    // Pending queries (request have been fired)
    private pendingQueries = new Set<EndpointData>();
    // Timeout id for the schedule fetch method
    private debounceTimeoutId: number = 0;

    /**
     * Set a handler with the specific matcher following the same convention
     * as express.js.
     *
     * Example worth a thousand words:
     *
     * ```ts
     * fetcherInstance.get('/es/enroll/:userId/config', action((res, params) => {
     *     const result = enrollUserConfig.validate(res.body);
     *     if (result.type === 'error') {
     *         return result;
     *     }
     *     const { value } = result;
     *     store.domain.enrollment.users.set(params.userId, value);
     * }));
     * ```
     * @param matcher Matcher that follows express conventions.
     * @param responseHandler handler that should validate the response and mutate the store.
     */
    get(matcher: string, responseHandler: ResponseHandler) {
        this.fetcher.pushMatcher(matcher, responseHandler);
    }

    /**
     * Set a handler with the specific matcher following the same convention
     * as express.js.
     *
     * This function works like `get` but all 40x and 50x are forwarded to the responseHandler.
     * So you need to handle those before looking at the response body.
     *
     * @param matcher Matcher that follows express conventions.
     * @param responseHandler handler that process the response from the request.
     */
    getWithHTTPErrors(matcher: string, responseHandler: ResponseHandler) {
        this.fetcher.pushMatcher(matcher, responseHandler, true);
    }

    /**
     * Register a merge operation to reduce the number of request being made
     * against an endpoint when another endpoint can be used.
     *
     * For instance, let's assume N components are querying those endpoints:
     *
     *      GET /users/0
     *      GET /users/1
     *      ...
     *      GET /users/N
     *
     * Because those endpoints are not exactly the same the fetcher won't dedup
     * them. However if the following merge has been defined:
     *
     *      instance.merge('/users/:userId', (reqs) => `/users/${reqs.map(r => r.userId).join(',')}`)
     *
     * Then only the following request will be sent:
     *
     *      GET /users/0,1,2,...,N
     *
     *
     * @param matcher match request to merge together
     * @param merge merge function that merge the matched request together
     */
    merge(matcher: string, merge: MergeOperation) {
        this.requestMerger.registerMerger(matcher, merge);
    }

    /**
     * Cleanup function to be called only to remove all the handlers.
     */
    clearHandlers() {
        this.fetcher.clearHandlers();
    }

    getDefaultFetchState(): FetchState {
        return {
            loading: true,
        };
    }

    registerInterest(endpoint: EndpointData, options: FetchOptions, stateChanged: StateChangeCallback) {

        let observers = this.observers.get(endpoint);
        if (!observers) {
            observers = new FetchObservers();
            this.observers.set(endpoint, observers);
        }

        observers.addObserver(stateChanged);
        this.setPollIntervalIfNeeded(endpoint, options);

        // Trigger a fetch now and register a pollInterval if there's any to
        // register
        this.scheduleFetch(endpoint);
    }

    fetchNow(endpoint: EndpointData): Promise<void> {

        const observers = this.observers.get(endpoint);
        if (!observers) {
            console.error(`Bug found! Couldn't fetchNow ${endpoint}`);
            return Promise.resolve();
        }

        this.scheduleFetch(endpoint);
        return observers.waitNextFetch();
    }

    unregisterInterest(endpoint: EndpointData, options: FetchOptions, stateChanged: StateChangeCallback) {

        const observers = this.observers.get(endpoint);
        if (!observers) {
            console.error(`FetchObservers not found for ${endpoint}! But we tried to deregister interest. Maybe it's called to often?`);
            return;
        }

        observers.removeObserver(stateChanged);
        this.clearPollIntervalIfNeeded(endpoint, options);
    }

    private scheduleFetch(endpoint: EndpointData) {

        // If the request has been already sent return now.
        if (this.pendingQueries.has(endpoint)) {
            return;
        }

        // Add query we want to fetch. Note: this is a set so we dedup queries here :)
        this.waitingQueries.add(endpoint);

        // Debounce timeout (this is a simple way to dedup fetch in a synchronous context)
        // Also, if in the future React starts running useEffects hooks not synchronously
        // we can add a small delay to the setTimeout here to make sure this setTimeout
        // run last.
        clearTimeout(this.debounceTimeoutId);
        this.debounceTimeoutId = setTimeout(() => this.prepareFetchs());
    }

    /**
     * This function will assume that pendingQueries needs to be processed
     * which means that mergers will be run against all pending queries now.
     */
    private prepareFetchs() {

        // Process pending queries and find the one we can merge.
        for (const originalEndpoint of this.waitingQueries) {

            // Mark request as pending
            this.pendingQueries.add(originalEndpoint);

            // Change state to be loading (a fetch is being scheduled)
            this.observers.get(originalEndpoint)?.notifyResult({ loading: true });

            if (!this.requestMerger.matchAndStoreResult(originalEndpoint)) {

                // This request can't be merged, let's fire it.
                this.fetcher.fetch(originalEndpoint).then(fetchError => {

                    // Mark the query has no longer pending
                    this.pendingQueries.delete(originalEndpoint);

                    // Notify all observers.
                    this.observers.get(originalEndpoint)?.notifyResult({ loading: false, error: fetchError });
                });
            }
        }

        // Clear queries waiting to be processed
        this.waitingQueries.clear();

        // Process the request that have been merged.
        this.requestMerger.mergeMatchedQueriesAndClear((newEndpoints, originalQueries) => {

            if (newEndpoints.length === 0) {
                console.error(`Error encountered while merging ${originalQueries}: no new endpoint generated`);
                return;
            }

            if (newEndpoints.length === 1) {
                this.fetcher.fetch(newEndpoints[0]).then(fetchError => {
                    for (const query of originalQueries) {

                        // Mark the query has no longer pending
                        this.pendingQueries.delete(query);

                        // Notify observers of this query
                        this.observers.get(query)?.notifyResult({ loading: false, error: fetchError });
                    }
                });
                return;
            }

            Promise.all(
                newEndpoints.map(newEndpoint => this.fetcher.fetch(newEndpoint)),
            ).then(fetchErrors => {
                const fetchError = mergeFetchErrors(fetchErrors);
                for (const query of originalQueries) {

                    // Mark the query has no longer pending
                    this.pendingQueries.delete(query);

                    // Notify observers of this query
                    this.observers.get(query)?.notifyResult({ loading: false, error: fetchError });
                }
            });
        });
    }

    private setPollIntervalIfNeeded(endpoint: EndpointData, options: FetchOptions) {
        if (options.pollInterval) {
            let pollInterval = this.pollIntervals.get(endpoint);
            if (!pollInterval) {
                pollInterval = new PollInterval(
                    () => this.scheduleFetch(endpoint),
                );
                this.pollIntervals.set(endpoint, pollInterval);
            }

            pollInterval.addPollInterval(options.pollInterval);
        }
    }

    private clearPollIntervalIfNeeded(endpoint: EndpointData, options: FetchOptions) {
        if (options.pollInterval) {
            const pollInterval = this.pollIntervals.get(endpoint);
            if (!pollInterval) {
                console.error(`Tried to remove a pollInterval but there wasn't any. Called too often?`);
                return;
            }

            const pollRemaining = pollInterval.removePollInterval(options.pollInterval);
            if (pollRemaining === 0) {
                this.pollIntervals.delete(endpoint);
            }
        }
    }
}


function mergeFetchErrors(fetchErrors: (FetchError | undefined)[]): FetchError | undefined {

    let res: FetchError | undefined;

    for (const fetchError of fetchErrors) {
        if (fetchError) {
            if (!res) {
                res = fetchError;
            } else {
                res = {
                    status: 666,
                    message: `${res.message}, '${fetchError.status}': ${fetchError.message}`,
                };
            }
        }
    }

    return res;
}