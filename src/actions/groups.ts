import { ignoreSchema } from '@/schemas';
import { Store } from '@/store';
import { GroupState } from '@/store/domain/groups';
import { action } from 'mobx';
import {
    deleteStdMasResponse,
    patchJSONStdMasResponse,
    postJSONStdMasResponse,
    putJSONStdMasResponse,
    RequestResult,
} from './helpers';

export function createChildGroup(store: Store, groupId: string, groupName: string): Promise<RequestResult<unknown>> {
    const endpoint = `/gs/groups/${groupId}/children`;
    return postJSONStdMasResponse(store, endpoint, { name: 'todo', displayName: groupName }, ignoreSchema);
}

export function updateGroup(store: Store, groupId: string, groupName: string): Promise<RequestResult<unknown>> {
    const endpoint = `/gs/groups/${groupId}`;
    return patchJSONStdMasResponse(store, endpoint, { displayName: groupName }, ignoreSchema);
}

export function deleteGroup(store: Store, groupId: string): Promise<RequestResult<unknown>> {
    const endpoint = `/gs/groups/${groupId}`;
    return deleteStdMasResponse(store, endpoint, ignoreSchema);
}

export function moveGroups(
    store: Store,
    groupIds: string[],
    destinationGroupId: string,
): Promise<RequestResult<unknown>> {

    const endpoint = `/gs/groups/${destinationGroupId}/children`;
    return putJSONStdMasResponse(store, endpoint, groupIds, ignoreSchema);
}

export async function joinGroup(
    store: Store,
    group: GroupState,
): Promise<RequestResult<unknown>> {

    const groupId = group.id;
    const userUUID = store.view.activeuser.keycloakUUID!;
    const endpoint = `/gs/groups/${groupId}/users/${userUUID}`;
    const res = await putJSONStdMasResponse(store, endpoint, undefined, ignoreSchema);

    if (res.success) {
        action(() => {
            store.view.activeuser.groupsInToken.push(group.idPath);
        })();
    }

    return res;
}

export async function removeUserFromGroup(
    store: Store,
    group: GroupState,
    userUUID: string,
): Promise<RequestResult<unknown>> {

    const groupId = group.id;
    const idPath = group.idPath;
    const endpoint = `/gs/groups/${groupId}/users/${userUUID}`;
    const res = await deleteStdMasResponse(store, endpoint, ignoreSchema);

    if (res.success && userUUID === store.view.activeuser.keycloakUUID) {
        action(() => {
            const i = store.view.activeuser.groupsInToken.indexOf(idPath);
            if (i > -1) {
                store.view.activeuser.groupsInToken.splice(i, 1);
                if (store.view.selectedGroup.groupId === groupId) {
                    store.view.selectedGroup.groupId = store.view.activeuser.groups[0];
                }
            } else {
                console.error(
                    `Couldn't remove from group ${groupId} from token `,
                    `(could not find ${group.idPath} in ${JSON.stringify(store.view.activeuser.groupsInToken)})`,
                );
            }
        })();
    }

    return res;
}