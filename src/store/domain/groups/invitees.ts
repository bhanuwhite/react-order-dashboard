import { computed, observable } from 'mobx';


export type Invitee = InviteUserId | InviteEmail;

interface Invite {
    /** Id of the invitation (inv_id in the backend) */
    id: string
    /** Veea id of the user who sent this invitation */
    created_by: string
    /** Date when the invite was created at */
    created_at: moment.Moment
}

interface InviteUserId extends Invite {
    type: 'user_id'
    /** Id of the user the invitation is for */
    user_id: string
}

interface InviteEmail extends Invite {
    type: 'email'
    /** Email of the user the invitation is for */
    user_email: string
}


export class InviteesState {

    readonly map = observable.map<string, Invitee>();

    get size() {
        return this.map.size;
    }

    @computed
    get all(): Invitee[] {
        return [...this.map.values()].sort(compareInvitee);
    }
}

function compareInvitee(a: Invitee, b: Invitee) {
    if (a.created_at.isAfter(b.created_at)) {
        return -1;
    }
    if (a.created_at.isBefore(b.created_at)) {
        return 1;
    }
    return 0;
}