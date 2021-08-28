import * as React from 'react';
import { SFC } from 'react';
import { NodeState, NodeStatus } from '@/store/domain/nodes';
import * as style from './DeviceStatus.module.scss';
import { useNodeStatusFetcher } from '@/hooks/fetchers';
import { MeshDeviceErrorsHandler } from '@/components/core/Errors';
import { Spinner } from '@/components/core';
import { Padding } from '../Mesh/Padding';
import { FetchError } from '@/fetcher';


// tslint:disable-next-line: variable-name
export const DeviceStatus: SFC<Props & PropsStatus> = ({ node, loading, error }) => {
    const errorState = !loading && error;
    return node ? <DeviceStatusContent node={node} />
    : errorState ? <MeshDeviceErrorsHandler error={error!} />
    : <Spinner />;
};


// tslint:disable-next-line: variable-name
const DeviceStatusContent: SFC<Required<Props>> = ({ node }) => {
    const { error } = useNodeStatusFetcher(node.props.masId);

    if (error) {
        return <Padding><MeshDeviceErrorsHandler error={error} /></Padding>;
    }

    return <div className="p-5 lg:p-20 pb-30" style={{ overflow: 'auto' }}>
        {displayList.map((section, i) => <React.Fragment key={i}>
            <div className={style.statusSeparator}>{section.title}</div>
            <div className={style.statusContainer}>
                {section.items.map(({ title, description, field }, index) => {

                    const attr = computeAttr(node, field);
                    const op = `operational-${attr}`;

                    return <div className={`${style.statusLine} ${op}`} key={index}>
                        {/* <img src={`${ASSETS_IMAGES_FOLDER}/vh/status/${icon}`} className={`${style.statusIcon} ${op}`}/> */}
                        <div className={style.statusLineInner}>
                            <div className={style.statusTitle}>{title}</div>
                            <div className={style.statusDescription}>{description}</div>
                            <div className={`${style.statusValue} ${op}`}>
                                {attr ? 'Operational' : 'Not operational'}
                            </div>
                        </div>
                    </div>;
                })}
            </div>
        </React.Fragment>)}
    </div>;
};

function computeAttr(node: NodeState, field: keyof NodeStatus): boolean {
    return node.isConnected && !!node.nodeStatus?.[field];
}

interface Props {
    node?: NodeState
}

interface PropsStatus {
    loading?: boolean
    error?: FetchError
}

interface Item {
    title: string
    description: string
    icon: string
    field: keyof NodeStatus
}

const internalComponents: Item[] = [
    {
        title: 'Bluetooth Beacon',
        description: 'The Bluetooth Beacon is used for proximal advertising.',
        icon: 'icon-connect.svg',
        field: 'beacon_operational',
    },
    {
        title: 'Network Time',
        description: 'Used to update your VeeaHub\'s time from the internet.',
        icon: 'icon-alarm.svg',
        field: 'network_time_operational',
    },
];

const internetConnection: Item[] = [
    {
        title: 'Backhaul Operations',
        description: 'Used to connect your VeeaHub to the internet.',
        icon: 'icon-connect.svg',
        field: 'backhaul_operational',
    },
    {
        title: 'Wi-Fi',
        description: 'Your VeeaHub is using a Wi-Fi connection for Internet access.',
        icon: 'icon-wifi.svg',
        field: 'gateway_wifi_operational',
    },
    {
        title: 'Ethernet',
        description: 'Your VeeaHub is using a wired connection for Internet access.',
        icon: 'icon-ethernet.svg',
        field: 'gateway_ethernet_operational',
    },
    {
        title: 'Cellular',
        description: 'Your VeeaHub is using 3G/4G networks for Internet access.',
        icon: 'icon-cellular.svg',
        field: 'gateway_cellular_operational',
    },
];

const networking: Item[] = [
    {
        title: 'Internet Access',
        description: 'Used to check if your VeeaHub is connected to the Internet.',
        icon: 'icon-globe.svg',
        field: 'internet_access_operational',
    },
    {
        title: 'vMesh Operations',
        description: 'Used to connect multiple VeeaHubs to create a mesh.',
        icon: 'icon-mesh.svg',
        field: 'vmesh_operational',
    },
];

const analytics: Item[] = [
    {
        title: 'Media Analytics',
        description: 'Provides media serving analytics for business owners.',
        icon: 'icon-analytics.svg',
        field: 'media_analytics_operational',
    },
    {
        title: 'Retail Analytics',
        description: 'Provides retail-oriented analytics for business owners.',
        icon: 'icon-analytics.svg',
        field: 'retail_analytics_operational',
    },
];

const displayList = [
    {
        title: 'Internal Components',
        items: internalComponents,
    },
    {
        title: 'Internet Connection',
        items: internetConnection,
    },
    {
        title: 'Networking',
        items: networking,
    },
    {
        title: 'Analytics',
        items: analytics,
    },
];
