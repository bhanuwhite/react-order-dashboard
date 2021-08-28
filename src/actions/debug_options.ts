import { toggleDebugOptionsResponse } from '@/schemas/self-api';
import { Store } from '@/store';
import { DebugOptionFlags } from '@/store/view/debug-options';
import { action } from 'mobx';
import { postJSONStdMasResponse, RequestResult } from './helpers';

/**
 * Handles debug option toggle state change to be send to backend.
 * @param store
 * @param flags
 */
export async function toggleDebugOption(store: Store, flags: DebugOptionFlags): Promise<RequestResult<{}>> {
    const endpoint = '/account/debug-options';
    const debugOptionsFlagName = getDebugOptionsFlagName(flags);

    if (debugOptionsFlagName === null) {
        return {success: false, message: 'Invalid toggle enum'};
    }

    const res = await postJSONStdMasResponse(
        store,
        endpoint,
        {
            ...store.view.debugOptions,
            [debugOptionsFlagName]: !store.view.debugOptions[debugOptionsFlagName],
        },
        toggleDebugOptionsResponse,
    );

    if (!res.success) {
        return res;
    }

    const response = res.response;
    if (!response.success) {
        return response;
    }

    action(() => {
        store.view.debugOptions[debugOptionsFlagName] = !store.view.debugOptions[debugOptionsFlagName];
    })();

    return { success: true, response: {} };
}

function getDebugOptionsFlagName(flags: DebugOptionFlags) {
    switch ( flags ) {
        case DebugOptionFlags.DisablePkgSerialChecking:
            return 'disablePkgSerialChecking';
        case DebugOptionFlags.AllowPkgSubscription:
            return 'allowPkgSubscIfUpdatesAvailable';
        case DebugOptionFlags.AllowJSONSchemaFormPreview:
            return 'allowJSONSchemaFormPreview';
        case DebugOptionFlags.ShowTrialVtpnSubscriptions:
            return 'showTrialVtpnSubscriptions';
        default:
            return null;
    }
}
