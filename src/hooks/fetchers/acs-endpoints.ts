import { useFetcher, FetchOptions } from '@/fetcher';


/**
 * Fetch the ACL list data from the ACS
 * @param partnerId partner id that is associated with the ACLs
 * @param opts fetch options
 */
export function useACLAllFetcher(partnerId: string, opts?: FetchOptions) {
    return useFetcher(`/ac/partner/${partnerId}/acl`, { ...opts, isInvalid: !partnerId || opts?.isInvalid });
}

/**
 * Fetch the ACL data from the ACS
 * @param partnerId partner id that is associated with the ACLs
 * @param aclId acl id that is associated with the partner
 * @param opts fetch options
 */
export function useACLUserFetcher(partnerId: string | undefined, aclId: string | undefined, opts?: FetchOptions) {
    return useFetcher(`/ac/partner/${partnerId}/acl/${aclId}/user`, {
        ...opts,
        isInvalid: !partnerId || !aclId || opts?.isInvalid,
    });
}

/**
 * Fetch all partners. This can only be used by a Veea Admin.
 * @param opts fetch options
 */
export function useAllPartnersFetcher(opts?: FetchOptions) {
    return useFetcher(`/ac/partner`, opts);
}

/**
 * Fetch more details about a specific partner.
 * @param partnerId id of the partner to fetch
 * @param opts fetch options
 */
export function usePartnerFetcher(partnerId: string | undefined, opts?: FetchOptions) {
    return useFetcher(`/ac/partner/${partnerId}`, { ...opts, isInvalid: !partnerId || opts?.isInvalid });
}

/**
 * Fetch uploaded applications for a given partner.
 * @param partnerId id of the partner for which to fetch applications
 * @param opts fetch options
 */
export function usePartnerApplicationsFetcher(partnerId: string | undefined, opts?: FetchOptions) {
    return useFetcher(`/ac/partner/${partnerId}/package`, { ...opts, isInvalid: !partnerId || opts?.isInvalid });
}

/**
 * Fetch the user partner id (it could have changed or be set)
 * @param opts fetch options
 */
export function useUserPartnerIdFetcher(userId: string | undefined, opts?: FetchOptions) {
    return useFetcher(`/ac/partner/user/${userId}`, { ...opts, isInvalid: !userId || opts?.isInvalid });
}

/**
 * Fetch a specific uploaded application for a given partner.
 * @param partnerId id of the partner for which to fetch applications
 * @param applicationId id of the application you wish to fetch
 * @param opts fetch options
 */
export function usePartnerApplicationFetcher(
    partnerId?: string,
    applicationId?: string,
    opts?: FetchOptions,
) {
    return useFetcher(`/ac/partner/${partnerId}/package/${applicationId}`,
        { ...opts, isInvalid: !partnerId || !applicationId || opts?.isInvalid });
}

/**
 * Get an owner's configuration on ACS.
 * @param groupId group id
 * @param opts fetch options
 */
export function useOwnerConfiguration(groupId: string, opts?: FetchOptions) {
    return useFetcher(`/ac/configurations/owners/${groupId}`, opts);
}