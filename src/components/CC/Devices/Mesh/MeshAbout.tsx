import { FC } from 'react';
import { useParams } from 'react-router';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { healthToShortname } from '@/utils/healthStatus';
import { VmeshState } from '@/store/domain/vmeshes';
import { EnrollmentMeshState } from '@/store/domain/enrollment';
import { MeshDeviceErrorsHandler } from '@/components/core/Errors';
import { useVmeshesFetcher } from '@/hooks/fetchers';
import { Spinner } from '@/components/core';
import * as style from '../../Devices/Device/DeviceAbout.module.scss';
import { Padding } from './Padding';


// tslint:disable-next-line: variable-name
export const MeshAbout: FC<Props> = observer(({ mesh, esData }) => {
    const store = useStore();
    const { selectedGroupId } = useParams<{ selectedGroupId: string }>();
    const { loading, error } = useVmeshesFetcher(selectedGroupId);
    const health = store.derived.health.getMeshHealthStatus(mesh, esData);

    const packagesOverview = esData?.men.packages.map(pkg => ({
        name: pkg.title,
        version: pkg.version,
    })) ?? [];

    if (loading) {
        return <Padding><Spinner /></Padding>;
    } else if (error) {
        return <Padding>
            <MeshDeviceErrorsHandler error={error} />
        </Padding>;
    }

    return <div className="p-15 lg:p-30">
        <div className={style.applicationPopupListSection}>

            <div className={style.applicationPopupDetailsSeparator}>
                Status
            </div>
            <div className={`${style.applicationPopupDetailsItem}`}>
                <p className={style.name}>Health</p>
                <p className={style.value}>{healthToShortname(health)}</p>
            </div>
            <div className={style.applicationPopupDetailsItem}>
                <p className={style.name}>Services</p>
                <p className={style.value}>{mesh ? `${mesh?.services.length} service(s)` : 'Unknown'}</p>
            </div>
            <div className={style.applicationPopupDetailsItem}>
                <p className={style.name}>VeeaHubs</p>
                <p className={style.value}>{mesh ? `${mesh?.nodes.length} VeeaHub(s)` : 'Unknown'}</p>
            </div>

            <br />

            <div className={style.applicationPopupDetailsSeparator}>
                Mesh
            </div>
            <div className={`${style.applicationPopupDetailsItem}`}>
                <p className={style.name}>SSID</p>
                <p className={style.value}>{mesh?.props.ssid ?? 'Unknown'}</p>
            </div>
            <div className={style.applicationPopupDetailsItem}>
                <p className={style.name}>Swarm ID</p>
                <p className={style.value}>{mesh?.props.swarmid ?? 'Unknown'}</p>
            </div>
            <div className={style.applicationPopupDetailsItem}>
                <p className={style.name}>Mesh UUID</p>
                <p className={style.value}>{mesh?.props.uuid ?? 'Unknown'}</p>
            </div>

            <br />

            <div className={style.applicationPopupDetailsSeparator}>
                Packages
            </div>

            {packagesOverview.map(pkg => (
                <div key={pkg.name} className={`${style.applicationPopupDetailsItem}`}>
                    <p className={style.name}>{pkg.name}</p>
                    <p className={style.value}>{pkg.version}</p>
                </div>
            ))}
        </div>
    </div>;
});

interface Props {
    mesh?: VmeshState
    esData?: EnrollmentMeshState
}
