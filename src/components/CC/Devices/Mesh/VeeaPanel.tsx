import * as React from 'react';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { Link, Switch, Route, useRouteMatch, useHistory } from 'react-router-dom';
import { Separator, ActionModal, Toggle, ExternalLinkButton } from '@/components/core';
import { MeshDeviceErrorsHandler } from '@/components/core/Errors';
import { unenrollMesh, addToWhitelistUnits, removeFromWhitelistUnits } from '@/actions';
import { Store } from '@/store';
import type { VmeshState } from '@/store/domain/vmeshes';
import type { EnrollmentMeshState } from '@/store/domain/enrollment';
import { useAreWhitelistedFetcher } from '@/hooks/fetchers';
import { Padding } from './Padding';
import * as style from './MeshOverview.module.scss';


// tslint:disable-next-line: variable-name
export const VeeaPanel: FC<Props> = observer(({ mesh, esData }) => {

    const store = useStore();
    const { path, url } = useRouteMatch();
    const history = useHistory();
    const deviceIds = [...esData.devices.values()].map(d => d.id);
    const { loading, error } = useAreWhitelistedFetcher(deviceIds);
    const [pendingReq, setPendingReq] = React.useState(false);

    async function onToggleWhitelist() {
        setPendingReq(true);
        const nodes = [...esData.devices.values()].map(d => d.id);
        const res = whitelisted ?
            await removeFromWhitelistUnits(store, nodes) :
            await addToWhitelistUnits(store, nodes);

        if (!res.success) {
            // Oops this failed.
            console.error(res.message);
        }
        setPendingReq(false);
    }

    // Check whether MEN is whitelisted
    const whitelisted = store.domain.whitelisting.get(esData.id);
    // Check whether the rest of the devices are whitelisted
    const nodesNotInWhitelist: string[] = deviceIds
        .filter(d => d !== esData.id)
        .reduce((res: string[], d) => {
            if (!store.domain.whitelisting.get(d)) {
                res.push(d);
            }

            return res;
        }, []);

    const whitelistedWarning = <div className={style.whitelistedWarning}>
        {nodesNotInWhitelist.length > 1 &&
            <span>Warning! VeeaHubs {nodesNotInWhitelist.join(', ')} are not yet whitelisted.</span>}
        {nodesNotInWhitelist.length === 1 &&
            <span>Warning! VeeaHub {nodesNotInWhitelist.join('')} is not yet whitelisted</span>}
            <ExternalLinkButton href="/#/cc/debug-options">Whitelist VeeaHubs</ExternalLinkButton>
    </div>;

    if (store.view.activeuser.adminRights) {
        return <div className="lg:m-5 p-10 lg:p-30 pt-10 bkg-light-yellow">
            <Separator bkgClassName="bkg-light-yellow" className="mt-0"
                description="This section is restricted to Veea personnel only - proceed with caution."
                sticky
            >
                Available Admin Procedures
            </Separator>
            {error ?
                <Padding><MeshDeviceErrorsHandler error={error} /></Padding> :
                <>
                    {whitelisted && whitelistedWarning}
                    <Toggle disabled={loading || pendingReq} value={!!whitelisted} onChange={onToggleWhitelist}>
                        {!!whitelisted ? 'Whitelisted' : 'Not whitelisted'}
                    </Toggle>
                </>
            }
            <div className="p-10">
            <Link className="icon-link" to={`${url}/unenrollMesh`} >
                <i className="fas fa-trash" />
                Un-Enroll Mesh
            </Link>
            </div>
            {mesh ?
                <Switch>
                    <Route exact path={`${path}/unenrollMesh`}>
                        <UnenrollMeshModal
                            store={store}
                            open={true}
                            onClose={() => history.goBack()}
                            mesh={mesh}
                            ems={esData}
                        />
                    </Route>
                </Switch> :
                null
            }
        </div>;
    }

    return null;
});

interface Props {
    mesh?: VmeshState
    esData: EnrollmentMeshState
}

// tslint:disable-next-line: variable-name max-line-length
const UnenrollMeshModal: FC<{ store: Store, open: boolean, onClose(): void, mesh: VmeshState, ems: EnrollmentMeshState }> = ({ store, open, onClose, mesh, ems }) => (
    <ActionModal extended centered open={open} onClose={onClose}
        actions={[
            {
                text: 'Un-Enroll',
                run: async () => {
                    const res = await unenrollMesh(store, mesh.props.meshId.toString(), ems);
                    if (res.success) {
                        return { success: true,
                                summary: 'The mesh was successfully unenrolled',
                                description: 'All subscriptions have been cancelled and associated nodes have been erased' };
                    } else {
                        return { success: false,
                                summary: 'Unable to unenroll the mesh.  Please try again later',
                                description: `There was an error ${res.message}` };
                    }
                },
                type: 'primary' as const,
            },
        ]}
    >
        <h1><b>Un-Enroll VeeaHub Mesh</b></h1>
        <hr />
        <h2 style={{ marginBottom: '10px' }}>
            All VeeaHubs will be unenroled and any associated subscriptions will be cancelled.<br />
            Are you sure you want to proceed ?
        </h2>
    </ActionModal>
);