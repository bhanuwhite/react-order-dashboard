import { computed, observable } from 'mobx';
import { Page } from '@/store/pages';
import { HasFetcherProps, Value } from '../_helpers';
import { InviteesState } from './invitees';


export interface GroupProps {
    /**
     * Name of the group
     * @deprecated
     */
    name: string
    /**
     * Display name of the group
     */
    displayName: string
    /**
     * Stats
     */
    counts: GroupStats
    /**
     * Contact UUID
     */
    contactId: string | null
    /**
     * What is this? :'(
     */
    authzResource: string
    /**
     * Path to the group. This path also includes this group
     * as the last element.
     */
    path: GroupPathElement[]
}

export interface GroupPathElement {
    /** Id of the group */
    id: string
    /** @deprecated */
    name: string
    /** Display name of the group */
    displayName: string
}

interface GroupStats {
    children: number
    devices: number
    meshes: number
    users: number
}

interface CertProps {
    // FIXME: what is this?
    serialNumber: string
    // FIXME: what is this?
    certificate: string
    // FIXME: what is this?
    privateKey: string
}

export class GroupState implements HasFetcherProps<GroupProps> {

    readonly id: string;

    @observable
    props: GroupProps;

    /**
     * Children of this group.
     */
    @observable
    children: string[] = [];

    /**
     * Immediate Users in this group (best effort info might be paginated)
     * Some users might be missing if this group has a lot of users (more than 20)
     */
    @observable
    users: string[] = [];

    /**
     * List of users invited to the group.
     * This is populated by the invitations APIs
     */
    invitees = new InviteesState();

    @observable
    cert: CertProps | null = null;

    @computed
    get idPath(): string {
        return this.props.path.map(p => p.id).join('/');
    }

    /**
     * Name of this group
     */
    get name(): string {
        return this.props.displayName;
    }

    constructor(
        { id, ...props }: Value & GroupProps,
    ) {
        this.id = id;
        this.props = props;
    }

    childrenRefs(currentState: GroupsState): GroupState[] {
        return this.children.map(c => currentState.map.get(c))
            .filterNullable();
    }

    getDepth() {
        return this.props.path.length;
    }

    isGroupContact(userUUID: string | undefined): boolean {
        return this.props.contactId === userUUID;
    }
}

export class GroupsState {

    /**
     * Contains cached values for all groups.
     * If memory usage turns out to be high, we could consider
     * writing an observable lru map with fixed capacity and use
     * it here instead.)
     */
    readonly map = observable.map<string, GroupState>();

    /**
     * Returns the groups associated with provided page.
     * @param page page object
     */
    getGroupsForPage(page: Page<GroupState> | undefined): GroupState[] {
        return page?.values(this.map) || [];
    }
}

export const createGroups = () => new GroupsState();