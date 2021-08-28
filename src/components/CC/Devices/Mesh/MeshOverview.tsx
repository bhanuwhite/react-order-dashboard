import * as React from 'react';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import type { EnrollmentMeshState } from '@/store/domain/enrollment';
import { Button, Spinner, Separator } from '@/components/core';
import { useMeshAvailableUpdatesFetcher } from '@/hooks/fetchers';
import { MeshDeviceErrorsHandler } from '@/components/core/Errors';
import { useStore } from '@/hooks/useStore';
import * as style from './MeshOverview.module.scss';
import { HealthOverview } from '../HealthOverview';
import { CollapsibleProperties } from '../CollapsibleProperties';
import { SoftwareUpdateModal } from './SoftwareUpdateModal';
import { VeeaPanel } from './VeeaPanel';
import { useMesh } from '@/hooks/useMesh';
import { NotFoundBody } from '../../404';
import { Padding } from './Padding';
import { Stats } from '../Stats';
import { VmeshState } from '@/store/domain/vmeshes';
import { minutes } from '@/utils/units';


// tslint:disable-next-line: variable-name
export const MeshOverview: FC<Props> = observer(({ meshId }) => {

    const store = useStore();
    const { mesh, esMesh, loading, error } = useMesh(meshId);

    if (!esMesh) {
        if (error) {
            return <MeshDeviceErrorsHandler error={error} />;
        }
        if (loading) {
            return <Padding>
                <Spinner />
            </Padding>;
        }
        return <Padding className="lg:pb-40">
            <NotFoundBody />
        </Padding>;
    }

    const health = store.derived.health.getMeshHealthStatus(mesh, esMesh);
    const deviceCount = mesh ? mesh.managers.length + mesh.workers.length : 0;

    return <>
        <Padding>
            <HealthOverview health={health} mesh />
            <hr />
            <SoftwareUpdate esData={esMesh} mesh={mesh} />

            {mesh && <>
                <CollapsibleProperties properties={[
                    { name: 'VeeaHubs', value: `${deviceCount} VeeaHub${deviceCount > 1 ? 's' : ''}` },
                    { name: 'Applications', value: `${mesh.services.length} services` },
                ]} />
                <Separator sticky>Stats</Separator>
                <Stats men={esMesh.men} entityName={esMesh.name} />
            </>}

        </Padding>
        <VeeaPanel mesh={mesh} esData={esMesh}/>
    </>;
});

interface Props {
    meshId: string
}

// tslint:disable-next-line: variable-name
const SoftwareUpdate: FC<SoftwareUpdateProps> = observer(({ esData, mesh }) => {

    const store = useStore();
    const availableUpdate = store.domain.enrollment.availableUpdates.map.get(esData.acsId);

    const { loading, error } = useMeshAvailableUpdatesFetcher(esData.acsId, { pollInterval: minutes(2) });
    const [open, setOpen] = React.useState(false);

    if (loading && !availableUpdate) {
        return <>
            <Spinner />
            <hr />
        </>;
    }

    if (error) {
        return <MeshDeviceErrorsHandler error={error} />;
    }

    // if no updates available, return nothing
    // (unless modal is open, in which case wait for them to close)
    if (!open && (!availableUpdate || !availableUpdate.updateAvailable)) {
        return null;
    }

    const packageUpdates = availableUpdate?.props.updates ?? [];
    const summary = 'New versions of installed applications are available for your VeeaHubs.';
    const meshIsBootstrapping = esData?.men.status === 'bootstrapping' || (esData?.men.status === 'ready' && !mesh);

    return <>
        <SoftwareUpdateModal open={open} onClose={() => setOpen(false)}
            meshUUID={esData.acsId} menUnitSerial={esData.men.id} meshId={mesh?.props.meshId ?? null}
            packages={packageUpdates}
        />
        <div className={style.softwareUpdate}>
            <i className="icon icon-124_Pack" />
            <div className={style.softwareUpdateDescription}>
                <div><b>Software update available</b></div>
                <details>
                    <summary>{summary}</summary>
                    <ul>
                        {packageUpdates.map(update => <li key={update.newPackageId}>
                            {update.title} ({update.currentVersion} &rarr; {update.newVersion})
                        </li>)}
                    </ul>
                </details>
            </div>
            <Button
                disabled={meshIsBootstrapping}
                className={style.updateBtn}
                onClick={() => setOpen(true)}
                success large
            >
                Update Software
            </Button>
        </div>
        <hr />
    </>;
});

interface SoftwareUpdateProps {
    esData: EnrollmentMeshState
    mesh?: VmeshState
}