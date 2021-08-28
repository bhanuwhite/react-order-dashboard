import { postJSONStdMasResponse, RequestResult } from './helpers';
import { addToWhitelistResponse, removeFromWhitelistResponse } from '@/schemas/self-api';
import { Store } from '@/store';
import { action } from 'mobx';


export async function addToWhitelistUnits(store: Store, unitSerials: string[]): Promise<RequestResult<{}>> {
    const res = await postJSONStdMasResponse(store, '/subscriptions/whitelist', unitSerials, addToWhitelistResponse);

    if (!res.success) {
        return res;
    }

    const response = res.response;
    if (!response.success) {
        return response;
    }

    action(() => {
        unitSerials.forEach(unitSerial => store.domain.whitelisting.set(unitSerial, true));
    })();

    return { success: true, response: {} };
}

export async function removeFromWhitelistUnits(store: Store, unitSerials: string[]): Promise<RequestResult<{}>> {
    const res = await postJSONStdMasResponse(
        store,
        '/subscriptions/remove-whitelist',
        unitSerials,
        removeFromWhitelistResponse,
    );

    if (!res.success) {
        return res;
    }

    const response = res.response;
    if (!response.success) {
        return response;
    }

    action(() => {
        unitSerials.forEach(unitSerial => store.domain.whitelisting.set(unitSerial, false));
    })();

    return { success: true, response: {} };
}