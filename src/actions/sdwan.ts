import { NodeState } from '@/store/domain/nodes';
import { patchJSONStdMasResponse } from './helpers';
import { Store } from '@/store';
import { masStdResponseSchema } from '@/schemas';


export function setSDWANLockedState(store: Store, value: boolean, { props: { masId }}: NodeState) {
    const data = { node_sdwan: [{ path: '/backhauls/Cellular/locked', op: 'replace', value }] };
    return patchJSONStdMasResponse(store, `/mas/v2/nodes/${masId}/doc`, data, masStdResponseSchema);
}