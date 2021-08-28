import { NodeState } from '@/store/domain/nodes';
import { deleteStdMasResponse, patchJSONStdMasResponse } from './helpers';
import { ignoreSchema, masStdResponseSchema } from '@/schemas';
import { Store } from '@/store';


export function deleteNodes(store: Store, nodes: NodeState[]) {
    return Promise.allSettled(nodes.map(n => {
        const endpoint = `/mas/v2/nodes/${n.id}`;
        return deleteStdMasResponse(store, endpoint, ignoreSchema);
    }));
}

export function powerShutdown(store: Store, { props: { masId } }: NodeState) {
    const data = { node_info: [ { path: '/shutdown_trigger', op: 'replace', value: true } ] };
    return patchJSONStdMasResponse(store, `/mas/v2/nodes/${masId}/doc`, data, masStdResponseSchema);
}

export function powerRestart(store: Store, { props: { masId } }: NodeState) {
    const data = { node_info: [ { path: '/reboot_trigger', op: 'replace', value: true } ] };
    return patchJSONStdMasResponse(store, `/mas/v2/nodes/${masId}/doc`, data, masStdResponseSchema);
}