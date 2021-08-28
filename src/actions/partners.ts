import { RequestResult, putJSONStdMasResponse, postJSONStdMasResponse, deleteStdMasResponse } from './helpers';
import { Store } from '@/store';
import { ignoreSchema } from '@/schemas';
import { action } from 'mobx';


/**
 * Create a new partner in the backend.
 *
 * @param store global mobx store
 * @param partnerId id of the partner
 * @param name name of the partner
 * @param description description of the partner
 */
export async function createPartner(
    store: Store,
    partnerId: string,
    name: string,
    description: string,
): Promise<RequestResult<unknown>> {

    const body = {
        partnerId,
        name,
        description,
    };
    return postJSONStdMasResponse(store, '/ac/partner', body, ignoreSchema);
}

/**
 * Update a partner in the backend.
 *
 * @param store global mobx store
 * @param partnerId id of the partner
 * @param name name of the partner
 * @param description description of the partner
 */
export async function updatePartnerInfo(
    store: Store,
    partnerId: string,
    name: string,
    description: string,
): Promise<RequestResult<unknown>> {

    const body = {
        partnerId,
        name,
        description,
    };
    const res = await putJSONStdMasResponse(store, `/ac/partner/${partnerId}`, body, ignoreSchema);
    if (res.success) {
        const storePartner = store.domain.partners.map.get(partnerId);
        if (storePartner) {
            action(() => {
                if (!storePartner.props.isPartial) {
                    storePartner.props.name = name;
                    storePartner.props.description = description;
                }
            })();
        }
    }
    return res;
}

/**
 * Link a user to a partner.
 *
 * @param store global mobx store
 * @param partnerId id of the partner
 * @param userId id of the user to link
 */
export async function assignUserToPartner(
    store: Store,
    partnerId: string,
    userId: string,
): Promise<RequestResult<unknown>> {

    return postJSONStdMasResponse(store, `/ac/partner/${partnerId}/user/${userId}`, '', ignoreSchema);
}

/**
 * Unlink a user from partner.
 */
export async function removeUserFromPartner(
    store: Store,
    partnerId: string,
    userId: string,
): Promise<RequestResult<unknown>> {

    return deleteStdMasResponse(store, `/ac/partner/${partnerId}/user/${userId}`, ignoreSchema);
}