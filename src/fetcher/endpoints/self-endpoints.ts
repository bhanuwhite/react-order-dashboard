import * as moment from 'moment';
import { action } from 'mobx';
import { Store } from '@/store';
import { FetcherInstance } from '../instance';
import { updateMap, updateOneEntry } from './helpers';
import {
    paymentDetailsResponse,
    whitelistedResponse,
    keycloakUsersResponse,
    minPasswordLengthResponse,
    fulfillableDevicesResponse,
    allSubscriptionsResponse,
    invitationsResponse,
    invitationsInGroupResponse,
} from '@/schemas/self-api';
import { UserState } from '@/store/domain/users';
import { InvitationState } from '@/store/domain/invitations';
import { updateProps } from '@/utils/obj';
import { GroupState } from '@/store/domain/groups';


export function handleSelfEndpoints(instance: FetcherInstance, store: Store) {

    // List of cards and subscriptions
    instance.get('/account/payment/details', async (res) => {
        const result = paymentDetailsResponse.validate(res.body);

        if (result.type === 'error') {
            return result;
        }

        const { value } = result;

        if (!value.success) {
            return value.message;
        }

        const { sources, subscriptions, billingAddress } = value.response;

        action(() => {
            store.domain.account.billingAddress = billingAddress;
        })();
        updateMap(store.domain.account.sources, sources, n => n);
        for (const sub of subscriptions) {
            updateOneEntry(store.domain.account.stripeSubscriptions.map, sub);
        }
    });

    instance.get('/subscriptions/all', async (res) => {
        const result = allSubscriptionsResponse.validate(res.body);
        if (result.type === 'error') {
            return result;
        }

        const { value } = result;
        if (!value.success) {
            return value.message;
        }

        const { subscriptions } = value.response;
        updateMap(store.domain.account.stripeSubscriptions, subscriptions, sub => sub);
    });

    instance.get('/subscriptions/whitelist/:unitSerial', async (res, params) => {
        const result = whitelistedResponse.validate(res.body);
        const { unitSerial } = params;

        if (result.type === 'error') {
            return result;
        }

        const { value } = result;

        if (!value.success) {
            return value.message;
        }

        action(() => {
            // tslint:disable-next-line:forin
            for (const unitSerialResponse in value.response) {
                store.domain.whitelisting.set(unitSerial, value.response[unitSerialResponse]);
            }
        })();
    });

    // Fetch invitations for the logged in user
    instance.get('/invitations', async (req) => {
        const result = invitationsResponse.validate(req.body);
        if (result.type === 'error') {
            return result;
        }

        const { value } = result;

        if (!value.success) {
            return value.message;
        }

        action(() => {
            const invitations = store.domain.invitations.map;
            const newInvites: InvitationState[] = value.response.map(inv => ({
                id: inv.inv_id,
                group_id: inv.group_id,
                group_name: inv.group_name,
                created_at: moment.default(inv.created_at),
                created_by: `${inv.created_by}`,
                status: 'received',
            }));

            const hasBeenRemoved = new Set(invitations.keys());

            for (const invite of newInvites) {
                const prevInvite = invitations.get(invite.id);
                if (prevInvite) {
                    // Update the invite but preserve its status
                    const oldStatus = prevInvite.status;
                    updateProps(prevInvite, invite);
                    prevInvite.status = oldStatus;
                } else {
                    invitations.set(invite.id, invite);
                }
                hasBeenRemoved.delete(invite.id);
            }

            for (const id of hasBeenRemoved) {
                const invite = invitations.get(id)!;
                if (invite.status === 'received') {
                    invitations.delete(id);
                }
            }
        })();
    });

    instance.get('/invitations/groups/:groupId', async (req, params) => {
        const result = invitationsInGroupResponse.validate(req.body);
        if (result.type === 'error') {
            return result;
        }

        const { value } = result;

        if (!value.success) {
            return value.message;
        }

        const { groupId } = params;

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

            updateMap(g.invitees, value.response, (v) => {
                if (v.user_id) {
                    return {
                        type: 'user_id' as const,
                        id: v.inv_id,
                        user_id: `${v.user_id}`,
                        created_at: moment.default(v.created_at),
                        created_by: `${v.created_by}`,
                    };
                }
                if (v.user_email) {
                    return {
                        type: 'email' as const,
                        id: v.inv_id,
                        user_email: v.user_email,
                        created_at: moment.default(v.created_at),
                        created_by: `${v.created_by}`,
                    };
                }
                return null;
            });
        })();
    });

    // Fetch a single user id from keycloak (admin api)
    instance.merge('/users/:userId', (reqs) => `/users/${reqs.map(r => r.userId).join(',')}`);
    instance.get('/users/:userId', async (req) => {

        const result = keycloakUsersResponse.validate(req.body);
        if (result.type === 'error') {
            return result;
        }

        const { value } = result;

        if (!value.success) {
            return value.message;
        }

        action(() => {
            const users = value.response;
            for (const user of users) {
                store.domain.users.setUser(user.id, {
                    firstName: user.firstName ?? '',
                    lastName: user.lastName ?? '',
                    username: user.username,
                    email: user.email ?? '',
                    emailVerified: user.emailVerified,
                    enabled: user.enabled,
                    veeaUserId: user.attributes.userId ? user.attributes.userId[0] : undefined,
                    allowReceiveSms: user.attributes.allowReceiveSms ?
                        user.attributes.allowReceiveSms[0] === 'true' : undefined,
                    phoneNumber: user.attributes.phoneNumber ? user.attributes.phoneNumber[0] : undefined,
                    countryCode: user.attributes.countryCode ? user.attributes.countryCode[0] : undefined,
                    company: user.attributes.company ? user.attributes.company[0] : undefined,
                });
            }
        })();
    });

    // Search for users from keycloak (admin api)
    instance.get('/users', async (req, _params, query) => {

        const result = keycloakUsersResponse.validate(req.body);
        if (result.type === 'error') {
            return result;
        }

        const { value } = result;

        if (!value.success) {
            return value.message;
        }

        action(() => {
            const page = store.pages.newPageFromResponse<UserState>(query, null, null);
            page.clearRefs();

            const users = value.response;
            for (const user of users) {
                page.addRef(store.domain.users.setUser(user.id, {
                    firstName: user.firstName ?? '',
                    lastName: user.lastName ?? '',
                    username: user.username,
                    email: user.email ?? '',
                    emailVerified: user.emailVerified,
                    enabled: user.enabled,
                    veeaUserId: user.attributes.userId ? user.attributes.userId[0] : undefined,
                    allowReceiveSms: user.attributes.allowReceiveSms ?
                        user.attributes.allowReceiveSms[0] === 'true' : undefined,
                    phoneNumber: user.attributes.phoneNumber ? user.attributes.phoneNumber[0] : undefined,
                    countryCode: user.attributes.countryCode ? user.attributes.countryCode[0] : undefined,
                    company: user.attributes.company ? user.attributes.company[0] : undefined,
                }));
            }
        })();
    });

    // Fetch the minimum required password length from the Keycloak realm
    instance.get('/realm/min-password-length', async (req) => {
        const result = minPasswordLengthResponse.validate(req.body);
        if (result.type === 'error') {
            return result;
        }

        const { value } = result;

        if (!value.success) {
            return value.message;
        }

        const { minPasswordLength } = value.response;

        action(() => {
            store.view.realm.minPasswordLength = minPasswordLength;
        })();
    });

    // Fetch the remaining fulfillable units
    instance.get('/vtpn/inventory', async (req) => {
        const result = fulfillableDevicesResponse.validate(req.body);
        if (result.type === 'error') {
            return result;
        }

        const { value: res } = result;

        if (!res.success) {
            return res.message;
        }

        updateMap(store.domain.inventory, Object.entries(res.response).map(([ id, value ]) => ({
            id,
            ...value,
        })), ({ id, error, total }) => ({
            id,
            error,
            qty: total,
        }));
    });
}