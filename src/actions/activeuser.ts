import { action } from 'mobx';
import { userSelfSchema } from '@/schemas';
import { getJSONStdMasResponse } from './helpers';
import { Store } from '@/store';


export function getUserSelf(store: Store) {
    const endpoint = '/mas/v2/users/self?depth=2';

    return getJSONStdMasResponse(store, endpoint, userSelfSchema);
}

export async function storeUserSelf(store: Store) {
    // Get the user information from the MAS
    const res = await getUserSelf(store);
    // Check for failures
    if (!res.success) {
        console.error('Could not get user', res);
        return res;
    }

    // Update the store with the response
    action(() => {
        store.view.activeuser.masUser = res.response;
    })();

    return res;
}

/**
 * Invite the user to refresh the page.
 * Reason could be:
 *  - The session expired (because the backend restarted)
 *  - The version of the backend and frontend no longer matches.
 */
export function inviteUserToRefreshPage(store: Store, reason: number) {
    action(() => {
        store.view.activeuser.inviteToRefreshPage = true;
        store.view.activeuser.inviteToRefreshPageReason = reason;
    })();
}