import { useFetcher, FetchOptions } from '@/fetcher';


/**
 * Fetch the nodes from the mas.
 * @param groupId groupId to fetch the nodes for
 * @param opts fetch options
 */
export function useNodesFetcher(groupId: string, opts?: FetchOptions) {
    return useFetcher(`/mas/v2/nodes?depth=3&groupUUIDs=${groupId}`, opts);
}

/**
 * Fetch a node from the mas.
 * @param unitSerial node to fetch.
 * @param opts fetch options
 */
export function useNodeFetcher(unitSerial: string, opts?: FetchOptions) {
    return useFetcher(
        `/mas/v2/nodes?unit_serials=${unitSerial}&depth=3`,
        { ...opts, isInvalid: !unitSerial || opts?.isInvalid },
    );
}

/**
 * Fetch a node status from the mas.
 * @param nodeMASId node status to fetch
 * @param opts fetch options
 */
export function useNodeStatusFetcher(nodeMASId: string | undefined, opts?: FetchOptions) {
    return useFetcher(
        `/mas/v2/nodes/${nodeMASId}/doc/node_status`,
        { ...opts, isInvalid: !nodeMASId || opts?.isInvalid},
    );
}

/**
 * Fetch a node information object (contains MAC address & friends)
 * @param nodeMASId node to fetch
 * @param opts fetch options
 */
export function useNodeInfoFetcher(nodeMASId: string | undefined, opts?: FetchOptions) {
    return useFetcher(
        `/mas/v2/nodes/${nodeMASId}/doc/node_info`,
        { ...opts, isInvalid: !nodeMASId || opts?.isInvalid },
    );
}

/**
 * Fetch the node metrics object (contains some of the 4G stuff)
 * @param nodeMASId node to fetch
 * @param opts fetch options
 */
export function useNodeMetricsFetcher(nodeMASId: string | undefined, opts?: FetchOptions) {
    return useFetcher(
        `/mas/v2/nodes/${nodeMASId}/doc/node_metrics`,
        { ...opts, isInvalid: !nodeMASId || opts?.isInvalid },
    );
}

/**
 * Fetch the node sdwan object (contains stuff about the backhauls)
 * @param nodeMASId node to fetch
 * @param opts fetch options
 */
export function useNodeSDWANFetcher(nodeMASId: string | undefined, opts?: FetchOptions) {
    return useFetcher(
        `/mas/v2/nodes/${nodeMASId}/doc/node_sdwan`,
        { ...opts, isInvalid: !nodeMASId || opts?.isInvalid },
    );
}

/**
 * Fetch the node cellular data count object (contains some of the 4G stuff)
 * @param nodeMASId node to fetch
 * @param opts fetch options
 */
export function useNodeCellularDataCountFetcher(nodeMASId: string | undefined, opts?: FetchOptions) {
    return useFetcher(
        `/mas/v2/nodes/${nodeMASId}/doc/cellular_data_count`,
        { ...opts, isInvalid: !nodeMASId || opts?.isInvalid },
    );
}

/**
 * Fetch the node logging configuration
 * @param nodeMASId node to fetch
 * @param opts fetch options
 */
export function useNodeLoggingConfigFetcher(nodeMASId: string | undefined, opts?: FetchOptions) {
    return useFetcher(
        `/mas/v2/nodes/${nodeMASId}/doc/event_logging_config`,
        { ...opts, isInvalid: !nodeMASId || opts?.isInvalid },
    );
}

/**
 * Fetch the vmeshes from the mas.
 * @param groupId groupId to fetch the nodes for
 * @param opts fetch options
 */
export function useVmeshesFetcher(groupId: string, opts?: FetchOptions) {
    return useFetcher(`/mas/v2/vmeshes?depth=2&groupUUIDs=${groupId}`, opts);
}

/**
 * Fetch the MAS alerts
 * @param opts fetch options
 */
export function useAlertsFetcher(opts?: FetchOptions) {
    return useFetcher(`/mas/v2/alerts`, opts);
}

/**
 * Fetch logs available between two dates.
 *
 * @param deviceId id of the node
 * @param before date in ISO 8601 format
 * @param after date in ISO 8601 format
 * @param opts fetch options
 */
export function useNodeLogsBetweenFetcher(deviceId: string, before: string, after: string, opts?: FetchOptions) {
    return useFetcher(
        `/mas/v1/vhlog/${deviceId}?before=${encodeURIComponent(before)}&after=${encodeURIComponent(after)}`,
        opts,
    );
}

// `/mas/v2/vmeshes/${id}?depth=2`
// export function useVmeshFetcher(meshId: string, opts?: FetchOptions) {
//     return useFetcher()
// }