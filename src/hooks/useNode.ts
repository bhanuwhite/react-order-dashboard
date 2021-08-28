import { useParams } from 'react-router';
import { mergeFetchers, FetchOptions } from '@/fetcher';
import { useStore } from './useStore';
import { useNodeFetcher, useOwnerEnrollDataFetcher } from './fetchers';


/**
 * This hook was mostly design for the CC Device tabs.
 *
 * @param unitSerial unit serial of the device.
 * @param opts fetch options
 */
export function useNode(unitSerial: string, opts?: FetchOptions) {
    const store = useStore();
    const selectedGroupId = useParams<{ selectedGroupId?: string }>().selectedGroupId ??
        store.view.activeuser.defaultGroup;
    const { loading, error } = mergeFetchers(
        useNodeFetcher(unitSerial, opts),
        useOwnerEnrollDataFetcher(selectedGroupId, opts),
    );

    const node = store.domain.nodes.map.get(unitSerial);
    const esMesh = store.domain.enrollment.meshes.all.find(m =>
        m.devices.has(unitSerial),
    );
    const esNode = esMesh?.devices.get(unitSerial);

    return {
        loading,
        error,
        node,
        esMesh,
        esNode,
    };
}