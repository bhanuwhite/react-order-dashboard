import { action } from 'mobx';
import { Store } from '@/store';
import { postJSONStdMasResponse, RequestResult } from './helpers';
import { toggleFeaturePreviewResponse } from '@/schemas/self-api';
import { FeaturePreviewFlags } from '@/store/view/feature-preview';

// toggleFeaturePreview - toggle the state flag and update in backend database
export async function toggleFeaturePreview(store: Store, flag: FeaturePreviewFlags): Promise<RequestResult<{}>> {
    const featurePreviewFlagName = getFeaturePreviewFlagName(flag);

    if (featurePreviewFlagName === null) {
        return {success: false, message: 'Invalid toggle enum'};
    }

    const endpoint = '/account/feature-preview';
    const res = await postJSONStdMasResponse(
        store,
        endpoint,
        {
            ...store.view.featurePreview,
            [featurePreviewFlagName]: !store.view.featurePreview[featurePreviewFlagName],
        },
        toggleFeaturePreviewResponse,
    );

    if (!res.success) {
        return res;
    }

    const response = res.response;
    if (!response.success) {
        return response;
    }

    action(() => {
        store.view.featurePreview[featurePreviewFlagName] = !store.view.featurePreview[featurePreviewFlagName];
    })();

    return { success: true, response: {} };
}

function getFeaturePreviewFlagName(flag: FeaturePreviewFlags) {
    switch ( flag ) {
        case FeaturePreviewFlags.AlertSummary: {
            return 'alertSummary';
        }
        case FeaturePreviewFlags.ListFilters: {
            return 'listFilters';
        }
        default:
            return null;
    }
}
