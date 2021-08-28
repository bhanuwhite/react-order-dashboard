import { action } from 'mobx';
import { deleteStdMasResponse, postJSONStdMasResponse, patchJSONStdMasResponse, RequestResult } from './helpers';
import { paymentAddCardResponse, paymentDeleteCardResponse, paymentDefaultCardResponse } from '@/schemas/self-api';
import { Store } from '@/store';

/**
 * Remove the provided card.
 * @param id id of the card to remove
 */
export async function removeCard(
    store: Store,
    id: string,
): Promise<RequestResult<{}>> {
    const endpoint = `/account/payment/cards/${id}`;

    const res = await deleteStdMasResponse(store, endpoint, paymentDeleteCardResponse);

    if (!res.success) {
        return res;
    }

    if (!res.response.success) {
        return res.response;
    }

    const newDefaultSource = res.response.response.defaultSource ?? '';
    action(() => {
        store.domain.account.sources.map.delete(id);
        store.domain.account.sources.all.forEach(s => s.default = false);
        const newDefault = store.domain.account.sources.map.get(newDefaultSource);
        if (newDefault) {
            newDefault.default = true;
        }
    })();
    return res.response;
}

/**
 * Add a credit card.
 * @param token token provided by stripe.
 * @param makeDefault if true this card will be used as the default
 */
export async function addCard(
    store: Store,
    token: string,
    makeDefault: boolean,
): Promise<RequestResult<{}>> {
    const body = {
        token,
        makeDefault,
    };

    const endpoint = '/account/payment/cards/new';
    const res = await postJSONStdMasResponse(store, endpoint, body, paymentAddCardResponse);

    if (!res.success) {
        return { success: false as const, message: res.message };
    }
    if (!res.response.success) {
        return res.response;
    }

    const card = res.response.response;
    action(() => {
        if (makeDefault) {
            store.domain.account.sources.all.forEach(s => s.default = false);
        }
        store.domain.account.sources.map.set(card.id, card);
    })();

    return res.response;
}

/**
 * Assign the provided card as the default payment method.
 * @param cardId id of the new default card
 */
export async function assignDefaultCard(
    store: Store,
    cardId: string,
): Promise<RequestResult<{}>> {
    const endpoint = `/account/payment/customer`;

    const res = await patchJSONStdMasResponse(store, endpoint, {
        default_source: cardId,
    }, paymentDefaultCardResponse);

    if (!res.success) {
        return res;
    }

    if (!res.response.success) {
        return res.response;
    }

    const newDefaultSource = res.response.response.defaultSource;
    action(() => {
        store.domain.account.sources.all.forEach(s => s.default = false);
        const newDefault = store.domain.account.sources.map.get(newDefaultSource);
        if (newDefault) {
            newDefault.default = true;
        }
    })();
    return res.response;
}