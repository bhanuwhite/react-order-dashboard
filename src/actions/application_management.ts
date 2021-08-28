import { action } from 'mobx';
import { Store } from '@/store';
import {
    containerManagementTokenSchema,
    partnerApplicationResponse,
    ignoreSchema,
    applicationUploadStatusResponse,
} from '@/schemas';
import {
    getArrayBufferStdMasResponse,
    postJSONStdMasResponse,
    postMultipartFormDataMasResponse,
    patchJSONStdMasResponse,
    getJSONStdMasResponse,
} from './helpers';
import { UploadStage, ApplicationUploadStates, UploadError } from '@/store/view/application-upload';
import { POLL_INTERVAL_IN_SECONDS } from '@/components/CC/Administration/Applications/consts';
import { handleAddApplicationToStore } from '@/fetcher/endpoints/acs-endpoints';
import { waitForMs } from '@/utils/await-helpers';
import { seconds, GiB } from '@/utils/units';
import { HttpError, StructuredError } from '@/utils/exceptions';


/**
 * Create a new application or a new version of an application.
 * This handle all the logic to create the application.
 *
 * @param store progress is observable in store.view.applicationUpload
 * @param partnerId id of the partner
 * @param applicationMetadata metadata of the app
 */
export async function createApplication(
    store: Store,
    partnerId: string,
    applicationMetadata: ApplicationMetadata,
    file: File | undefined,
) {

    if (store.view.applicationUpload.uploadStage !== UploadStage.Idle) {
        action(() => {
            store.view.applicationUpload.setGenericError('An application is already being uploaded. Please try again later.');
        })();
        return;
    }

    if (!verifyFileRequirements(store, file)) {
        return;
    }

    function beforeUnload(ev: BeforeUnloadEvent) {
        ev.preventDefault();
        ev.returnValue = '';
    }

    // Ask user confirmation before they close the window.
    window.addEventListener('beforeunload', beforeUnload);

    try {
        action(() => {
            store.view.applicationUpload.uploadProgress = 0 * 100 / 5;
            store.view.applicationUpload.uploadStage = UploadStage.SavingMetadata;
        })();

        const appId = (await createApplicationMetadata(store, partnerId, applicationMetadata)).id;

        action(() => {
            store.view.applicationUpload.uploadProgress = 1 * 100 / 5;
            store.view.applicationUpload.uploadStage = UploadStage.UploadingBinary;
        })();

        const token = await uploadApplicationBinary(store, file);

        action(() => {
            store.view.applicationUpload.uploadProgress = 2 * 100 / 5;
            store.view.applicationUpload.uploadStage = UploadStage.PollingReceipt;
        })();

        await pollUploadStatus(store, file, token);

        action(() => {
            store.view.applicationUpload.uploadProgress = 3 * 100 / 5;
            store.view.applicationUpload.uploadStage = UploadStage.DownloadingReceipt;
        })();

        const res = await downloadReceiptFile(store, token);

        action(() => {
            store.view.applicationUpload.uploadProgress = 4 * 100 / 5;
            store.view.applicationUpload.uploadStage = UploadStage.UploadingReceipt;
        })();

        const receiptFile = new File([ res ], file.name, { type: 'application/gzip' });
        await uploadReceiptFile(store, partnerId, appId, receiptFile);

        action(() => {
            store.view.applicationUpload.uploadProgress = 5 * 100 / 5;
            store.view.applicationUpload.uploadStage = UploadStage.ProcessComplete;
        })();


    } catch (e) {
        handleAppException(store, e);
    } finally {

        // Remove the confirmation before the user navigate away
        window.removeEventListener('beforeunload', beforeUnload);
    }
}

/**
 * An application submission is missing the payload.
 * Submit the payload for that app.
 *
 * @param store progress is observable in store.view.applicationUpload
 * @param partnerId id of the partner
 * @param applicationMetadata metadata of the app
 */
export async function submitApplicationPayload(
    store: Store,
    partnerId: string,
    applicationId: string,
    file: File | undefined,
    updatedApplicationMetadata: ApplicationMetadata | undefined,
) {
    if (store.view.applicationUpload.uploadStage !== UploadStage.Idle) {
        action(() => {
            store.view.applicationUpload.setGenericError('An application is already being uploaded. Please try again later.');
        })();
        return;
    }

    if (!verifyFileRequirements(store, file)) {
        return;
    }

    function beforeUnload(ev: BeforeUnloadEvent) {
        ev.preventDefault();
        ev.returnValue = '';
    }

    // Ask user confirmation before they close the window.
    window.addEventListener('beforeunload', beforeUnload);

    try {

        const stepCount = updatedApplicationMetadata ? 5 : 4;
        let currentStep = 0;

        if (updatedApplicationMetadata) {
            action(() => {
                store.view.applicationUpload.uploadProgress = (currentStep++) * 100 / stepCount;
                store.view.applicationUpload.uploadStage = UploadStage.SavingMetadata;
            })();

            await updateApplicationMetadata(store, partnerId, applicationId, updatedApplicationMetadata);
        }

        action(() => {
            store.view.applicationUpload.uploadProgress = (currentStep++) * 100 / stepCount;
            store.view.applicationUpload.uploadStage = UploadStage.UploadingBinary;
        })();

        const token = await uploadApplicationBinary(store, file);

        action(() => {
            store.view.applicationUpload.uploadProgress = (currentStep++) * 100 / stepCount;
            store.view.applicationUpload.uploadStage = UploadStage.PollingReceipt;
        })();

        await pollUploadStatus(store, file, token);

        action(() => {
            store.view.applicationUpload.uploadProgress = (currentStep++) * 100 / stepCount;
            store.view.applicationUpload.uploadStage = UploadStage.DownloadingReceipt;
        })();

        const res = await downloadReceiptFile(store, token);

        action(() => {
            store.view.applicationUpload.uploadProgress = (currentStep++) * 100 / stepCount;
            store.view.applicationUpload.uploadStage = UploadStage.UploadingReceipt;
        })();

        const receiptFile = new File([ res ], file.name, { type: 'application/gzip' });
        await uploadReceiptFile(store, partnerId, applicationId, receiptFile);

        action(() => {
            store.view.applicationUpload.uploadProgress = (currentStep++) * 100 / stepCount;
            store.view.applicationUpload.uploadStage = UploadStage.ProcessComplete;
        })();


    } catch (e) {
        handleAppException(store, e);
    } finally {

        // Remove the confirmation before the user navigate away
        window.removeEventListener('beforeunload', beforeUnload);
    }
}

/**
 * Handle the different type of exception and mutate the store accordingly.
 * @param store store to mutate
 * @param e exception that was raised
 */
function handleAppException(store: Store, e: Error) {
    action(() => {
        if (e instanceof StructuredError) {
            store.view.applicationUpload.uploadError = e.value;
        } else {
            const mesg = e instanceof Error ? e.message : `${e}`;
            store.view.applicationUpload.setGenericError(mesg);
        }
    })();
}

/**
 * Verify that the file satisfies the requirement before submitting the app.
 * @param store mobx store
 * @param file file handle to verify
 */
function verifyFileRequirements(store: Store, file: File | undefined): file is File {

    if (!file) {
        action(() => {
            store.view.applicationUpload.setGenericError('Please select an application binary file to upload');
        })();
        return false;
    }

    if (file.size > GiB(2)) {
        action(() => {
            store.view.applicationUpload.setGenericError('Application can\'t be larger than 2GiB');
        })();
        return false;
    }

    return true;
}

/**
 * Reset the application state to allow uploading a new app.
 * @param store global store
 */
export function resetApplicationState(store: Store) {

    action(() => {
        store.view.applicationUpload.uploadProgress = 0;
        store.view.applicationUpload.uploadStage = UploadStage.Idle;
        store.view.applicationUpload.uploadError = null;
        store.view.applicationUpload.state = null;
        store.view.applicationUpload.name = null;
    })();
}

/**
 * Create a new application in ACS
 * @param store
 * @param partnerId
 * @param applicationMetadata
 */
async function createApplicationMetadata(
    store: Store,
    partnerId: string,
    applicationMetadata: ApplicationMetadata,
): Promise<{ id: string }> {

    const endpoint = `/ac/partner/${partnerId}/package`;
    const res = await postJSONStdMasResponse(store, endpoint, applicationMetadata, partnerApplicationResponse);

    if (res.success) {
        return res.response;
    } else {
        throw new Error(res.message);
    }
}

/**
 * Edit an existing application's metadata in ACS
 * @param store
 * @param partnerId
 * @param applicationId
 * @param applicationMetadata
 */
export async function updateApplicationMetadata(
    store: Store,
    partnerId: string,
    applicationId: string,
    applicationMetadata: ApplicationMetadata,
): Promise<{ id: string }> {

    const endpoint = `/ac/partner/${partnerId}/package/${applicationId}`;
    const res = await patchJSONStdMasResponse(store, endpoint, applicationMetadata, partnerApplicationResponse);

    if (res.success) {

        const application = res.response;
        handleAddApplicationToStore(store, partnerId, {
            ...application,
            features: application.features.filterNullable(),
        });

        return res.response;
    } else {
        throw new Error(res.message);
    }
}

/**
 * Upload application receipt file to ACS
 * @param store
 * @param partnerId
 * @param applicationId
 * @param receiptFile
 */
async function uploadReceiptFile(
    store: Store,
    partnerId: string,
    applicationId: string,
    receiptFile: File,
): Promise<unknown> {

    const endpoint = `/ac/partner/${partnerId}/package/${applicationId}/container`;

    const formData = new FormData();
    formData.append('file', receiptFile);

    const res = await postMultipartFormDataMasResponse(
        store,
        endpoint,
        formData,
        ignoreSchema,
    );

    if (res.success) {
        return res.response;
    } else {
        throw new Error(res.message);
    }
}

/**
 * Upload application binary file to the container management service
 * @param store
 * @param applicationBinary
 */
async function uploadApplicationBinary(
    store: Store,
    applicationBinary: File,
): Promise<string> {

    const endpoint = `/cm/containers`;

    const formData = new FormData();
    formData.append('request', applicationBinary);

    const res = await postMultipartFormDataMasResponse(
        store,
        endpoint,
        formData,
        containerManagementTokenSchema,
        {},
        'text',
    );

    if (res.success) {
        return res.response;
    } else {
        throw new Error(res.message);
    }
}

/**
 * Download application receipt file from the container management service
 * @param store
 * @param token
 */
async function downloadReceiptFile(store: Store, token: string | null) {

    const endpoint = `/cm/containers/${token}/receipt`;
    const res = await getArrayBufferStdMasResponse(store, endpoint);

    if (res.success) {
        return res.response.raw;
    } else {
        throw new Error(res.message);
    }
}

/**
 * Poll for the upload status.
 * @param store mobx store
 * @param token token to use for the container management service.
 */
async function pollUploadStatus(store: Store, file: File, token: string) {

    // Start fetching for the status using a polling mechanism
    // We don't use the fetcher for this because it's tied to
    // the createApplication action.
    while (true) {
        try {
            await waitForMs(seconds(POLL_INTERVAL_IN_SECONDS));
            const { state, name } = await getUploadStatus(store, token);

            action(() => {
                store.view.applicationUpload.state = state;
                store.view.applicationUpload.name = name;
            })();

            if (state === ApplicationUploadStates.READY || state === ApplicationUploadStates.DONE) {
                break;
            }

        } catch (err) {
            console.error(err);
            if (err instanceof HttpError) {

                // FIXME:
                // There is a JIRA for this in the container management service (not sure of ticket number)
                // the `/status` endpoint will always return 504 while the application binary is processing
                // once it is done you will get 200 with the proper response
                // In effect the states INIT, UNPACK_RELEASE, VALIDATE_RELEASE, GENERATE_RECEIPT
                // will never be applied by control center because we just get 504 timeout
                if (err.status === 504) {
                    continue;
                }

                // 404 means there was an error during the validation of the application payload.
                // They can verify locally the application using the VeeaHubs tools
                if (err.status === 404 || err.status === 417) {
                    throw new StructuredError<UploadError>(
                        {
                            kind: 'app-validation',
                            fileName: file.name,
                        },
                        `Application has some errors. It can be verified by running 'vhc app --verify "${file.name}.tgz"'`,
                    );
                }
                throw new Error(
                    `Container management service returned ${err.status}. We can't finish the upload process.`,
                );
            } else {
                // Forward schema errors (and other bugs) to the UI
                throw err;
            }
        }
    }
}

async function getUploadStatus(store: Store, token: string) {

    const endpoint = `/cm/containers/${token}/status`;
    const res = await getJSONStdMasResponse(store, endpoint, applicationUploadStatusResponse);

    if (res.success) {
        return res.response;
    } else {
        if (res.status) {
            throw new HttpError(res.status, res.message);
        }
        throw new Error(res.message);
    }
}

export interface ApplicationMetadata {
    firstVersion: boolean
    title: string
    description: string
    learnMore: string
    active: boolean
    features: string[]
    packageConfigDataSchema: null | string
    aclId: number | null
    version: string
    persistentUuids: string[] | null
}