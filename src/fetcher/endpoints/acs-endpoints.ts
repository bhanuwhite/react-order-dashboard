import { FetcherInstance } from '../instance';
import { Store } from '@/store';
import {
    aclsResponse,
    aclResponse,
    partnerApplicationResponse,
    partnerApplicationsResponse,
    partnerResponse,
    partnersResponse,
    userPartnerResponse,
    ownerConfigurationResponse,
} from '@/schemas/acs-api';
import { updateMapWithClass, updateOneEntryWithClass } from './helpers';
import { ACLInfo, PartnerState } from '@/store/domain/partners';
import { ApplicationProps, PartnerApplication } from '@/store/domain/partners/applications';
import { action } from 'mobx';
import { updateProps } from '@/utils/obj';
import { GroupState } from '@/store/domain/groups';


export function handleACSEndpoints(instance: FetcherInstance, store: Store) {

    // Fetch a user's partner id
    instance.getWithHTTPErrors('/ac/partner/user/:userId', async (res, { userId }, query) => {

        // If it's a 50x it's probably worth reporting a server error
        if (res.status > 499) {
            return `Got ${JSON.stringify(res.body)} (${res.status}) while fetching ${query.getEndpoint()}`;
        }

        // 40x are the same as no partner.
        if (res.status > 399) {

            action(() => {
                store.view.activeuser.partnerId = '';
            })();
            return;
        }

        const result = userPartnerResponse.validate(res.body);
        if (result.type === 'error') {
            return result;
        }

        if (userId !== store.view.activeuser.authUserId) {
            return 'Not implemented';
        }

        action(() => {
            store.view.activeuser.partnerId = result.value.partnerId;
        })();
    });

    // Fetch ACLs of a partner
    instance.get('/ac/partner/:partnerId/acl', async (res, { partnerId }) => {

        const result = aclsResponse.validate(res.body);
        if (result.type === 'error') {
            return result;
        }

        const acls = result.value;

        action(() => {
            let p = store.domain.partners.map.get(partnerId);
            if (!p) {
                p = new PartnerState({
                    id: partnerId,
                    isPartial: true,
                });
                store.domain.partners.map.set(partnerId, p);
            }

            const aclMap = new Map<number, ACLInfo>();
            for (const networkAcl of acls) {
                aclMap.set(networkAcl.id, {
                    ...networkAcl,
                    users: [],
                });
            }

            for (const [ i, storeACL ] of p.acls.entries()) {

                // check to see if ACL already exists in the store and populate metadata
                if (aclMap.has(storeACL.id)) {
                    const acl = aclMap.get(storeACL.id)!;
                    storeACL.name = acl.name;
                    storeACL.updatedAt = acl.updatedAt;
                    storeACL.updatedBy = acl.updatedBy;
                    storeACL.description = acl.description;
                    storeACL.users = storeACL.users.length > 0 ? storeACL.users : [];

                    // remove populated ACL from map
                    aclMap.delete(storeACL.id);
                } else {
                    p.acls.splice(i, 1);
                }
            }

            // populate any remaining ACLs
            for (const [ _aclId , aclToAdd ] of aclMap) {
                p.acls.push(aclToAdd);
            }
        })();
    });

    // Fetch users for ACLs of a partner
    instance.get('/ac/partner/:partnerId/acl/:aclId/user', async (res, { partnerId, aclId }) => {

        const result = aclResponse.validate(res.body);
        if (result.type === 'error') {
            return result;
        }

        const acl = result.value;

        const fullACL = {
            ...acl,
            users: acl.members.map(m => `${m}`),
        };

        action(() => {
            let p = store.domain.partners.map.get(partnerId);
            if (!p) {
                p = new PartnerState({
                    id: partnerId,
                    isPartial: true,
                });
                store.domain.partners.map.set(partnerId, p);
            }

            const aclFoundIndex = p.acls.findIndex(a => a.id === Number(aclId));
            if (aclFoundIndex !== -1) {
                p.acls[aclFoundIndex] = fullACL;
            } else {
                p.acls.push(fullACL);
            }
        })();
    });

    // Fetch all partners
    instance.get('/ac/partner', async (res) => {

        const result = partnersResponse.validate(res.body);
        if (result.type === 'error') {
            return result;
        }

        const partners = result.value;

        updateMapWithClass(store.domain.partners, PartnerState, partners, ({ partnerId, ...rest }) => ({
            id: partnerId,
            isPartial: false,
            ...rest,
        }));
    });

    // Fetch a single partner
    instance.get('/ac/partner/:partnerId', async (res) => {

        const result = partnerResponse.validate(res.body);
        if (result.type === 'error') {
            return result;
        }

        const partner = result.value;

        action(() => {
            const { partnerId, ...rest } = partner;
            let p = store.domain.partners.map.get(partner.partnerId);
            if (p) {
                updateProps(p.props, { ...rest, isPartial: false as const });
            } else {
                p = new PartnerState({
                    id: partnerId,
                    isPartial: false,
                    ...rest,
                });
                store.domain.partners.map.set(partner.partnerId, p);
            }
            p.users = [];
            p.users.push(...partner.userIds.map(id => `${id}`));
        })();
    });

    // Fetch packages of a partner
    instance.get('/ac/partner/:partnerId/package', async (res, { partnerId }) => {

        const result = partnerApplicationsResponse.validate(res.body);
        if (result.type === 'error') {
            return result;
        }

        const applications = result.value.results;

        action(() => {
            let p = store.domain.partners.map.get(partnerId);
            if (!p) {
                p = new PartnerState({
                    id: partnerId,
                    isPartial: true,
                });
                store.domain.partners.map.set(partnerId, p);
            }

            updateMapWithClass(p.applications, PartnerApplication, applications, (a) => ({
                ...a,
                features: a.features.filterNullable(),
            }));
        })();
    });

    // Fetch a specific package given a partner
    instance.get('/ac/partner/:partnerId/package/:applicationId', async (res, { partnerId }) => {

        const result = partnerApplicationResponse.validate(res.body);
        if (result.type === 'error') {
            return result;
        }
        console.log(partnerId);
        const application = result.value;
        handleAddApplicationToStore(store, partnerId, {
            ...application,
            features: application.features.filterNullable(),
        });
    });

    // Fetch a group certificate
    instance.get('/ac/configurations/owners/:groupId', async (res, { groupId }) => {

        const result = ownerConfigurationResponse.validate(res.body);
        if (result.type === 'error') {
            return result;
        }

        const { certificate } = result.value;
        action(() => {
            let g = store.domain.groups.map.get(groupId);
            if (!g) {
                g = new GroupState({
                    id: groupId,
                    path: [],
                    displayName: '',
                    contactId: '',
                    authzResource: '',
                    counts: { children: 0, devices: 0, meshes: 0, users: 0 },
                    name: '',
                });
                store.domain.groups.map.set(groupId, g);
            }

            g.cert = certificate;
        })();
    });
}

/**
 * Update or add an application in a partner in the store
 * @param store
 * @param partnerId
 * @param app
 */
export function handleAddApplicationToStore(
    store: Store,
    partnerId: string,
    app: ApplicationProps,
) {
    action(() => {
        let p = store.domain.partners.map.get(partnerId);
        if (!p) {
            p = new PartnerState({
                id: partnerId,
                isPartial: true,
            });
            store.domain.partners.map.set(partnerId, p);
        }

        updateOneEntryWithClass(p.applications.map, PartnerApplication, app);
    })();
}