import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Separator, Nothing, Spinner } from '@/components/core';
import { useStore } from '@/hooks/useStore';
import { EnrollmentDeviceState } from '@/store/domain/enrollment';
import { NodeState } from '@/store/domain/nodes';
import { DeviceItem } from '../Items/DeviceItem';
import { Padding } from './Padding';
import { MeshDeviceErrorsHandler } from '@/components/core/Errors';
import { useMesh } from '@/hooks/useMesh';


// tslint:disable-next-line: variable-name
export const MeshDeviceList: FC<Props> = observer(({ menUnitSerial }) => {

    const store = useStore();
    const { loading, error, esMesh } = useMesh(menUnitSerial);

    if (!esMesh && loading) {
        return <Spinner />;
    } else if (error) {
        return <Padding>
            <MeshDeviceErrorsHandler error={error} />
        </Padding>;
    }

    const onlineDevices: [NodeState | undefined, EnrollmentDeviceState][] = [];
    const offlineDevices: [NodeState | undefined, EnrollmentDeviceState][] = [];

    for (const [id, nodeESData] of esMesh?.devices ?? []) {
        const node = store.domain.nodes.map.get(id);
        if (node) {
            const health = store.derived.health.getNodeHealthStatus(node, nodeESData);
            if (health === 'healthy' || health === 'need-reboot') {
                onlineDevices.push([node, nodeESData]);
            } else {
                offlineDevices.push([node, nodeESData]);
            }
        } else {
            offlineDevices.push([undefined, nodeESData]);
        }
    }

    return <div className="p-15 lg:p-30">
        <Separator sticky description="This section shows the VeeaHubs that are reachable."
            className="mt-0">
            Online VeeaHubs
        </Separator>
        <div>{onlineDevices.map(([n, e]) => <DeviceItem key={e.id} node={n} acsData={e} />)}</div>
        {
            onlineDevices.length === 0 ?
            <Nothing>No online VeeaHubs</Nothing> :
            null
        }
        <Separator sticky description="This section shows the VeeaHubs that are not currently reachable.">
            Offline VeeaHubs
        </Separator>
        <div>{offlineDevices.map(([n, e]) => <DeviceItem key={e.id} node={n} acsData={e} />)}</div>
        {
            offlineDevices.length === 0 ?
            <Nothing>No offline VeeaHubs</Nothing> :
            null
        }
    </div>;
});

interface Props {
    menUnitSerial: string
}
