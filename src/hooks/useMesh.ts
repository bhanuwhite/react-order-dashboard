import { useParams } from 'react-router';
import { mergeFetchers, FetchOptions } from '@/fetcher';
import { useStore } from './useStore';
import { useOwnerEnrollDataFetcher, useVmeshesFetcher, useNodesFetcher } from './fetchers';



/**
 * This hook was mostly design for the CC Mesh tabs.
 *
 * @param unitSerial unit serial of the MEN device (or id of the mesh)
 * @param opts fetch options
 */
export function useMesh(unitSerial: string, opts?: FetchOptions) {
    const store = useStore();
    const selectedGroupId = useParams<{ selectedGroupId?: string }>().selectedGroupId ??
        store.view.activeuser.defaultGroup;
    const { loading, error, fetchNow } = mergeFetchers(
        useVmeshesFetcher(selectedGroupId, opts), // TODO: replace with useVmeshFetcher(meshId),
        useNodesFetcher(selectedGroupId, opts),
        useOwnerEnrollDataFetcher(selectedGroupId, opts),
    );
    const mesh = store.domain.vmeshes.map.get(unitSerial);
    const esMesh = store.domain.enrollment.meshes.map.get(unitSerial);

    return {
        mesh,
        esMesh,
        loading,
        error,
        fetchNow,
    };
}
