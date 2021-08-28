import React, { FC } from 'react';
import { Toggle } from '@/components/core';
import { Separator } from '@/components/core';
import { DebugOptionFlags } from '@/store/view/debug-options';
import { toggleDebugOption } from '@/actions/debug_options';
import { useStore } from '@/hooks/useStore';
import { observer } from 'mobx-react-lite';


// tslint:disable-next-line: variable-name
export const Toggles: FC<{}> = observer(() => {
    const store = useStore();
    const [pendingReq, setPendingReq] = React.useState(false);

    // this makes sure changes to these values in the store cause a re-render
    const {
        disablePkgSerialChecking,
        allowPkgSubscIfUpdatesAvailable,
        allowJSONSchemaFormPreview,
        showTrialVtpnSubscriptions,
    } = store.view.debugOptions;

    function onToggle(flag: DebugOptionFlags) {
        return async () => {
            setPendingReq(true);
            const res = await toggleDebugOption(store, flag);

            if (!res.success) {
                console.error(res.message);
            }
            setPendingReq(false);
        };
    }

    return <>
        <Separator sticky>
            Options
        </Separator>
        <Toggle
            disabled={pendingReq}
            value={disablePkgSerialChecking}
            onChange={onToggle(DebugOptionFlags.DisablePkgSerialChecking)}
        >
            Disable 4G Package Serial Checking
        </Toggle>

        <Toggle
            disabled={pendingReq}
            value={allowPkgSubscIfUpdatesAvailable}
            onChange={onToggle(DebugOptionFlags.AllowPkgSubscription)}
        >
            Allow package subscriptions even if software updates are available
        </Toggle>

        <Toggle
            disabled={pendingReq}
            value={allowJSONSchemaFormPreview}
            onChange={onToggle(DebugOptionFlags.AllowJSONSchemaFormPreview)}
        >
            Display package config form data preview during subscription
        </Toggle>

        <Toggle
            disabled={pendingReq}
            value={showTrialVtpnSubscriptions}
            onChange={onToggle(DebugOptionFlags.ShowTrialVtpnSubscriptions)}
        >
            Display trial vTPN subscription cards and subscriptions tab
        </Toggle>
    </>;
});
