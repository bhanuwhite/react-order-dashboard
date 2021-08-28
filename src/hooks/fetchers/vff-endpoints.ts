import { useFetcher, FetchOptions } from '@/fetcher';
import { Store } from '@/store';


/**
 * Fetch orders associated with the logged in user from VFF
 * @param opts fetch options.
 */
export function useVFFOrdersFetcher(store: Store, opts?: FetchOptions) {
    const keycloakUUID = store.view.activeuser.keycloakUUID;
    return useFetcher(`/vff/v1/orders/get/${keycloakUUID}`, { ...opts, isInvalid: !keycloakUUID || opts?.isInvalid });
}

/**
 * Fetch a specific order associated with the logged in user from VFF
 * @param opts fetch options.
 */
export function useVFFOrderFetcher(orderId: string | undefined, opts?: FetchOptions) {
    return useFetcher(`/vff/v1/orders/get/order/${orderId}`, { ...opts, isInvalid: !orderId || opts?.isInvalid });
}