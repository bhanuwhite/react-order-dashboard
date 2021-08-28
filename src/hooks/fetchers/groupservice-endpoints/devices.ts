import { FetchOptions, useFetcher } from '@/fetcher';



/**
 * Hook to get the direct devices count in a group.
 * I don't think we need to get more from the group
 * service regarding devices as it only returns the
 * known references. If we actually want to get data
 * it's simpler to query the MAS or the enrollment service.
 *
 * @param groupId Group to check whether they have devices or not
 * @param opts fetch options
 */
export function useHasDevicesInGroup(groupId: string, opts?: FetchOptions) {

    return useFetcher(`/gs/groups/${groupId}/devices`, opts);
}