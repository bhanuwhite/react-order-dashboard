import * as React from 'react';
import { FetchError } from '@/fetcher';
import { GroupState } from '@/store/domain/groups';
import { assertPageIsDefined, usePage, FetchPageOptions } from '@/hooks/pages';
import { useFetcher, FetchOptions, UseFetcherState } from '@/fetcher';
import { useStore } from '@/hooks/useStore';
import { useIndex } from '@/hooks/useIndex';
import { Page } from '@/store/pages';
import { Store } from '@/store';



/**
 * Fetch groups by id. Groups will be available in `store.domain.groups.map`.
 * @param groupIds group ids to fetch.
 * @param opts fetch options.
 */
export function useGroupsByIdFetcher(groupIds: string[], opts?: FetchOptions) {
    return useFetcher(`/gs/groups/${groupIds.join(',')}`, opts);
}

/**
 * List children of a group. This returns you a cursor that you can use to extract
 * the response from the store:
 *
 * ```ts
 *     const store = useStore();
 *     const { page } = useChildGroupsPage(...);
 *     const groups = store.groups.getGroupsForPage(page);
 * ```
 *
 * @see {useCursor} for more details
 *
 * @param parentGroupId parent group
 * @param limit number of result per page
 * @param opts fetch options
 */
export function useChildGroupsPage(parentGroupId: string, limit = 5, opts?: FetchPageOptions) {

    return usePage<GroupState>(
        `/gs/groups/${parentGroupId}/children?limit=${limit}`,
        opts,
    );
}

/**
 * List/Search groups. This hook returns you a cursor that you can use to extract
 * the response from the store:
 *
 * ```ts
 *     const store = useStore();
 *     const { page } = useSearchGroupsByIdPage(...);
 *     const groups = store.groups.getGroupsForPage(page);
 * ```
 *
 * @see {usePage} for more details
 *
 * @param topLevelGroupIds the root groups in which the search takes place
 * @param searchQuery query string that groups must match
 * @param limit number of result to get
 * @param opts fetch options
 */
export function useSearchGroupsByIdPage(
    topLevelGroupIds: string[],
    searchQuery = '',
    limit = 5,
    column: 'contact' | 'name' | 'veeahub' = 'name',
    opts?: FetchPageOptions,
) {
    let searchParam = 'searchDisplayName';
    if (column === 'contact') {
        searchParam = 'search';
    }
    if (column === 'veeahub') {
        searchParam = 'searchDevice';
    }

    return usePage<GroupState>(
        `/gs/groups?limit=${limit}&groups=${topLevelGroupIds.join(',')}&${searchParam}=${encodeURIComponent(searchQuery)}`,
        opts,
    );
}


/**
 * Custom hooks to either show the children of a group
 * if no search text is entered or show the subgroups matching
 * the search if there's a search text.
 */
export function useChildrenOrSearchGroupsByPage(
    store: Store,
    groupId: string,
    search: string,
    limit: number,
    column: 'contact' | 'name' | 'veeahub' = 'name',
    opts?: FetchPageOptions,
): GroupsChildrenOrSearch {
    const showSearch = search.length > 0;
    const {
        page: searchPage,
        next: searchNext,
        prev: searchPrev,
        hasNext: searchHasNext,
        hasPrev: searchHasPrev,
        loading: searchLoading,
        error: searchError,
        fetchNow: searchFetchNow,
    } = useSearchGroupsByIdPage(
        [groupId],
        search,
        limit,
        column,
        { ...opts, isInvalid: !showSearch || opts?.isInvalid },
    );
    const {
        page: childrenPage,
        next: childrenNext,
        prev: childrenPrev,
        hasNext: childrenHasNext,
        hasPrev: childrenHasPrev,
        loading: childrenLoading,
        error: childrenError,
        fetchNow: childrenFetchNow,
    } = useChildGroupsPage(groupId, limit, { ...opts, isInvalid: showSearch || opts?.isInvalid });

    const page = showSearch ? searchPage : childrenPage;
    const next = showSearch ? searchNext : childrenNext;
    const prev = showSearch ? searchPrev : childrenPrev;
    const hasNext = showSearch ? searchHasNext : childrenHasNext;
    const hasPrev = showSearch ? searchHasPrev : childrenHasPrev;
    const loading = showSearch ? searchLoading : childrenLoading;
    const error = showSearch ? searchError : childrenError;
    const groups = store.domain.groups.getGroupsForPage(page).filter(group => group.id !== groupId);
    const fetchNow = React.useCallback(() => {
        if (showSearch) {
            return searchFetchNow();
        }
        return childrenFetchNow();
    }, [ showSearch, searchFetchNow, childrenFetchNow ]);

    return {
        groups,
        next,
        prev,
        hasNext,
        hasPrev,
        loading,
        error,
        fetchNow,
    };
}

interface GroupsChildrenOrSearch {
    groups: GroupState[]
    next: () => void
    prev: () => void
    hasNext: boolean
    hasPrev: boolean
    loading: boolean
    error: FetchError | undefined
    fetchNow: () => Promise<void>
}

/**
 * Custom hook to obtain the top level groups and update the list as we
 * navigate to other part of the hierarchy.
 *
 *  - Default view, we list all the group the user belongs to. This information
 *    isn't paginated we send a request to get all groups by id.
 *
 *  - We navigate to a group's children, we list the first {limit} children
 *    and we can paginate.
 *
 */
export function useGroups(
    topLevelGroupIds: string[],
    parentGroupId: string | undefined,
    limit: number = 5,
    opts?: FetchOptions,
): GroupsHook {

    const store = useStore();
    const [ state, setState ] = React.useState(getDefaultState(topLevelGroupIds, parentGroupId));
    const navigationRequest = React.useRef(LastNavRequest.None);

    const [ paginatedEndpoint, setPaginatedEndpoint ] = React.useState(`/gs/groups/${parentGroupId}/children?limit=${limit}`);
    const endpoint = getUrlFromState(state, paginatedEndpoint);
    const isInvalid = getIsInvalidFromState(state, parentGroupId) || opts?.isInvalid;
    const { loading, error, fetchNow } = useFetcher(endpoint, { ...opts, isInvalid });

    // This info should really come from the cursor :/
    const [ pageIndex, setPageIndex ] = useIndex();

    // We only have a cursor when looking at children
    const page = state.type === 'children'
        ? store.pages.getPage<GroupState>(paginatedEndpoint)
        : undefined;

    // Groups can either be obtained using the cursor or using a mapping of the top
    // level group ids.
    const groups = state.type === 'all'
        ? topLevelGroupIds.map(g => store.domain.groups.map.get(g)).filterNullable()
        : store.domain.groups.getGroupsForPage(page);


    // When parent group changes, we reset the page index
    React.useEffect(() => {

        setPageIndex(0);
        setPaginatedEndpoint(`/gs/groups/${parentGroupId}/children?limit=${limit}`);

    }, [ parentGroupId, state.type ]);


    React.useEffect(() => {

        if (!loading && !error && navigationRequest.current !== LastNavRequest.None) {

            assertPageIsDefined(page, endpoint);

            if (navigationRequest.current === LastNavRequest.Forward) {
                setPaginatedEndpoint(page.nextEndpoint());
                setPageIndex(pageIndex + 1);
            } else if (navigationRequest.current === LastNavRequest.Backward) {
                setPaginatedEndpoint(page.prevEndpoint());
                setPageIndex(!page.hasPrev() ? 0 : pageIndex - 1);
            }

            navigationRequest.current = LastNavRequest.None;
        }

    }, [ loading, error, navigationRequest ]);


    function showChildrenFor(groupId: string) {
        if (state.type === 'children' && state.groupId === groupId) {
            return;
        }

        setState({ type: 'children', groupId });
    }

    function showTopLevelGroups() {
        if (state.type === 'all') {
            return;
        }

        setState({ type: 'all', topLevelGroupIds });
    }

    function next() {
        // If it's loading we cache the request, and will execute it
        // once the data has been received from the backend and the
        // cursor has been populated.
        if (!page) {
            navigationRequest.current = LastNavRequest.Forward;
            return;
        }

        setPaginatedEndpoint(page.nextEndpoint());
        setPageIndex(pageIndex + 1);
    }

    function prev() {
        // If it's loading we cache the request, and will execute it
        // once the data has been received from the backend and the
        // cursor has been populated.
        if (!page) {
            navigationRequest.current = LastNavRequest.Backward;
            return;
        }

        setPaginatedEndpoint(page.prevEndpoint());
        setPageIndex(!page.hasPrev() ? 0 : pageIndex - 1);
    }

    return {
        groups,
        page,
        loading,
        error,
        showChildrenFor,
        showTopLevelGroups,
        prev,
        next,
        hasPrev: !!page?.hasPrev() || pageIndex !== 0,
        hasNext: !!page?.hasNext(),
        pageIndex,
        fetchNow,
    };
}

interface GroupsHook extends UseFetcherState {
    groups: GroupState[]
    page: Page<GroupState> | undefined
    showChildrenFor: (groupId: string) => void
    showTopLevelGroups: () => void
    prev: () => void
    next: () => void
    hasPrev: boolean
    hasNext: boolean
    pageIndex: number
}

function getDefaultState(topLevelGroupIds: string[], groupId: string | undefined): GroupsNavState {
    if (groupId) {
        return {
            type: 'children',
            groupId,
        };
    }

    return {
        type: 'all',
        topLevelGroupIds,
    };
}

function getUrlFromState(state: GroupsNavState, paginatedEndpoint: string) {
    if (state.type === 'all') {
        return `/gs/groups/${state.topLevelGroupIds.join(',')}`;
    }
    return paginatedEndpoint;
}

function getIsInvalidFromState(state: GroupsNavState, parentGroupId: string | undefined): boolean {
    if (state.type === 'all') {
        return state.topLevelGroupIds.length === 0;
    }
    return !parentGroupId;
}

type GroupsNavState = AllUserGroups
    | GroupChildren
    ;

interface AllUserGroups {
    type: 'all'
    topLevelGroupIds: string[]
}

interface GroupChildren {
    type: 'children'
    groupId: string
}

const enum LastNavRequest {
    None,
    Backward,
    Forward,
}