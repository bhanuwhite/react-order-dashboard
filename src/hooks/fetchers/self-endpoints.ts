import { useFetcher, FetchOptions } from '@/fetcher';
import { UserState } from '@/store/domain/users';
import { usePage } from '../pages';


/**
 * Fetch payment sources, subscriptions and billing address associated with the logged in user.
 * @param opts fetch options.
 */
export function usePaymentDetailsFetcher(opts?: FetchOptions) {
    return useFetcher(`/account/payment/details`, opts);
}

/**
 * Fetch whitelisting status for a unit serial.
 * @param unitSerial unit serial to check.
 * @param opts fetch options.
 */
export function useIsWhitelistedFetcher(unitSerial: string | undefined, opts?: FetchOptions) {
    return useFetcher(`/subscriptions/whitelist/${unitSerial}`, { ...opts, isInvalid: !unitSerial || opts?.isInvalid });
}

/**
 * Fetch whitelisting status for one or more unit serials.
 * @param unitSerials unit serial array to check.
 * @param opts fetch options.
 */
export function useAreWhitelistedFetcher(unitSerials: string[], opts?: FetchOptions) {
    return useFetcher(`/subscriptions/whitelist/${unitSerials.join(',')}`, opts);
}

/**
 * Fetch all Stripe subscriptions. This includes those with a status of:
 * `active`, `past_due`, `unpaid`, `canceled`, `incomplete`, `incomplete_expired`, `trialing`, `ended`
 *
 * @param opts fetch options.
 */
export function useAllSubscriptionsFetcher(opts?: FetchOptions) {
    return useFetcher(`/subscriptions/all`, opts);
}

/**
 * Fetch all pending invitations for the logged in user.
 *
 * @param opts fetch options.
 */
export function useInvitationsFetcher(opts?: FetchOptions) {
    return useFetcher(`/invitations`, opts);
}

/**
 * Fetch all invitees to a group.
 *
 * @param groupId id of the group
 * @param opts fetch options
 */
export function useInviteesToGroupFetcher(groupId: string, opts?: FetchOptions) {
    return useFetcher(`/invitations/groups/${groupId}`, opts);
}

/**
 * Search for a user. This can only be used if the logged in user belongs to a partner
 * or if they are a veea admin.
 *
 * @param search search input
 * @param opts fetch options.
 */
export function useKeycloakAdminSearchUsersByPage(
    search: string | undefined,
    emailOnly: boolean | undefined,
    opts?: FetchOptions,
) {
    return usePage<UserState>(
        `/users?search=${encodeURIComponent(search ?? '')}${emailOnly ? '&emailOnly=true' : ''}`,
        { ...opts, isInvalid: !search || opts?.isInvalid },
    );
}

/**
 * Fetch a user from keycloak. This can only be done if the logged in user
 * is in a partner or if they are a veea admin.
 * @param userId veea user id to fetch
 * @param opts fetch options
 */
export function useKeycloakAdminGetUserFetcher(userId: string | undefined, opts?: FetchOptions) {
    return useFetcher(`/users/${userId}`, { ...opts, isInvalid: !userId || opts?.isInvalid });
}

/**
 * Fetch users from keycloak. This can only be done if the logged in user
 * is in a partner or if they are a veea admin.
 *
 * @param userIds veea user ids to fetch
 * @param opts fetch options
 */
export function useKeycloakAdminGetUsersFetcher(userIds: string[], opts?: FetchOptions) {
    return useFetcher(`/users/${userIds.join(',')}`, { ...opts, isInvalid: userIds.length === 0 || opts?.isInvalid });
}

/**
 * Fetch the minimum required password length for the realm
 * @param opts fetch options.
 */
export function useKeycloakMinPasswordLengthFetcher(opts?: FetchOptions) {
    return useFetcher(`/realm/min-password-length`, opts);
}

/**
 * Fetch the remaining fulfillable devices from VFF
 * @param opts fetch options.
 */
export function useFulfillableDevicesFetcher(skus: (string | undefined)[], opts?: FetchOptions) {
    return useFetcher(`/vtpn/inventory?skus=${skus.join(',')}`,
        { ...opts, isInvalid: skus.filter(s => s).length === 0 || opts?.isInvalid });
}