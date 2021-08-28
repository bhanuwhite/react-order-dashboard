import * as React from 'react';
import { FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import { useNode } from '@/hooks/useNode';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { Button, DateRange, LinkButton, Section, GrayContainer } from '../../core';
import { DeviceHealth } from './DeviceHealth';
import { DeviceStatus } from './DeviceStatus';
import { AdditionalInformation } from './AdditionalInformation';
import { Certificate } from './Certificate';
import { CellularStats } from './CellularStats';
import { useStore } from '@/hooks/useStore';
import { PowerOptions } from './PowerOptions';


// tslint:disable-next-line: variable-name
export const Device: FC<Props> = observer(({}) => {

    // Make sure when this component is mounted that we scroll to the top.
    useScrollToTop();

    const [ open, setOpen ] = React.useState(false);
    const { selectedGroupId, deviceId } = useParams<{ selectedGroupId: string, deviceId: string }>();
    // FIXME: use error handling v2
    const { node, esMesh, esNode /*, loading, error */ } = useNode(deviceId);
    const has4GPackage = esMesh?.men.packages.find(p => p.requires4GCapability);
    const name = esNode?.name ?? deviceId;
    const isDeviceOnline = node?.props.isConnected;

    return <div className="mx-4 md:mx-0 mb-4">
        <div className="flex justify-between flex-wrap">
            <h1 className="text-2xl font-medium mb-4 dark:text-white">
                <Link to={`/${selectedGroupId}/devices`} className="text-primary hover:underline">VeeaHubs</Link>
                <i className="mx-3 text-xl fas fa-caret-right dark:text-gray-600 text-gray-300" />
                {name}
            </h1>
            <div className="relative -top-2">
                <Button disabled={!isDeviceOnline} className="mx-3">Node Manager</Button>
                <Button className="mr-3" red>Unenroll Device</Button>
                <Button disabled={!isDeviceOnline} onClick={() => setOpen(true)}>
                    <i className="fas fa-power-off mr-3" />
                    Power Options
                </Button>
            </div>
        </div>
        <PowerOptions open={open} onClose={() => setOpen(false)} node={node} />
        <DeviceHealth esMesh={esMesh} esNode={esNode} node={node} selectedGroupId={selectedGroupId} />
        <DeviceStatus node={node} />
        {has4GPackage && <CellularStats node={node} />}
        <Certificate deviceId={deviceId} />
        <DeviceLogsSection selectedGroupId={selectedGroupId} deviceId={deviceId} />
        <AdditionalInformation node={node} deviceId={deviceId} />
        <Section title="Events" className="mb-4" infoLink={{ kind: 'tooltip', text: 'TODO' }}>
            <GrayContainer className="p-5 dark:text-gray-300 text-gray-500 text-sm text-center">
                <p>Currently your VeeaHub does not have an event stream associated to it.</p>
                <p>Please check back here soon, if the prolem persists please contact support.</p>
            </GrayContainer>
        </Section>
    </div>;
});

interface Props {}


// tslint:disable-next-line: variable-name
const DeviceLogsSection: FC<DeviceLogsSectionProps> = observer(({ selectedGroupId, deviceId }) => {

    const store = useStore();
    const [ dateRange, setDateRange ] = React.useState(() => [moment().subtract(1, 'week'), moment()] as const);
    const logQuery = `after=${encodeURIComponent(dateRange[0].utc().toISOString())}&before=${encodeURIComponent(dateRange[1].utc().toISOString())}`;

    if (!store.view.activeuser.hasDeviceLogsFeature) {
        return null;
    }

    return <Section title="Device Logs" className="mb-6">
        <div className="flex items-end">
            <DateRange className="flex-grow" labelStart="Start Date" labelEnd="End Date"
                value={dateRange}
                onChange={setDateRange}
            />
            <LinkButton to={`/${selectedGroupId}/devices/${deviceId}/logs?${logQuery}`} className="ml-4 w-32">
                View
            </LinkButton>
            <Button orange className="ml-4 w-32">
                Download
            </Button>
        </div>
    </Section>;
});

interface DeviceLogsSectionProps {
    selectedGroupId: string
    deviceId: string
}