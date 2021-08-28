import { observable } from 'mobx';


export interface ApplicationUploadState {
    state: number | null
    name: string | null
    uploadError: UploadError
    humanReadableStatusMessage: string | null
    uploadStage: UploadStage
    uploadProgress: number
    setGenericError(message: string): void;
}

export type UploadError = GenericError | AppValidationError | null;

interface GenericError {
    kind: 'generic'
    text: string
}

interface AppValidationError {
    kind: 'app-validation'
    fileName: string
}

export enum ApplicationUploadStates {
    NOT_FOUND = -2,
    ERR_UNKNOWN = -1,
    INIT = 0,
    UNPACK_RELEASE = 1,
    VALIDATE_RELEASE = 2,
    GENERATE_RECEIPT = 3,
    READY = 4,
    DONE = 5,
}

export const createApplicationUpload = () => observable<ApplicationUploadState>({
    state: null,
    name: null,
    uploadError: null,
    uploadStage: UploadStage.Idle,
    uploadProgress: 0,
    setGenericError(text: string) {
        this.uploadError = {
            kind: 'generic',
            text,
        };
    },
    get humanReadableStatusMessage() {
        if (this.state) {
            const uploadStatus = ApplicationUploadStateMessages[
                ApplicationUploadStates[this.state] as keyof typeof ApplicationUploadStateMessages
            ];
            return uploadStatus;
        }
        return null;
    },
});

// Feel free to suggest changes to the language.
// I just made these up off the top of my head.
export enum UploadStage {
    Idle = '',
    UploadingBinary = 'Uploading application binary file',
    PollingReceipt = 'Polling for receipt file',
    DownloadingReceipt = 'Downloading receipt file',
    SavingMetadata = 'Saving application metadata',
    UploadingReceipt = 'Uploading receipt file',
    ProcessComplete = 'Process complete',
}

// FYI I made up the human readable messaging just based on what the flags seem to do
// There's no single source of truth yet for the descriptions of states in CM
// Maybe should be in Adam's repo?
enum ApplicationUploadStateMessages {
    NOT_FOUND = 'Application binary not found',
    ERR_UNKNOWN = 'An unknown error occurred',
    INIT = 'Application upload initializing',
    UNPACK_RELEASE = 'Unpacking and releasing application',
    VALIDATE_RELEASE = 'Validating release of application',
    GENERATE_RECEIPT = 'Generating receipt file',
    READY = 'Receipt file is ready',
    DONE = 'Application upload complete',
}