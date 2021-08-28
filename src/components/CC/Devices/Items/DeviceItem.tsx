import { FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { EnrollmentDeviceState } from '@/store/domain/enrollment';
import { NodeState } from '@/store/domain/nodes';
import * as styles from './ListItem.module.scss';
import { healthToDescription, healthToShortname } from '@/utils/healthStatus';


// tslint:disable-next-line: variable-name
export const DeviceItem: FC<DeviceItemProps> = observer(({ node, acsData, linkDisabled }) => {

    const store = useStore();
    const health = store.derived.health.getNodeHealthStatus(node, acsData);
    const deviceId = node?.id ?? acsData?.id ?? 'unknown';
    const name = node?.props.name ?? acsData?.name ?? 'unknown';
    const isMEN = node?.props.isManager ?? acsData?.isMEN;
    const statusClassName = `${styles.deviceStatus} ${styles[health]}`;

    return <DeviceItemLink {...{ linkDisabled, deviceId }}>
        <div className={styles.listItem + (linkDisabled ? ` ${styles.listItemDisabled}` : '')}>
            {/* <img src={`${ASSETS_IMAGES_FOLDER}/vh/default-device-icon.svg`} className={styles.icon} /> */}
            <div className={styles.title}>{name}</div>
            <div className={styles.description}>
                <p className={statusClassName} title={healthToDescription(health)}>
                    {healthToShortname(health)}
                </p>
                {isMEN ? 'Gateway' : 'Mesh'} VeeaHub
            </div>
        </div>
    </DeviceItemLink>;
});

// tslint:disable-next-line: variable-name
const DeviceItemLink: FC<DeviceItemLinkProps> = ({ linkDisabled = false, deviceId = '', children }) => {
    const { selectedGroupId } = useParams<{ selectedGroupId: string }>();

    if (!linkDisabled) {
        return <Link to={`/cc/${selectedGroupId}/devices/device/${deviceId}`} className={`p-0 ${styles.listItemLink}`}>
            {children}
        </Link>;
    }
    return <div className={`p-0 ${styles.listItemLink}`}>{children}</div>;
};

interface DeviceItemProps {
    node?: NodeState,
    acsData?: EnrollmentDeviceState
    linkDisabled?: boolean
}

interface DeviceItemLinkProps {
    linkDisabled?: boolean
    deviceId?: string
}