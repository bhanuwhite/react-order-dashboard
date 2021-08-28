import { RequestResult, putJSONStdMasResponse, postJSONStdMasResponse, deleteStdMasResponse } from './helpers';
import { Store } from '@/store';
import { ignoreSchema } from '@/schemas';


export async function assignUserToACL(
    store: Store,
    partnerId: string,
    aclId: number,
    userId: string,
): Promise<RequestResult<unknown>> {
    return putJSONStdMasResponse(
        store,
        `/ac/partner/${partnerId}/acl/${aclId}/user/${userId}`,
        {},
        ignoreSchema,
    );
}

export async function createACL(
    store: Store,
    name: string,
    description: string,
    partnerId: string,
): Promise<RequestResult<unknown>> {
    return postJSONStdMasResponse(
        store,
        `/ac/partner/${partnerId}/acl`,
        {
            name,
            description,
            partnerId,
        },
        ignoreSchema,
    );
}

/**
 * Update an acl in the backend.
 *
 * @param store global mobx store
 * @param partnerId id of the partner
 * @param aclId id of the acl
 * @param name name of the acl
 * @param description description of the acl
 */
export async function updateAclInfo(
    store: Store,
    partnerId: string,
    aclId: string,
    name: string,
    description: string,
): Promise<RequestResult<unknown>> {

    const body = {
        name,
        description,
    };
    return putJSONStdMasResponse(store, `/ac/partner/${partnerId}/acl/${aclId}`, body, ignoreSchema);
}

/**
 * Unlink a user from ACL.
 */
export async function removeUserFromACL(
    store: Store,
    partnerId: string,
    aclId: string,
    userId: string,
): Promise<RequestResult<unknown>> {

    return deleteStdMasResponse(store, `/ac/partner/${partnerId}/acl/${aclId}/user/${userId}`, ignoreSchema);
}
