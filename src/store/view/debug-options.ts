import { observable } from 'mobx';

export enum DebugOptionFlags {
    DisablePkgSerialChecking,
    AllowPkgSubscription,
    AllowJSONSchemaFormPreview,
    ShowTrialVtpnSubscriptions,
}

export interface DebugOptionsState {
    disablePkgSerialChecking: boolean
    allowPkgSubscIfUpdatesAvailable: boolean
    allowJSONSchemaFormPreview: boolean
    showTrialVtpnSubscriptions: boolean
}

export const createDebugOptions = () => observable<DebugOptionsState>({
    disablePkgSerialChecking: window.ecUser?.debugOptions?.includes('disablePkgSerialChecking') ?? false,
    allowPkgSubscIfUpdatesAvailable: window.ecUser?.debugOptions?.includes('allowPkgSubscIfUpdatesAvailable') ?? false,
    allowJSONSchemaFormPreview: window.ecUser?.debugOptions?.includes('allowJSONSchemaFormPreview') ?? false,
    showTrialVtpnSubscriptions: window.ecUser?.debugOptions?.includes('showTrialVtpnSubscriptions') ?? false,
});
