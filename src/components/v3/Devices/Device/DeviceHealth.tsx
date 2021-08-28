import { useStore } from '@/hooks/useStore';
import { HealthStatus } from '@/store/derived/health';
import { EnrollmentDeviceState, EnrollmentMeshState } from '@/store/domain/enrollment';
import { NodeState } from '@/store/domain/nodes';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { computeStatusColor, healthToShortnameForNode } from '@/components/v3/utils/healthStatus';


// tslint:disable-next-line: variable-name
export const DeviceHealth: FC<Props> = observer(({ esNode, esMesh, node, selectedGroupId }) => {

    const store = useStore();
    const health = store.derived.health.getNodeHealthStatus(node, esNode);

    return <div className="rounded border dark:bg-gray-900 dark:text-white bg-white border-solid dark:border-gray-700 border-gray-300 text-sm mb-6">
        <div className="p-5 flex justify-between border-b border-solid dark:border-gray-700 border-gray-300">
            <div className="flex">
                <div className={`${computeStatusColor(health)} rounded-full w-3 h-full mr-4`} />
                <div>
                    <div className="font-medium text-base">{healthToShortnameForNode(health)}</div>
                    <div className="dark:text-gray-400 text-gray-500">
                        {toHelpfulMessage(health)}
                    </div>
                </div>
            </div>
            <div className="flex items-center">
                <a href="https://www.veea.com/" className="text-primary hover:underline outline-none focus-visible:outline-black">Learn More</a>
            </div>
        </div>
        <div className="p-5 flex justify-between items-center font-medium">
            <div className="flex-1 space-y-1">
                <div className="dark:text-gray-400 text-gray-500 uppercase">Serial</div>
                <div>{esNode?.id}</div>
            </div>
            <div className="flex-1 space-y-1">
                <div className="dark:text-gray-400 text-gray-500 uppercase">Mesh</div>
                <div>
                    <Link className="text-primary hover:underline focus-visible:outline-black"
                        to={`/${selectedGroupId}/meshes/${esMesh?.id}`}
                    >
                        {esMesh?.name ?? 'Unknown'}
                    </Link>
                </div>
            </div>
            <div className="flex-1 space-y-1">
                <div className="dark:text-gray-400 text-gray-500 uppercase">Address</div>
                <div>{node?.props.address || 'Not Available'}</div>
            </div>
            <div className="flex-1 space-y-1">
                <div className="dark:text-gray-400 text-gray-500 uppercase">Role</div>
                <div>{esNode?.isMEN ? 'Gateway' : 'Mesh'}</div>
            </div>
        </div>
    </div>;
});

interface Props {
    selectedGroupId: string
    esNode?: EnrollmentDeviceState
    esMesh?: EnrollmentMeshState
    node?: NodeState
}

function toHelpfulMessage(health: HealthStatus): React.ReactNode {

    switch (health) {
        case 'healthy': return 'This VeeaHub is working properly - no actions are required at this moment.';
        case 'need-reboot': return 'This VeeaHub needs to be rebooted to complete installing new software.';
        case 'busy': return 'This VeeaHub is busy with one or more tasks.';
        case 'installing': return 'This VeeaHub is currently installing system software. This might take up to 20 minutes depending on your internet connection.';
        case 'offline': return 'This VeeaHub is not connected to VeeaCloud. Check that your VeeaHub is powered on and its internet connection is working.';
        case 'errors': return 'This VeeaHub is reporting problems and might not be reachable. You might need to restart your VeeaHub to solve this issue.';
        case 'unknown': return 'Some information is missing about this VeeaHub on our service. If the problem persists, please contact customer support.';
    }
}