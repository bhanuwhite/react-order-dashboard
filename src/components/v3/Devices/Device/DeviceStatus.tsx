import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Section } from '../../core';
import { NodeState } from '@/store/domain/nodes';
import { useNodeStatusFetcher } from '@/hooks/fetchers';


// tslint:disable-next-line: variable-name
export const DeviceStatus: FC<Props> = observer(({ node }) => {

    useNodeStatusFetcher(node?.props.masId);

    const isConnected = node?.isConnected;

    return <Section title="Device Status" className="mb-6">
            <div className="flex space-x-3 text-sm">
                <FieldStatus icon="icon-53_Megaphone" good={isConnected && node?.nodeStatus?.beacon_operational}>
                    BT Beacon
                </FieldStatus>
                <FieldStatus icon="icon-47_Alarm" good={isConnected && node?.nodeStatus?.network_time_operational}>
                    Network Time
                </FieldStatus>
                <FieldStatus icon="icon-40_Globe" good={isConnected && node?.nodeStatus?.internet_access_operational}>
                    Internet Access
                </FieldStatus>
                <FieldStatus icon="icon-70_Mesh" good={isConnected && node?.nodeStatus?.vmesh_operational}>
                    vMesh
                </FieldStatus>
            </div>
        </Section>;
});

interface Props {
    node?: NodeState
}

// tslint:disable-next-line: variable-name
const FieldStatus: FC<{ icon: string, good?: boolean }> = ({ icon, good, children }) => (
<div className={`flex-1 rounded-md py-3 ${computeStatus(good)} flex flex-col items-center justify-center`}>
    <i className={`text-3xl ${icon}`} />
    {children}
</div>
);

function computeStatus(good?: boolean): string {
    if (good) {
        return 'bg-good/10 text-green-800';
    }
    if (typeof good === 'undefined') {
        return 'bg-gray-100 text-gray-500';
    }
    return 'bg-red-100/50 text-red-800';
}