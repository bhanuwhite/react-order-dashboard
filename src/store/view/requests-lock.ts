import { observable } from 'mobx';


export interface RequestsLocksState {
    /**
     * When this is set to true, we should not send other request
     * to invite a user. They will fail with a "processing your invite"
     * error.
     */
    inviteProcessed: Set<string>
}

export const createRequestsLocks = () => observable<RequestsLocksState>({
    inviteProcessed: new Set<string>(),
});