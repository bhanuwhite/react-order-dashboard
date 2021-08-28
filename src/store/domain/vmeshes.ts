import { observable, ObservableMap } from 'mobx';
import { HasFetcherProps, Value } from './_helpers';

export interface VmeshProps {
    /** This is the MAS vmesh id */
    meshId: number
    /** Group is a MAS concept. This is the group that this mesh belongs to. */
    groupId: string
    /**
     * This name should not be used to show the mesh's name.
     * The mesh name information should come from ACS. If the info from
     * ACS isn't available, this is the best thing we can show afterwards.
     */
    name: string
    ssid: string
    swarmid: string
    createdAt: string
    updatedAt: string
    lastSeenPost: string
    lastSeenPoll: string
    restrictedBackhaul: boolean
    uuid: string | null
    /**
     * Managers in this Mesh (specifically, their unitSerials)
     * The entire code base assume that this array contains exactly
     * one element. (Never 0 or more than 1).
     */
    managers: string[]
    /**
     * Workers in this Mesh (specifically, their unitSerials)
     */
    workers: string[]
    /**
     * @deprecated
     */
    services: string[]
    /**
     * True if the MAS says that this mesh is healthy. "Healthy" is an aggregated
     * state in the MAS and in this project a mesh is "healthy" only if the function
     * in `@/store/derived/health.ts` to get the health of a mesh says so.
     * Do not show this field directly in the UI unless it's to specifically talk about the
     * MAS healthy value.
     */
    masHealthy: boolean
    /**
     * True if the MAS says that this mesh is operational. This is again an aggregated state.
     * Please refer to the MAS documentation to know more about this field.
     */
    masOperational: boolean
}

export class VmeshState implements HasFetcherProps<VmeshProps> {

    /**
     * This id is actually the MEN unit serial. This is the only
     * id that is shared between the MAS and ACS. This assumes
     * that we can only have one MEN per mesh (which has always
     * held so far).
     */
    readonly id: string;

    @observable
    props: VmeshProps;

    get managers() {
        return this.props.managers;
    }

    get workers() {
        return this.props.workers;
    }

    get nodes() {
        return this.props.managers.concat(this.props.workers);
    }

    get services() {
        return this.props.services;
    }

    constructor(
        { id, ...props }: Value & VmeshProps,
    ) {
        this.id = id;
        this.props = props;
    }
}

export interface VmeshesState {
    map: ObservableMap<string, VmeshState>
    all: VmeshState[]
}

export const createVmeshes = () => observable<VmeshesState>({
    map: observable.map<string, VmeshState>({}, { deep: false }),
    get all(): VmeshState[] {
        return [...this.map.values()];
    },
});
