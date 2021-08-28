import * as React from 'react';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Modal, Button } from '../../core';
import { Failure, Success, useAction } from '@/hooks/useAction';
import { useStore } from '@/hooks/useStore';
import { powerShutdown, powerRestart } from '@/actions';
import { NodeState } from '@/store/domain/nodes';


// tslint:disable-next-line: variable-name
export const PowerOptions: FC<Props> = observer(({ node, open, onClose }) => {

    const store = useStore();
    const { step: powerOffStep, exec: powerOffExec, reset: resetPowerOffAction } = useAction(async () => {
        if (!node) {
            throw new Error('Unable to perform action on undefined node');
        }
        const res = await powerShutdown(store, node);
        if (res.success) {
            return { success: true,
                    summary: 'Successfully shutdown your VeeaHub',
                    description: 'It might take a few minutes for the change to take effect' };
        } else {
            return { success: false,
                    summary: 'Failed to shutdown your VeeaHub',
                    description: `There was an error ${res.message}` };
        }
    }, [ node ]);

    const { step: powerRestartStep, exec: powerRestartExec, reset: resetPowerRestartAction } = useAction(async () => {
        if (!node) {
            throw new Error('Unable to perform action on undefined node');
        }
        const res = await powerRestart(store, node);
        if (res.success) {
            return { success: true,
                    summary: 'The VeeaHub was successfully restarted',
                    description: 'It might take a few minutes for the change to be visible' };
        } else {
            return { success: false,
                    summary: 'Unable to restart the VeeaHub',
                    description: `Please try again later. There was an error ${res.message}` };
        }
    }, [ node ]);

    React.useEffect(() => {
        if (open) {
            resetPowerOffAction();
            resetPowerRestartAction();
        }
    }, [ open ]);

    // Render result if shutdown request has finished.
    if (powerOffStep.kind === 'failure' || powerOffStep.kind === 'success') {
        return finalResult({ open, onClose, res: powerOffStep });
    }

    // Render result if restart request has finished.
    if (powerRestartStep.kind === 'failure' || powerRestartStep.kind === 'success') {
        return finalResult({ open, onClose, res: powerRestartStep });
    }

    const disabled = powerOffStep.kind === 'loading' || powerRestartStep.kind === 'loading';

    return <Modal open={open} onClose={onClose}
        header={
            <h1 className="text-lg font-bold">Power Options</h1>
        }
        className="p-8"
    >
        <div>Selecting any of these options might cause connectivity or data loss</div>
        <div className="h-px bg-gray-300 w-full my-4" />
        <Option onClick={powerRestartExec} disabled={disabled}
            title="Restart"
            description="Perform a reboot on this VeeaHub. This might take up to 10 minutes."
            action="Restart this VeeaHub"
        />
        <div className="h-px bg-gray-300 w-full my-4" />
        <Option
            title="Recovery"
            description={RECOVERY_DESCRIPTION}
            action="Perform Recovery Reset"
        />
        <div className="h-px bg-gray-300 w-full my-4" />
        <Option onClick={powerOffExec} disabled={disabled}
            title="Shutdown"
            description="Turn off this VeeaHub."
            action="Shutdown this VeeaHub"
        />
        <Button className="w-full mt-10" onClick={onClose}>Cancel</Button>
    </Modal>;
});

interface Props {
    node: NodeState | undefined
    open: boolean
    onClose: () => void
}

// tslint:disable-next-line: variable-name
const Option: FC<{ title: string, description: string, action: string, disabled?: boolean, onClick?: () => void }> = ({
    title,
    description,
    action,
    disabled,
    onClick,
}) => (
    <div className="flex items-start">
        <div className="pr-4"><i className="fas fa-sync-alt" /></div>
        <div>
            <h2 className="font-medium">{title}</h2>
            <p className="text-gray-400">{description}</p>
            <button disabled={disabled} onClick={onClick}
                className="font-medium text-red-600 hover:underline focus-visible:outline-black disabled:text-red-600/50 disabled:hover:no-underline"
            >
                {action}
            </button>
        </div>
    </div>
);

const RECOVERY_DESCRIPTION = `
Wipes all data off the VeeaHub and re-installs the software. Any local
changes made to the device before the last cloud sync will be lost.
Only use if you are experiencing problems.
`;

function finalResult(
    { open, res, onClose }:
    { open: boolean, onClose: () => void, res: Success | Failure },
) {

    return <Modal open={open} onClose={onClose} className="p-8">
        <div className="flex flex-col items-center justify py-12">
            <div className="mb-4">
                {res.kind === 'success' ?
                    <i className="fas fa-check-circle text-good text-5xl" /> :
                    <i className="fas fa-times-circle text-bad text-5xl" />
                }
            </div>
            <h2 className="font-bold">{res.summary}</h2>
            {res.description && <p className="mt-3 text-gray-600">
                {res.description}
            </p>}
        </div>
        <Button className="w-full mt-10" onClick={onClose}>Done</Button>
    </Modal>;
}