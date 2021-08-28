import * as React from 'react';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { useHistory, Link, useRouteMatch, Switch, Route } from 'react-router-dom';
import { Store } from '@/store';
import { NodeState } from '@/store/domain/nodes';
import { useStore } from '@/hooks/useStore';
import { HealthOverview } from '../HealthOverview';
import { CollapsibleProperties } from '../CollapsibleProperties';
import { ActionModal, Spinner, Separator } from '@/components/core';
import { powerShutdown, powerRestart } from '@/actions';
import { useNode } from '@/hooks/useNode';
import { MeshDeviceErrorsHandler } from '@/components/core/Errors';
import { Stats } from '../Stats';
import { Padding } from '../Mesh/Padding';
import { NodeManager } from '@/components/NodeManager';


// tslint:disable-next-line: variable-name
export const DeviceOverview: FC<Props> = observer(({ unitSerial }) => {

    const store = useStore();
    const { path, url } = useRouteMatch();
    const history = useHistory();
    const { node, esNode, error } = useNode(unitSerial);
    const [nodeManagerOpen, setNodeManagerOpen] = React.useState(false);

    if (!esNode) {
        if (error) {
            return <Padding><MeshDeviceErrorsHandler error={error} /></Padding>;
        }
        return <Spinner />;
    }

    const health = store.derived.health.getNodeHealthStatus(node, esNode);
    const canRestartDevice = node?.props.isConnected;

    return <>
        <div className="p-15 lg:p-35 pt-10 lg:pt-20 pb-20 lg:pb-25">
            <HealthOverview unitSerial={esNode.id} health={health} error={esNode.error} progress={esNode.progress} />
            {node ? <>
                <hr />
                <CollapsibleProperties properties={[
                    { name: 'Role', value: node.props.isManager ? 'Gateway VeeaHub' : 'Mesh VeeaHub' },
                    { name: 'Unit Serial', value: node.id },
                    { name: 'Address', value: node.props.address || `Not Available` },
                    { name: 'Host Name', value: node.props.hostname },
                ]} />

                {node.props.isManager && <>
                    <Separator sticky>Stats</Separator>
                    <Stats men={esNode} entityName={esNode.name} />
                </>}

                <hr />
                <a style={{ cursor: 'pointer' }} className="icon-link"
                    onClick={(ev) => (ev.preventDefault(), setNodeManagerOpen(true))}
                >
                    <i className="fas fa-tools" />
                    Open Node Manager
                </a>
                <NodeManager open={nodeManagerOpen} onClose={() => setNodeManagerOpen(false)} node={node} />

                <hr />
                <Link className={`icon-link${canRestartDevice ? '' : ' disabled'}`} to={`${url}/shutdown-or-reboot`}>
                    <i className="fas fa-power-off" />
                    Shutdown / Restart VeeaHub
                </Link>
                <Switch>
                    <Route exact path={`${path}/reboot`}>
                        <RebootModal store={store} open={true} onClose={() => history.push(url)} node={node} />
                    </Route>
                    <Route exact path={`${path}/shutdown-or-reboot`}>
                        <RebootShutdownModal store={store} open={true} onClose={() => history.push(url)} node={node} />
                    </Route>
                </Switch>
            </> : null}
        </div>
    </>;
});

interface Props {
    unitSerial: string
}

// tslint:disable-next-line: variable-name
const RebootShutdownModal: FC<LocalModalProps> = ({ store, open, onClose, node }) => (
    <ActionModal extended centered open={open} onClose={onClose}
        actions={[
            {
                text: 'Shutdown VeeaHub',
                run: async () => {
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
                },
                type: 'primary' as const,
            },
            {
                text: 'Restart VeeaHub',
                run: async () => {
                    const res = await powerRestart(store, node);
                    if (res.success) {
                        return { success: true,
                                summary: 'The VeeaHub was successfully restarted',
                                description: 'It might take a few minutes for the change to be visible' };
                    } else {
                        return { success: false,
                                summary: 'Unable to restart the VeeaHub. Please try again later',
                                description: `There was an error ${res.message}` };
                    }
                },
                type: 'primary' as const,
            },
        ]}
    >
        <h1><b>Shutdown / Restart VeeaHub</b></h1>
        <hr />
        <h2 className="mb-10">Are you sure you want to shutdown or restart this VeeaHub ?</h2>
    </ActionModal>
);

interface LocalModalProps {
    open: boolean
    store: Store
    onClose(): void
    node: NodeState
}

// tslint:disable-next-line: variable-name
const RebootModal: FC<LocalModalProps> = ({ store, open, onClose, node }) => (
    <ActionModal extended centered open={open} onClose={onClose}
        actions={[
            {
                text: 'Reboot',
                run: async () => {
                    const res = await powerRestart(store, node);
                    if (res.success) {
                        return { success: true,
                                summary: 'The VeeaHub was successfully restarted',
                                description: 'It might take a few minutes for the change to be visible' };
                    } else {
                        return { success: false,
                                summary: 'Unable to restart the VeeaHub. Please try again later',
                                description: `There was an error ${res.message}` };
                    }
                },
                type: 'primary' as const,
            },
        ]}
    >
        <h1><b>Action required: Reboot</b></h1>
        <hr />
        <h2 className="mb-10">
            Your VeeaHub needs to be rebooted, so that your changes take effect.<br />
            Are you sure you want to restart this VeeaHub now ?
        </h2>
    </ActionModal>
);