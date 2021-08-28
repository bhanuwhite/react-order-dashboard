import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Link, useParams } from 'react-router-dom';
import { useStore } from '@/hooks/useStore';
import { mergeFetchers } from '@/fetcher';
import { useNodesFetcher, useOwnerEnrollDataFetcher, useVmeshesFetcher } from '@/hooks/fetchers';
import { HealthStats } from '@/store/derived/health';
import { InfoBox } from '../core';


// tslint:disable-next-line: variable-name
export const OverallHealth: FC<Props> = observer(({}) => {

    const store = useStore();
    const { selectedGroupId } = useParams<{ selectedGroupId: string }>();
    const { loading, error } = mergeFetchers(
        useNodesFetcher(selectedGroupId),
        useVmeshesFetcher(selectedGroupId),
        useOwnerEnrollDataFetcher(selectedGroupId),
    );
    const stats = store.derived.health.getStatusSummary();

    return <>
        <div className="mb-6 flex">
            <div className={SCROLLER}>
                <DevicesStats loading={loading} stats={stats} selectedGroupId={selectedGroupId} />
                <MeshesStats loading={loading} stats={stats} selectedGroupId={selectedGroupId} />
                <CountStats loading={loading} stats={stats} selectedGroupId={selectedGroupId} />
            </div>
        </div>
        {error && <InfoBox className="mb-6 px-4" kind="error">{error.message}</InfoBox>}
    </>;
});

interface Props {}

interface StatsProps {
    stats: HealthStats
    loading: boolean
    selectedGroupId: string
}

const SCROLLER = 'relative flex flex-auto whitespace-nowrap overflow-x-scroll lg:overflow-visible no-scrollbar';
const BOX = 'rounded border bg-white border-solid border-gray-300 flex-1';
const COLOR_HEALTHY = 'green';
const COLOR_ERROR = 'red';
const COLOR_BUSY = 'orange';
const COLOR_OFFLINE = 'black';


// tslint:disable-next-line: variable-name
const DevicesStats: FC<StatsProps> = observer(({ selectedGroupId, stats }) => {

    const healthyCount = stats.nodes.healthy + stats.nodes['need-reboot'];
    const busyCount = stats.nodes.busy + stats.nodes.installing;
    const offlineCount = stats.nodes.offline + stats.nodes.unknown;
    const errorsCount = stats.nodes.errors;
    const totalCount = stats.nodes.total;

    return <div className={`ml-4 md:ml-0 text-sm ${BOX}`}>
        <div className="flex justify-between px-4 py-3">
            <span className="uppercase text-gray-500 mr-4">Devices</span>
            <Link to={`/${selectedGroupId}/devices`} className="uppercase text-primary hover:underline">
                See All
            </Link>
        </div>
        <div className="px-4 pt-2 pb-4 space-x-8 flex">
            <div>
                <PieChart className="w-20 h-20" values={[
                    { count: healthyCount, color: COLOR_HEALTHY },
                    { count: busyCount, color: COLOR_BUSY },
                    { count: offlineCount, color: COLOR_OFFLINE },
                    { count: errorsCount, color: COLOR_ERROR },
                ]}/>
            </div>
            <div className="flex">
                <div className="font-bold text-right">
                    <div>{Math.floor(100 * healthyCount / totalCount)}%</div>
                    <div>{Math.floor(100 * errorsCount / totalCount)}%</div>
                    <div>{Math.floor(100 * busyCount / totalCount)}%</div>
                    <div>{Math.floor(100 * offlineCount / totalCount)}%</div>
                </div>
                <div className="ml-5">
                    <div>Healthy</div>
                    <div>Errors</div>
                    <div>Busy</div>
                    <div>Offline</div>
                </div>
            </div>
        </div>
    </div>;
});

// tslint:disable-next-line: variable-name
const MeshesStats: FC<StatsProps> = observer(({ selectedGroupId, stats }) => {

    const healthyCount = stats.meshes.healthy + stats.meshes['need-reboot'];
    const busyCount = stats.meshes.busy + stats.meshes.installing;
    const offlineCount = stats.meshes.offline + stats.meshes.unknown;
    const errorsCount = stats.meshes.errors;
    const totalCount = stats.meshes.total;

    return <div className={`mx-6 text-sm ${BOX}`}>
        <div className="flex justify-between px-4 py-3">
            <span className="uppercase text-gray-500 mr-4">Meshes</span>
            <Link to={`/${selectedGroupId}/meshes`} className="uppercase text-primary hover:underline">
                See All
            </Link>
        </div>
        <div className="px-4 pt-2 pb-4 space-x-8 flex">
            <div>
                <PieChart className="w-20 h-20" values={[
                    { count: healthyCount, color: COLOR_HEALTHY },
                    { count: busyCount, color: COLOR_BUSY },
                    { count: offlineCount, color: COLOR_OFFLINE },
                    { count: errorsCount, color: COLOR_ERROR },
                ]}/>
            </div>
            <div className="flex">
                <div className="font-bold text-right">
                    <div>{Math.floor(100 * healthyCount / totalCount)}%</div>
                    <div>{Math.floor(100 * errorsCount / totalCount)}%</div>
                    <div>{Math.floor(100 * busyCount / totalCount)}%</div>
                    <div>{Math.floor(100 * offlineCount / totalCount)}%</div>
                </div>
                <div className="ml-5">
                    <div>Healthy</div>
                    <div>Errors</div>
                    <div>Busy</div>
                    <div>Offline</div>
                </div>
            </div>
        </div>
    </div>;
});

// tslint:disable-next-line: variable-name
const CountStats: FC<StatsProps> = observer(({ stats, selectedGroupId }) => {

    return <div className={`mr-4 md:mr-0 text-base ${BOX}`}>
        <div className="flex justify-center h-full items-center px-4 py-3">
            <div className="flex flex-col h-full justify-between text-right text-primary font-bold">
                <Link to={`/${selectedGroupId}/meshes`} className="block hover:underline">{stats.meshes.total}</Link>
                <Link to={`/${selectedGroupId}/devices`} className="block hover:underline">{stats.nodes.total}</Link>
                <div>Todo</div>
                <div>Todo</div>
            </div>
            <div className="flex flex-col h-full justify-between ml-5 uppercase text-gray-500">
                <div>Total Meshes</div>
                <div>Total Devices</div>
                <div>Subscriptions</div>
                <div>Total Clients</div>
            </div>
        </div>
    </div>;
});


// tslint:disable-next-line: variable-name
const PieChart: FC<{ className: string, values: ChartValue[]}> = ({ values, className }) => {

    const totalCount = values.reduce((total, curr) => total + curr.count, 0) || 1;
    const slices = values.filter(v => v.count > 0).map(v => ({
        angle: (v.count / totalCount) * 2 * Math.PI,
        color: v.color,
    })).sort((a, b) => a.angle - b.angle);

    let acc = -Math.PI / 2;

    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 10 10" className={className}>
        {slices.length > 1 && slices.map(({ angle, color }) => {

            const prevPoint = acc;
            acc += angle;

            return <path fill={color} key={color} d={
                `M ${5 * Math.cos(prevPoint)} ${5 * Math.sin(prevPoint)} ` +
                `A 5 5 0 ${angle > Math.PI ? '1' : '0'} 1 ${5 * Math.cos(acc)} ${5 * Math.sin(acc)} ` +
                `L 0 0 Z`
            } />;
            // return <circle fill={color} r={1} cx={4 * Math.cos(acc)} cy={4 * Math.sin(acc)} />;
        })}
        {slices.length === 1 && <circle fill={slices[0].color} r={5} cx={0} cy={0} />}
    </svg>;
};

interface ChartValue {
    count: number
    color: string
}