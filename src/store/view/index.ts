import { createActiveuser, ActiveUserState } from './activeuser';
import { createErrors, ErrorsState } from './errors';
import { createFeaturePreview, FeaturePreviewState } from './feature-preview';
import { createDeviceEvents, DeviceEventsState } from './events';
import { createDebugOptions, DebugOptionsState } from './debug-options';
import { ApplicationUploadState, createApplicationUpload } from './application-upload';
import { createRealmDetails, RealmDetailsState } from './realm';
import { createVtpnOrderForm, VtpnOrderFormState } from './vtpn-order-form';
import { createSelectedGroupState, SelectedGroupState } from './selected-group';
import { createRequestsLocks, RequestsLocksState } from './requests-lock';


export interface ViewStore {
    /**
     * Information about the current logged in user.
     */
    activeuser: ActiveUserState
    /**
     * Cached value of the selected group (the URL should always be used if possible)
     * This value might be incorrect in certain frames. It's purpose is to be used
     * when the selected group does not appear in the URL.
     * If the value is empty and you need a group id, you can use `store.view.activeuser.defaultGroup`.
     */
    selectedGroup: SelectedGroupState
    /**
     * Errors collected by actions so far.
     * @deprecated
     */
    errors: ErrorsState
    /**
     * This is a map of beta feature names to a boolean.
     * If an entry is present the value says whether or not
     * a beta feature is enabled for the user for preview.
     */
    featurePreview: FeaturePreviewState
    /**
     * DeviceEventsState stores the query filters and event logs for a device's events
     */
    deviceEvents: DeviceEventsState
    /**
     * DebugOptionsState stores debugging options
     */
    debugOptions: DebugOptionsState
    /**
     * Contains information related to the status of partner application uploads
     */
    applicationUpload: ApplicationUploadState
    /**
     * Contains information related to the current user's realm
     */
    realm: RealmDetailsState
    /**
     * vTPN order form related state, such as addresses
     */
    vtpnOrderForm: VtpnOrderFormState
    /**
     * Locks for requests that can't be sent concurrently
     * (to simplify the UI)
     */
    requests: RequestsLocksState
}

export function createView(): ViewStore {

    const activeuser = createActiveuser();
    const errors = createErrors();
    const featurePreview = createFeaturePreview();
    const deviceEvents = createDeviceEvents();
    const debugOptions = createDebugOptions();
    const applicationUpload = createApplicationUpload();
    const realm = createRealmDetails();
    const vtpnOrderForm = createVtpnOrderForm();
    const selectedGroup = createSelectedGroupState();
    const requests = createRequestsLocks();

    return {
        activeuser,
        errors,
        featurePreview,
        deviceEvents,
        debugOptions,
        applicationUpload,
        realm,
        vtpnOrderForm,
        selectedGroup,
        requests,
    };
}