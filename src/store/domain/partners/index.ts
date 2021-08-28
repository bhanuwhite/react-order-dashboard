import { computed, observable } from 'mobx';
import { HasFetcherProps, Value } from '../_helpers';
import { ApplicationsState, createApplications } from './applications';


export type PartnerProps = NoPartnerProps | FullPartnerProps;

interface NoPartnerProps {
    /** partner not fetched yet */
    isPartial: true
}

interface FullPartnerProps {
    /** Partner was fetched at least once; */
    isPartial: false
    /** Name of the partner */
    name: string
    /** Short description to explains the purpose of the partner */
    description: string
    /** Last time (unix timestampt) that this partner was updated */
    updatedAt: number
    /** Email address of user who updated the partner */
    updatedBy: string | null
}

type UserId = string;

export interface ACLInfo {
    id: number
    name: string
    description: string | null
    users: string[]
    updatedAt: number
    updatedBy: string | null
}

export class PartnerState implements HasFetcherProps<PartnerProps> {

    readonly id: string;

    // Common props obtained when querying multiple partners or a single one.
    @observable
    props: PartnerProps;

    // Obtained only when querying the partner directly
    @observable
    users: UserId[] = [];

    // Obtained only when querying the partner directly
    @observable
    acls: ACLInfo[] = [];

    @computed
    get hasAnyACLs(): boolean {
        return this.acls.length > 0;
    }

    // Map of acl id to acl info
    @computed
    get aclMap(): Map<number, ACLInfo> {
        return new Map<number, ACLInfo>(
            this.acls.map(info => [info.id, info] as const)[Symbol.iterator](),
        );
    }

    // Uploaded applications for a given partner
    @observable
    applications: ApplicationsState;

    get hasAnyApplications(): boolean {
        return this.applications.size > 0;
    }

    constructor(
        { id, ...props }: Value & PartnerProps,
    ) {
        this.id = id;
        this.props = props;
        this.applications = createApplications();
    }
}

export class PartnersState {

    /**
     * Contained cached values for all partners fetched.
     */
    readonly map = observable.map<string, PartnerState>();

    @computed
    get all(): PartnerState[] {
        return [...this.map.values()];
    }

    @computed
    get hasAnyValidPartner(): boolean {
        return this.all.some(p => !p.props.isPartial);
    }
}

export const createPartners = () => new PartnersState();


/**
 * Helper function to assert in typescript that partner props are defined.
 * In development it throw an exception if this is not true.
 *
 * @param props partner props
 */
export function assertPartnerPropsIsNotPartial(props: PartnerProps): asserts props is FullPartnerProps {

    if (process.env.NODE_ENV === 'development') {
        if (props.isPartial) {
            throw new Error(`Bug found! Expected ${props} to be FullPartnerProps`);
        }
    }
}