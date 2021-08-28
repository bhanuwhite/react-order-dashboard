import * as React from 'react';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { unix } from 'moment';
import { useStore } from '@/hooks/useStore';
import { NodeState } from '@/store/domain/nodes';
import { useNodeCellularDataCountFetcher, useNodeMetricsFetcher, useNodeSDWANFetcher } from '@/hooks/fetchers';
import { mergeFetchers } from '@/fetcher';
import { minutes, seconds } from '@/utils/units';
import { Section, Toggle, Once } from '../../core';
import { setSDWANLockedState } from '@/actions';
import { waitForMs } from '@/utils/await-helpers';


// tslint:disable-next-line: variable-name
export const CellularStats: FC<Props> = observer(({ node }) => {

    const store = useStore();
    const [ targetLockedValue, setTargetLockedValue ] = React.useState<boolean | null>(null);
    // FIXME: use error handling v2
    const { /* loading, error, */ fetchNow } = mergeFetchers(
        useNodeMetricsFetcher(node?.props.masId, { pollInterval: minutes(2) }),
        useNodeCellularDataCountFetcher(node?.props.masId, { pollInterval: minutes(2) }),
        useNodeSDWANFetcher(node?.props.masId, { pollInterval: minutes(2) }),
    );
    const metrics = node?.nodeMetrics;
    const cellular = node?.nodeCellularDataCount;
    const sdwan = node?.nodeSdwan;

    async function onToggleAutomatic4GFailover() {
        if (!sdwan || !node) {
            return;
        }
        const newLockedValue = !sdwan.locked;
        setTargetLockedValue(newLockedValue);
        await setSDWANLockedState(store, newLockedValue, node);
        await waitForMs(seconds(1));
        fetchNow();
    }

    const currentUsage = sdwan?.inUse === undefined ? 'Not available' :
        sdwan.inUse ? 'In Use' : `Not In Use${sdwan.locked ? ', Disabled' : ''}`;
    const lastUsage = sdwan?.lastUsage === undefined ? 'Not available' :
        sdwan.lastUsage === 0 ? 'Never' : unix(sdwan.lastUsage).fromNow();

    const dataUsageToday = cellular ? fmtBytes(cellular.bytes_recv_current_day + cellular.bytes_sent_current_day) : '';
    const dataUsageMonth = cellular ? fmtBytes(cellular.bytes_recv_current_month + cellular.bytes_sent_current_month) : '';

    const isConnected = metrics && metrics.network_mode !== ''
        && metrics.network_operator !== ''
        && metrics.connection_status.toLowerCase() === 'connected';
    const network = !isConnected ? 'Not connected' :
        <>{metrics!.network_operator} {'\u2013'} {metrics!.network_mode}</>;

    return <Section title="Cellular Stats" className={`mb-6 ${!node ? 'hidden' : ''}`}
        infoLink={{ kind: 'tooltip', text: '' }}
    >
        {targetLockedValue !== null ? <Once value={sdwan?.locked} equal={targetLockedValue} run={() => {
            setTargetLockedValue(null);
        }} /> : null}
        <div className="flex text-sm">
            <div className="px-20 rounded bg-gray-100 text-gray-500 flex flex-col items-center justify-center">
                <Toggle className="mb-3" value={!sdwan?.locked}
                    onChange={onToggleAutomatic4GFailover}
                    disabled={targetLockedValue != null}
                />
                Automatic 4G Failover
            </div>
            <div className="ml-6 flex-grow">
                <Row name="Network">
                    {network}
                </Row>
                <Row name="Current Usage">
                    {currentUsage}
                </Row>
                <Row name="Last Usage">
                    {lastUsage}
                </Row>
                <Row name="Data Usage" last>
                    {cellular ?
                        <>
                            {dataUsageToday} today / {dataUsageMonth} this month
                            <button className="ml-3 text-primary hover:underline font-bold">See more</button>
                        </> :
                        'Not Available'
                    }
                </Row>
            </div>
        </div>
        <div>

        </div>
    </Section>;
});

interface Props {
    node?: NodeState
}

// tslint:disable-next-line: variable-name
const Row: FC<{ name: React.ReactNode, last?: boolean }> = ({ name, last, children }) => (
    <div className={`flex justify-between ${last ? '' : 'pb-3 mb-3 border-b border-gray-300'}`}>
        <div className="text-gray-500">{name}</div>
        <div className="font-bold text-black">{children}</div>
    </div>
);

function fmtBytes(value: number) {
    if (value < 1024) {
        return `${value} B`;
    } else if (value < Math.pow(1024, 2)) {
        value /= 1024.0;
        return `${value.toPrecision(4)} kiB`;
    } else if (value < Math.pow(1024, 3)) {
        value /= Math.pow(1024, 2);
        return `${value.toPrecision(3)} MiB`;
    } else if (value < Math.pow(1024, 4)) {
        value /= Math.pow(1024, 3);
        return `${value.toPrecision(3)} GiB`;
    } else {
        value /= Math.pow(1024, 4);
        return `${value.toFixed(2)} TiB`;
    }
}