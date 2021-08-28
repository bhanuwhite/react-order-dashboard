import { VmeshState, VmeshesState } from '../domain/vmeshes';
import { EnrollmentMeshState, EnrollmentDeviceState, EnrollmentState } from '../domain/enrollment';
import { NodeState, NodesState } from '../domain/nodes';

export class AllHealthState {

    constructor(
        public vmeshes: VmeshesState,
        public enrollment: EnrollmentState,
        public nodes: NodesState,
    ) {}

    getStatusSummary(): HealthStats {
        const { nodes, meshes }: HealthStats = {
            nodes: {
                'busy': 0,
                'errors': 0,
                'healthy': 0,
                'installing': 0,
                'offline': 0,
                'unknown': 0,
                'need-reboot': 0,
                'total': 0,
            },
            meshes: {
                'busy': 0,
                'errors': 0,
                'healthy': 0,
                'installing': 0,
                'offline': 0,
                'unknown': 0,
                'need-reboot': 0,
                'total': 0,
            },
        };

        /**
         * Build a list of meshes and nodes that are enrolling.
         * Nodes and meshes are considered enrolling if they are present in ACS but not in the MAS
         */
        const { enrollingMeshes, enrollingNodes, allEsNodesMap } = this.getEnrollingMeshesAndNodes();

        /**
         * Obtain the list of enrolled meshes and nodes by running through the MAS data,
         * but cross check data from ACS to protect against a scenario where the global health panel
         * is opened after just having unenrolled meshes or devices with VHM
         * (ES state will reflect the unenrolled meshes and devices in this scenario, MAS data will not)
         */
        const enrolledMeshes = this.getEnrolledMeshes();
        const enrolledNodes = this.getEnrolledNodes(allEsNodesMap);

        /**
         * Tally health statuses of meshes and nodes
         */
        const summary = {
            meshes: [ ...enrollingMeshes, ...enrolledMeshes ].reduce(this.tallyHealthStatuses('mesh'), meshes),
            nodes: [ ...enrollingNodes, ...enrolledNodes ].reduce(this.tallyHealthStatuses('node'), nodes),
        };

        return summary;
    }

    getEnrollingMeshesAndNodes() {
        const enrollingMeshes: any[] = [];
        const enrollingNodes: any[] = [];
        const allEsNodesMap = new Map<string, EnrollmentDeviceState>();

        // iterate ES meshes
        for (const esMesh of this.enrollment.meshes.all) {

            const meshIsEnrolled = this.vmeshes.map.get(esMesh.id); // if mesh is found in MAS data, it is enrolled
            if (!meshIsEnrolled) {
                enrollingMeshes.push({ esMesh });
            }

            // iterate ES nodes
            for (const esNode of esMesh.devices.values()) {

                allEsNodesMap.set(esNode.id, esNode);

                // if the node and the node’s mesh are found in the MAS data they should be considered enrolled.
                const nodeIsEnrolled = this.nodes.map.get(esNode.id);
                if (!nodeIsEnrolled) {
                    enrollingNodes.push({ esNode });
                }
            }
        }
        return { enrollingMeshes, enrollingNodes, allEsNodesMap };
    }

    getEnrolledMeshes() {
        const enrolledMeshes:any[] = [];
        for (const mesh of this.vmeshes.all) {
            // cross-check ES data to make sure mesh hasn't been unenrolled
            const esMesh = this.enrollment.meshes.map.get(mesh.id);
            if (esMesh) {
                enrolledMeshes.push({ mesh, esMesh });
            }
        }
        return enrolledMeshes;
    }

    getEnrolledNodes(allEsNodesMap: Map<string, EnrollmentDeviceState>) {
        const enrolledNodes:any[] = [];
        for (const node of this.nodes.all) {
            // cross-check ES data to make sure node hasn't been unenrolled
            const esNode = allEsNodesMap.get(node.id);
            if (esNode) {
                enrolledNodes.push({ node, esNode });
            }
        }
        return enrolledNodes;
    }

    tallyHealthStatuses(entityType: HealthStatusEntityTypesEnum) {
        return (healthSumary: HealthSummary & { total: number }, entity: HealthStatusEntity) => {
            const healthStatus = this.getHealthStatusForEntityType(entityType, entity);
            if (healthStatus) {
                healthSumary[healthStatus] += 1;
                healthSumary.total += 1;
            }
            return healthSumary;
        };
    }

    getHealthStatusForEntityType(entityType: HealthStatusEntityTypesEnum, entity: HealthStatusEntity) {
        switch (entityType) {
            case 'mesh':
                entity = entity as MeshHealthStatusEntity;
                return computeMeshHealthStatus(entity.mesh, entity.esMesh, this.nodes.map);
            case 'node':
                entity = entity as NodeHealthStatusEntity;
                return computeNodeHealthStatus(entity.node, entity.esNode);
            default:
                return null;
        }
    }

    getMeshHealthStatus(mesh: VmeshState | undefined, esData?: EnrollmentMeshState): HealthStatus {
        if (!esData && mesh) {
            esData = this.enrollment.meshes.map.get(mesh.id);
        }
        const nodeMap = this.nodes.map;
        return computeMeshHealthStatus(mesh, esData, nodeMap);
    }

    getNodeHealthStatus(node?: NodeState, esData?: EnrollmentDeviceState): HealthStatus {
        if (!esData && node) {
            const esMesh = this.enrollment.meshes.all.find(m =>
                m.devices.has(node.id),
            );
            esData = esMesh?.devices.get(node.id);
        }
        return computeNodeHealthStatus(node, esData);
    }

    shouldNodeBeConnectedToMAS(esData: EnrollmentDeviceState): boolean {
        return !this.isNodeBootstrapping(esData) && esData.error === null;
    }

    isNodeBootstrapping(esData: EnrollmentDeviceState): boolean {
        return esData.status === 'bootstrapping';
    }
}

export const createHealth = (vmeshes: VmeshesState, enrollment: EnrollmentState, nodes: NodesState) =>
    new AllHealthState(vmeshes, enrollment, nodes);

export interface HealthStats {
    nodes: HealthSummary & { total: number }
    meshes: HealthSummary & { total: number }
}

type HealthSummary = {
    [prop in HealthStatus]: number
};

export type HealthStatus = 'healthy' | 'offline' | 'busy' | 'errors' | 'installing' | 'need-reboot' | 'unknown';

type HealthStatusEntityTypesEnum = 'mesh' | 'node';

type HealthStatusEntity = MeshHealthStatusEntity | NodeHealthStatusEntity;

interface MeshHealthStatusEntity {
    mesh?: VmeshState
    esMesh: EnrollmentMeshState
}

interface NodeHealthStatusEntity {
    node?: NodeState
    esNode: EnrollmentDeviceState
}

////////////////////////////////////////////////
// Helpers

function computeMeshHealthStatus(
    mesh: VmeshState | undefined,
    esData: EnrollmentMeshState | undefined,
    nodeMap: Map<string, NodeState>,
): HealthStatus {

    let state: HealthStatus = 'healthy';

    let aliveCount = 0;
    let problematicCount = 0;
    let busyCount = 0;
    let needsRebootCount = 0;

    if (!esData) {
        return 'unknown';
    }

    mesh?.nodes.forEach(unitSerial => {
        const node = nodeMap.get(unitSerial);
        if (!node) {
            return;
        }
        if (node.isConnected) {
            aliveCount += 1;
        }
        if (node.props.rebootRequired) {
            needsRebootCount += 1;
        } else if (!node.props.isHealthy) {
            problematicCount += 1;
        }
        const nodeESData = esData.devices.get(unitSerial);
        if (nodeESData) {
            if (nodeESData.status !== 'ready') {
                if (nodeESData.status === 'errors' || nodeESData.status === 'error') {
                    problematicCount += 1;
                } else {
                    busyCount += 1;
                }
            }
            if (nodeESData.error !== null) {
                problematicCount += 1;
            }
        }
    });

    if (busyCount > 0) {
        return 'busy';
    }

    if (aliveCount === 0) {
        // This mesh is completely dead.
        if (mesh) {
            return 'offline';
        } else if (esData.men.status === 'bootstrapping' || (esData.men.status === 'ready' && !mesh)) {
            return 'busy';
        }
    }

    if (needsRebootCount > 0) {
        state = 'need-reboot';
    }

    if (problematicCount > 0) {
        // There are some problematic nodes on this mesh.
        state = 'errors';
    }

    return state;
}

function computeNodeHealthStatus(
    node: NodeState | undefined,
    esData: EnrollmentDeviceState | undefined,
): HealthStatus {

    let state: HealthStatus = 'healthy';

    if (esData) {
        if (esData.status !== 'ready') {
            state = 'installing';
        }
        // ES device status of null will be cast to empty string
        if (esData.status === '')  {
            state = 'unknown';
        }
        if (esData.status === 'error' || esData.status === 'errors') {
            state = 'errors';
        }
        if (esData.error !== null) {
            state = 'errors';
        }
        if (esData.status === 'bootstrapping' || (esData.status === 'ready' && !node)) {
            state = 'installing';
            return state;
        }
    }

    if (node) {
        if (!node.isConnected) {
            state = 'offline';
            return state;
        }

        if (node.props.rebootRequired) {
            state = 'need-reboot';
            return state;
        }

        if (!node.props.isHealthy) {
            state = 'errors';
            return state;
        }
    } else if (!esData) {
        return 'unknown';
    }


    return state;
}