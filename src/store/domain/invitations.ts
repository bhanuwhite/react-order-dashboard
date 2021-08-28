import * as moment from 'moment';
import { computed, observable } from 'mobx';


export interface InvitationState {
    /** Id of the invitation (inv_id in the backend) */
    id: string
    /** Id of the group the invitation applies to */
    group_id: string
    /** Name of the group the invitation applies to (might be outdated) */
    group_name: string
    /** Veea id of the user who sent this invitation */
    created_by: string
    /** Date when the invite was created at */
    created_at: moment.Moment
    /** Status of the invitation */
    status: 'received' | 'accepted' | 'rejected'
}


export class InvitationsState {

    readonly map = observable.map<string, InvitationState>();

    @computed
    get all(): InvitationState[] {
        return [...this.map.values()].sort(compareInvitations);
    }

    @computed
    get pendingCount(): number {
        return this.all.filter(i => i.status === 'received').length;
    }
}


export const createInvitations = () => new InvitationsState();

function compareInvitations(a: InvitationState, b: InvitationState) {
    if (a.created_at.isAfter(b.created_at)) {
        return -1;
    }
    if (a.created_at.isBefore(b.created_at)) {
        return 1;
    }
    return 0;
}