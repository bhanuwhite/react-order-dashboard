import { action } from 'mobx';
import { Store } from '@/store';
import { GroupState } from '@/store/domain/groups';
import { groupResponse, groupsResponse, usersResponse, userResponse, rolesResponse, devicesResponse } from '@/schemas/groups-api';
import { FetcherInstance } from '../instance';
import { updateOneEntryWithClass, updateMap } from './helpers';
import { UserState } from '@/store/domain/users';


export function handleGroupServiceEndpoints(instance: FetcherInstance, store: Store) {

    // Request all roles
    // Technically they are paginated, but we should never have more than a 100 roles
    // So let's ignore that.
    instance.get('/gs/roles', async (res) => {
        const result = rolesResponse.validate(res.body);
        if (result.type === 'error') {
            return result;
        }

        updateMap(store.domain.roles, result.value.data, r => r);
    });


    // A user was requested
    instance.get('/gs/users/:userId', async (res) => {
        const result = userResponse.validate(res.body);
        if (result.type === 'error') {
            return result;
        }

        const user = result.value;
        action(() => {
            store.domain.users.setUser(user.id, user);
        })();
    });


    // Search / List all users
    // Query params: limit, groups, search, next/prev
    instance.get('/gs/users', async (res, _params, query) => {
        const result = usersResponse.validate(res.body);
        if (result.type === 'error') {
            return result;
        }

        const { meta, data } = result.value;

        action(() => {
            const page = store.pages.newPageFromResponse<UserState>(query, meta.nextCursor, meta.prevCursor);
            page.clearRefs();

            for (const user of data) {

                page.addRef(store.domain.users.setUser(user.id, user));
            }
        })();
    });

    // Some groups were requested (no cursor)
    instance.get('/gs/groups/:groupIds', async (res) => {

        const result = groupResponse.validate(res.body);
        if (result.type === 'error') {
            return result;
        }

        for (const group of result.value) {
            updateOneEntryWithClass(store.domain.groups.map, GroupState, group);
        }
    });

    // Get devices of a groups only used to check the selected group at the moment
    // We could cache that information per group in the future
    instance.get('/gs/groups/:groupId/devices', async (res, { groupId }) => {
        const result = devicesResponse.validate(res.body);
        if (result.type === 'error') {
            return result;
        }

        const response = result.value;

        if (groupId === store.view.selectedGroup.groupId) {
            action(() => {
                store.view.selectedGroup.hasDevices = response.data.length > 0;
            })();
        } else {
            console.error(
                `Ignored response when querying /gs/groups/${groupId}/devices as the selected` +
                ` group is ${store.view.selectedGroup.groupId}`,
            );
        }
    });

    // List all users in a group
    instance.get('/gs/groups/:groupId/users', async (res, { groupId }, query) => {
        const result = usersResponse.validate(res.body);
        if (result.type === 'error') {
            return result;
        }

        const { meta, data } = result.value;

        action(() => {
            let g = store.domain.groups.map.get(groupId);
            if (!g) {
                g = new GroupState({
                    id: groupId,
                    // FIXME: We should set a isPartial: true flag.
                    // isPartial: true,
                    path: [],
                    displayName: '',
                    contactId: '',
                    authzResource: '',
                    counts: { children: 0, devices: 0, meshes: 0, users: 0 },
                    name: '',
                });
                store.domain.groups.map.set(groupId, g);
            }

            const page = store.pages.newPageFromResponse<UserState>(query, meta.nextCursor, meta.prevCursor);
            page.clearRefs();
            
            g.users = [];// g.users.clear();
            for (const user of data) {
                const { attributes, ...rest } = user;
                page.addRef(store.domain.users.setUser(user.id, {
                    veeaUserId: attributes.userId,
                    ...rest,
                }));
                g.users.push(user.id);
            }
        })();
    });

    // Search / List all groups
    // Query params: limit, groups, search, next/prev
    instance.get('/gs/groups', async (res, _params, query) => {

        const result = groupsResponse.validate(res.body);
        if (result.type === 'error') {
            return result;
        }

        const { meta, data } = result.value;

        action(() => {
            const page = store.pages.newPageFromResponse<GroupState>(query, meta.nextCursor, meta.prevCursor);
            page.clearRefs();

            for (const group of data) {

                page.addRef(updateOneEntryWithClass(store.domain.groups.map, GroupState, group));
            }
        })();
    });

    // Children of a group (paginated)
    // Query params: limit, next/prev
    instance.get('/gs/groups/:groupId/children', async (res, { groupId }, query) => {
        const result = groupsResponse.validate(res.body);
        if (result.type === 'error') {
            return result;
        }

        const { meta, data } = result.value;
        const parentGroup = store.domain.groups.map.get(groupId);

        action(() => {
            if(parentGroup?.children){
                parentGroup.children = [];
            }

            const page = store.pages.newPageFromResponse<GroupState>(query, meta.nextCursor, meta.prevCursor);
            page.clearRefs();

            for (const group of data) {

                const storeGroup = updateOneEntryWithClass(store.domain.groups.map, GroupState, group);
                page.addRef(storeGroup);

                if (parentGroup) {
                    parentGroup.children.push(group.id);
                }
            }
        })();
    });
}