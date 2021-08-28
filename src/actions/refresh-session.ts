import { getJSONStdMasResponse, postJSONStdMasResponse } from './helpers';
import { Store } from '@/store';
import { groupServiceSearchDevicesResponse, refreshSessionResponse } from '@/schemas';
import { action } from 'mobx';

/**
 * Refresh the session of the current user.
 */
export async function refreshSession(store: Store) {
    const res = await postJSONStdMasResponse(store, '/refresh-session', {}, refreshSessionResponse);

    if (!res.success) {
        return;
    }

    if (!res.response.success) {
        return;
    }

    const { email, firstName, lastName, groups } = res.response.response;

    action(() => {
        store.view.activeuser.email = email;
        store.view.activeuser.firstName = firstName;
        store.view.activeuser.lastName = lastName ?? '';
        store.view.activeuser.groupsInToken = groups;

        if (!store.view.activeuser.groups.includes(store.view.selectedGroup.groupId)) {
            store.view.selectedGroup.groupId = store.view.activeuser.groups[0];
        }
    })();
}

export async function updateOnboardingNeededState(store: Store) {
    const res = await getJSONStdMasResponse(
        store,
        `/gs/devices?groups=${store.view.activeuser.groups.join(',')}&limit=1`,
        groupServiceSearchDevicesResponse,
    );

    if (!res.success) {
        console.error(`Failed to update onboarding needed state: ${res.message}`);
        return;
    }
    action(() => {
        store.view.activeuser.onboardingNeeded = res.response.data.length === 0;
    })();
}