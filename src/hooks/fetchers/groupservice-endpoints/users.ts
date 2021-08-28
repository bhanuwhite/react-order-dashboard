import { UserState } from '@/store/domain/users';
import { usePage } from '@/hooks/pages';
import { useFetcher, FetchOptions } from '@/fetcher';
import { useStore } from '@/hooks/useStore';


/**
 * Fetch a single user on the group service. This API is very limited
 * and only allow you to query users that you can "manage".
 *
 * @param userId user id to fetch
 * @param opts fetch options
 */
export function useUserByIdFetcher(userId: string, opts?: FetchOptions) {
    return useFetcher(`/gs/users/${userId}`, opts);
}

/**
 * List users from a group.
 * @param groupId id of the group the list applies to
 * @param opts fetch options
 */
export function useUsersInGroupByPage(
    groupId: string,
    limit = 20,
    opts?: FetchOptions,
) {
    return usePage<UserState>(
        `/gs/groups/${groupId}/users?limit=${limit}`,
        opts,
    );
}

/**
 * List/Search users. This hook returns you a page that you can use to extract
 * the response from the store:
 *
 * ```ts
 *     const store = useStore();
 *     const { page } = useSearchUsersByPage(...);
 *     const users = store.users.getUsersForPage(page);
 * ```
 *
 * @see {usePage} for more details
 *
 * By default if the `searchQuery` param is empty no request is sent to the backend.
 *
 * @param topLevelGroupIds the root groups in which the search takes place
 * @param searchQuery query string that users must match
 * @param limit number of result to get
 * @param opts fetch options
 */
export function useSearchUsersByPage(
    topLevelGroupIds: string[],
    searchQuery = '',
    limit = 5,
    opts?: FetchOptions,
) {
    return usePage<UserState>(
        `/gs/users?limit=${limit}&groups=${topLevelGroupIds.join(',')}&search=${encodeURIComponent(searchQuery)}`,
        opts,
    );
}

/**
 * Get all roles from the group services.
 * @param opts fetch options
 */
export function useRoles(opts?: FetchOptions) {

    const store = useStore();
    const {
        loading,
    } = useFetcher(`/gs/roles?limit=100`, opts);

    return {
        loading,
        roles: store.domain.roles.all,
    };
}