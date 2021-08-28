import { VmeshesState } from '../domain/vmeshes';
import { EnrollmentState } from '../domain/enrollment';
import { NodesState } from '../domain/nodes';
import { createHealth, AllHealthState } from './health';

export interface DerivedStore {
    /**
     * Helper functions to compute the health of a node or a mesh.
     */
    health: AllHealthState
}

export function createDerived(vmeshes: VmeshesState, enrollment: EnrollmentState, nodes: NodesState): DerivedStore {
    const health = createHealth(vmeshes, enrollment, nodes);

    return {
        health,
    };
}