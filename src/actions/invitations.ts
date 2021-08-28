import { CLEAR_INVITE_IN_MS } from '@/consts/invites';
import { invitationsAcceptResonse, selfAPIIgnoreResponse, SelfAPIResult } from '@/schemas';
import { Store } from '@/store';
import { action } from 'mobx';
import { deleteStdMasResponse, postJSONStdMasResponse } from './helpers';


/**
 * Invite a user to join a group.
 */
export async function inviteUserToGroup(
    store: Store,
    groupId: string,
    groupName: string,
    userUUID: string | undefined,
    userEmail: string | undefined,
): Promise<SelfAPIResult> {

    const body = {
        groupId,
        groupName,
        userEmail,
        userUUID,
    };

    const res = await postJSONStdMasResponse(
        store,
        '/invitations/new',
        body,
        selfAPIIgnoreResponse,
    );

    if (!res.success) {
        return res;
    }

    if (!res.response.success) {
        return res.response;
    }

    return res.response;
}

/**
 * Accept all pending invitations (the one present in the store).
 */
export async function acceptAllInvitations(store: Store): Promise<SelfAPIResult> {

    const invIds = store.domain.invitations.all
        .filter(inv => inv.status === 'received' && !store.view.requests.inviteProcessed.has(inv.id))
        .map(inv => inv.id);

    if (invIds.length === 0) {
        return {
            success: false,
            message: 'You have already accepted all pending invitations',
        };
    }

    // Lock all the invites.
    action(() => {
        for (const invId of invIds) {
            store.view.requests.inviteProcessed.add(invId);
        }
    })();

    const res = await postJSONStdMasResponse(
        store,
        `/invitations/${invIds.join(',')}/accept`,
        {},
        invitationsAcceptResonse,
    );

    if (!res.success) {
        return res;
    }

    if (!res.response.success) {
        return res.response;
    }

    const newGroups = res.response.response;

    // Let's mark all the invitations in the store as 'accepted'
    // and unlock them (although we can no longer do anything with them)
    action(() => {
        const modifiedInvIds: string[] = [];
        for (const invId of invIds) {
            store.view.requests.inviteProcessed.delete(invId);
            const inv = store.domain.invitations.map.get(invId);
            if (inv) {
                inv.status = 'accepted';
                modifiedInvIds.push(invId);
            }
        }
        clearInvites(store, modifiedInvIds);
        updateGroups(store, newGroups);
    })();

    return res.response;
}

/**
 * Accept the provided invitation.
 */
export async function acceptInvitation(store: Store, invId: string): Promise<SelfAPIResult> {

    if (store.view.requests.inviteProcessed.has(invId)) {
        return {
            success: false,
            message: `This invitation is already being processed`,
        };
    }

    action(() => {
        store.view.requests.inviteProcessed.add(invId);
    })();

    const res = await postJSONStdMasResponse(
        store,
        `/invitations/${invId}/accept`,
        {},
        invitationsAcceptResonse,
    );

    if (!res.success) {
        return res;
    }

    if (!res.response.success) {
        return res.response;
    }

    const newGroups = res.response.response;
    action(() => {
        store.view.requests.inviteProcessed.delete(invId);
        const inv = store.domain.invitations.map.get(invId);
        if (inv) {
            inv.status = 'accepted';
            clearInvite(store, invId);
        }
        updateGroups(store, newGroups);
    })();

    return res.response;
}

/**
 * Decline or cancel an invitation. Can be sent for an invitation addressed
 * to the logged in user or for one that is for a group the logged in user
 * belongs to.
 */
export async function declineInvitation(store: Store, invId: string): Promise<SelfAPIResult> {

    if (store.view.requests.inviteProcessed.has(invId)) {
        return {
            success: false,
            message: `This invitation is already being processed`,
        };
    }

    action(() => {
        store.view.requests.inviteProcessed.add(invId);
    })();

    const res = await deleteStdMasResponse(
        store,
        `/invitations/${invId}`,
        selfAPIIgnoreResponse,
    );

    if (!res.success) {
        return res;
    }

    if (!res.response.success) {
        return res.response;
    }

    action(() => {
        store.view.requests.inviteProcessed.delete(invId);

        // This will be undefined if the invitation was rejected for another user.
        // But this is fine.
        const inv = store.domain.invitations.map.get(invId);
        if (inv) {
            inv.status = 'rejected';
            clearInvite(store, invId);
        }
    })();

    return res.response;
}

function clearInvite(store: Store, invId: string) {
    setTimeout(action(() => {
        store.domain.invitations.map.delete(invId);
    }), CLEAR_INVITE_IN_MS);
}

function clearInvites(store: Store, invIds: string[]) {
    setTimeout(action(() => {
        for (const invId of invIds) {
            store.domain.invitations.map.delete(invId);
        }
    }), CLEAR_INVITE_IN_MS);
}

function updateGroups(store: Store, newGroups: string[]) {
    store.view.activeuser.groupsInToken = newGroups;
}