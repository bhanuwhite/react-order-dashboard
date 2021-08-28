import React from 'react';
import type { History } from 'history';
import { useHistory } from 'react-router';
import { useFetcher, FetchOptions, UseFetcherState } from '@/fetcher';
import { Page } from '@/store/pages';
import { useStore } from '../useStore';
import { Value } from '@/store/domain/_helpers';
import { useQuery } from '../useQuery';

/**
 * Hook to manage the use of a cursor. Cursor allow to navigate paginated data.
 * You provide an endpoint that require a cursor as a parameter and this hook
 * handle the navigation request for you.
 *
 * Pages should be populated in the store using `store.pages.newPageFromResponse`.
 *
 * @param partialEndpoint endpoint that needs to be queried (omitting the cursor param)
 * @param initialValue initial value for the cursor (if obtained from a query param)
 *
 * ## Example use
 *
 * ```ts
 * const Comp: FC<{}> = observer(() => {
 *      const store = useStore();
 *      const { loading, page, next, prev } = usePage<GroupState>(`/gs/groups?${groupId}&limit=5`);
 *      const groups = store.groups.getGroupsForPage(page);
 *
 *      if (groups.length == 0 && loading) {
 *          return <Spinner />;
 *      }
 *
 *      return <Table>
 *          <Content>{groups.map(g => <GroupItem group={g} key={g.id} />)}</Content>
 *          <TableNav onClickPrev={prev} onClickNext={next} />
 *      </Table>
 * });
 * ```
 *
 */
export function usePage<T extends Value>(
    initialEndpoint: string,
    opts?: FetchPageOptions,
): PageHook<T> {

    const store = useStore();
    const history = useHistory();
    const query = useQuery();
    const prefix = opts?.prefix ?? '';
    const noQueryParam = opts?.noQueryParam;
    const navigationRequest = React.useRef(LastNavRequest.None);
    const [ localEndpoint, setLocalEndpoint ] = React.useState(initialEndpoint);

    // We compute the endpoint this way to make sure we reduce the number of rendering required
    // In the case where the information comes straight from the URL.
    // This makes the case with noQueryParam slower but this is because we assume it to be a
    // rarer case and so it's probably fine if it's less efficient. :)
    const endpoint = noQueryParam ?
        localEndpoint :
        deriveEndpointFromQuery(initialEndpoint, query, prefix);

    // The call to the fetcher.
    const { loading, error, fetchNow } = useFetcher(endpoint, opts);

    const page = store.pages.getPage<T>(endpoint);

    // When partial endpoint changes, we reset the local endpoint
    React.useEffect(() => {

        // Do nothing if noQueryParam is not set to true.
        if (noQueryParam) {
            setLocalEndpoint(initialEndpoint);
        }

    }, [ initialEndpoint ]); // We don't include noQueryParam because it's suppose to be set statically

    React.useEffect(() => {

        if (!loading && !error && navigationRequest.current !== LastNavRequest.None) {

            assertPageIsDefined(page, endpoint);

            if (navigationRequest.current === LastNavRequest.Forward) {
                if (noQueryParam) {
                    setLocalEndpoint(page.nextEndpoint());
                } else {
                    navigateToNextPage(page, history, prefix);
                }
            } else if (navigationRequest.current === LastNavRequest.Backward) {
                if (noQueryParam) {
                    setLocalEndpoint(page.prevEndpoint());
                } else {
                    navigateToPrevPage(page, history, prefix);
                }
            }

            navigationRequest.current = LastNavRequest.None;
        }

    }, [ loading, error, navigationRequest ]);  // We don't include noQueryParam
                                                // because it's suppose to be set statically


    function next() {
        // If it's loading we cache the request, and will execute it
        // once the data has been received from the backend and the
        // cursor has been populated.
        if (!page) {
            navigationRequest.current = LastNavRequest.Forward;
            return;
        }

        if (noQueryParam) {
            setLocalEndpoint(page.nextEndpoint());
        } else {
            navigateToNextPage(page, history, prefix);
        }
    }

    function prev() {
        // If it's loading we cache the request, and will execute it
        // once the data has been received from the backend and the
        // cursor has been populated.
        if (!page) {
            navigationRequest.current = LastNavRequest.Backward;
            return;
        }

        if (noQueryParam) {
            setLocalEndpoint(page.prevEndpoint());
        } else {
            navigateToPrevPage(page, history, prefix);
        }
    }

    return {
        loading,
        error,
        page,
        next,
        prev,
        hasPrev: !!page?.hasPrev(),
        hasNext: !!page?.hasNext(),
        fetchNow,
    };
}

const enum LastNavRequest {
    None,
    Backward,
    Forward,
}

interface PageHook<T extends Value> extends UseFetcherState {
    /** Cursor to use to lookup data in the store */
    page: Page<T> | undefined
    /** Request next page */
    next: () => void
    /** Request previous page */
    prev: () => void
    /** True if there's a previous page */
    hasPrev: boolean
    /** True if there's a next page */
    hasNext: boolean
}

export interface FetchPageOptions extends FetchOptions {
    /**
     * Prefix to uniquely identify the before/after parameter.
     * This is useful if multiple paginated APIs are use simultaneously in the same
     * screen. Without it, all search will collide with one another.
     * Default value is ''.
     */
    prefix?: string
    /**
     * Set this to true to not use (and set) the query parameters
     * `${prefix}before` and `${prefix}after` in the URL and use
     * local state to do the pagination.
     *
     * This flag value should never change at runtime (should be
     * treated like a compile time constant)
     */
    noQueryParam?: boolean
}

/**
 * Utility to let TypeScript know that the provided cursor is defined.
 * @param page cursor to assert is defined.
 * @param endpoint endpoint used for error reporting
 */
export function assertPageIsDefined(
    page: Page<any> | undefined,
    endpoint: string,
): asserts page is Page<any> {
    if (!page) {
        throw new Error(`Handler for ${endpoint} must be incorrect. Cursor wasn't populated correctly in the handler.`);
    }
}

/**
 * Given an endpoint, this produce an endpoint that can be handled by the pages
 * system. This function is to be primarily used by the `usePage` hooks.
 */
function deriveEndpointFromQuery(initialEndpoint: string, query: URLSearchParams, prefix: string): string {

    const pageNextCursor = query.get(prefix + 'after');
    const pagePrevCursor = query.get(prefix + 'before');
    const hasQuery = initialEndpoint.indexOf('?') !== -1;

    if (pageNextCursor !== null) {
        return `${initialEndpoint}${hasQuery ? '&' : '?'}next=${pageNextCursor}`;
    }

    if (pagePrevCursor !== null) {
        return `${initialEndpoint}${hasQuery ? '&' : '?'}prev=${pagePrevCursor}`;
    }

    return initialEndpoint;
}

/**
 * Navigate to the next page (if possible).
 * @param history object to use to update the location.
 */
function navigateToNextPage(page: Page<any>, history: History, prefix: string): void {
    if (page.nextOpaqueId == null) {
        console.error('API missuse of navigateToNextPage.');
        return;
    }

    const query = new URLSearchParams(history.location.search);
    query.delete(prefix + 'before');
    query.set(prefix + 'after', page.nextOpaqueId);
    history.push({
        ...history.location,
        search: `?${query}`,
    });
}

/**
 * Navigate to the next page (if possible).
 * @param history object to use to update the location.
 */
function navigateToPrevPage(page: Page<any>, history: History, prefix: string): void {
    if (page.prevOpaqueId == null) {
        console.error('API missuse of navigateToNextPage.');
        return;
    }

    const query = new URLSearchParams(history.location.search);
    query.delete(prefix + 'after');
    query.set(prefix + 'before', page.prevOpaqueId);
    history.push({
        ...history.location,
        search: `?${query}`,
    });
}
