import { useFetcher, FetchOptions } from '@/fetcher';


/**
 * Fetch the enroll data from the enrollment service.
 * You need to fetch the MAS nodes as well to use this endpoint's result.
 * @param userId user id to fetch the config for.
 * @param opts fetch options
 * @deprecated
 */
export function useEnrollDataFetcher(userId: string, opts?: FetchOptions) {
    return useFetcher(`/es/enroll/user/${userId}/config`, { ...opts, isInvalid: !userId || opts?.isInvalid });
}

/**
 * Fetch the enroll data for a group (endpoint refers to it as the owner not sure why,
 * it makes things more confusing though...)
 *
 * @param groupId group id to fetch the config for.
 * @param opts fetch options
 */
export function useOwnerEnrollDataFetcher(groupId: string, opts?: FetchOptions) {
    return useFetcher(`/es/enroll/owner/${groupId}/config`, { ...opts, isInvalid: !groupId || opts?.isInvalid });
}

/**
 * Fetch the Azure certificate of the device.
 *
 * @param deviceId id of the device
 * @param opts fetch options
 */
export function useAzureDeviceCertificate(deviceId: string, opts?: FetchOptions) {
    return useFetcher(`/es/enroll/device/${deviceId}/certs/azure`, opts);
}

/**
 * Get available updates for a specific mesh.
 *
 * @param meshId a user's mesh UUID that might have available updates
 * @param opts fetch options
 */
export function useMeshAvailableUpdatesFetcher(meshId: string, opts?: FetchOptions) {
    return useFetcher(`/es/subscription/mesh/${meshId}/availableUpdates`, {
        ...opts,
        isInvalid: !meshId || opts?.isInvalid,
    });
}

/**
 * Fetch all packages that the current user can see.
 *
 * @param opts fetch options
 */
export function usePackagesFetcher(opts?: FetchOptions) {
    return useFetcher('/es/enroll/packages?active=true', opts);
}

/**
 * Fetch all packages that you can subscribe to for a particular mesh.
 *
 * @param meshUUID mesh uuid to lookup packages for.
 * @param opts fetch options
 */
export function usePackagesForMeshFetcher(meshUUID: string | undefined | null, opts?: FetchOptions) {
    return useFetcher(`/es/subscription/mesh/${meshUUID}/availableSubscriptions`, {
        ...opts,
        isInvalid: !meshUUID || opts?.isInvalid,
    });
}