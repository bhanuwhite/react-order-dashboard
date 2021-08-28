import { FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { EnrollmentMeshState } from '@/store/domain/enrollment';
import { VmeshState } from '@/store/domain/vmeshes';
import * as styles from './ListItem.module.scss';
import { healthToDescription, healthToShortname } from '@/utils/healthStatus';


// tslint:disable-next-line: variable-name
export const MeshItem: FC<MeshItemProps> = observer(({ mesh, acsData, linkDisabled }) => {

    const store = useStore();
    const deviceCount = mesh?.nodes.length || acsData?.devices.size || 0;
    const health = store.derived.health.getMeshHealthStatus(mesh, acsData);
    const name = acsData?.name || mesh?.props.name || 'unknown';
    const meshId = mesh?.id || acsData?.id;
    const statusClassName = `${styles.deviceStatus} ${styles[health]}`;

    return <MeshItemLink {...{ linkDisabled, meshId }}>
        <div className={styles.listItem + (linkDisabled ? ` ${styles.listItemDisabled}` : '')}>
            {/* <img src={`${ASSETS_IMAGES_FOLDER}/vh/default-mesh-icon.svg`} className={styles.icon} /> */}
            <div className={styles.title}>{name}</div>
            <div className={styles.description}>
                <p className={statusClassName} title={healthToDescription(health)}>
                    {healthToShortname(health)}
                </p>
                <span className="hidden md:inline">VeeaHub Mesh Service with</span> {
                    deviceCount === 1 ? '1 VeeaHub' :
                    deviceCount === 0 ? 'no VeeaHubs' :
                    `${deviceCount} VeeaHubs`
                }
            </div>
        </div>
    </MeshItemLink>;
});

// tslint:disable-next-line: variable-name
const MeshItemLink: FC<MeshItemLinkProps> = ({ linkDisabled = false, meshId = '', children }) => {
    const { selectedGroupId } = useParams<{ selectedGroupId: string }>();

    if (!linkDisabled) {
        return <Link to={`/cc/${selectedGroupId}/devices/mesh/${meshId}`} className={`p-0 ${styles.listItemLink}`}>
            {children}
        </Link>;
    }
    return <div className={`p-0 ${styles.listItemLink}`}>{children}</div>;
};

interface MeshItemProps {
    mesh?: VmeshState
    acsData?: EnrollmentMeshState
    linkDisabled?: boolean
}

interface MeshItemLinkProps {
    linkDisabled?: boolean
    meshId?: string
}