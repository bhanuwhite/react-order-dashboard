import { patchJSONStdMasResponse, RequestResult } from './helpers';
import { patchedSubscriptionResponse } from '@/schemas/self-api';
import { Store } from '@/store';
import { updateOneEntry } from '@/fetcher/endpoints/helpers';

/**
 * Mark a subscription for cancellation at the end of the payment period
 * @param subscriptionIds ids of the subscriptions to cancel
 */
export async function cancelSubscription(
    store: Store,
    subscriptionIds: string[],
): Promise<RequestResult<unknown>> {
    const endpoint = `/subscriptions/${subscriptionIds.join(',')}`;

    const patch = { cancel_at_period_end: true };
    const res = await patchJSONStdMasResponse(store, endpoint, patch, patchedSubscriptionResponse);

    if (!res.success) {
        return res;
    }

    if (!res.response.success) {
        return res.response;
    }

    const { subscriptions } = res.response.response;
    for (const sub of subscriptions) {
        updateOneEntry(store.domain.account.stripeSubscriptions.map, sub);
    }

    return res.response;
}

/**
 * Make active a subscription pending cancellation at the end of the payment period
 * @param subscriptionIds ids of the subscriptions to cancel
 */
export async function resumeSubscription(
    store: Store,
    subscriptionIds: string[],
): Promise<RequestResult<unknown>> {
    const endpoint = `/subscriptions/${subscriptionIds.join(',')}`;

    const patch = { cancel_at_period_end: false };
    const res = await patchJSONStdMasResponse(store, endpoint, patch, patchedSubscriptionResponse);

    if (!res.success) {
        return res;
    }

    if (!res.response.success) {
        return res.response;
    }

    const { subscriptions } = res.response.response;
    for (const sub of subscriptions) {
        updateOneEntry(store.domain.account.stripeSubscriptions.map, sub);
    }

    return res.response;
}