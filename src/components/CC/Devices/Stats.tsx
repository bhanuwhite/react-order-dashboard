import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { Nothing, Spinner, Toggle, CollapsiblePanel, Once } from '@/components/core';
import type { FC } from 'react';
import type { NodeState } from '@/store/domain/nodes';
import type { EnrollmentDeviceState } from '@/store/domain/enrollment';
import { useStore } from '@/hooks/useStore';
import { useOwnerEnrollDataFetcher, useNodeFetcher } from '@/hooks/fetchers';
import { useNodeMetricsFetcher, useNodeCellularDataCountFetcher, useNodeSDWANFetcher } from '@/hooks/fetchers';
import { ErrorBox, MeshDeviceErrorsHandler } from '@/components/core/Errors';
import { Card } from '../Home/Card';
import { mergeFetchers } from '@/fetcher';
import * as styles from './Stats.module.scss';
import { unix } from 'moment';
import { setSDWANLockedState } from '@/actions';
import { waitForMs } from '@/utils/await-helpers';
import { minutes, seconds } from '@/utils/units';


// tslint:disable-next-line: variable-name
export const Stats: FC<Props> = observer(({ entityName, men }) => {

    const store = useStore();
    const { selectedGroupId } = useParams<{ selectedGroupId: string }>();
    const { loading, error } = useOwnerEnrollDataFetcher(selectedGroupId);

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <MeshDeviceErrorsHandler error={error} />;
    }

    const has4GPackage = men.packages.find(p => p.requires4GCapability) &&
        store.derived.health.shouldNodeBeConnectedToMAS(men);

    return <div style={{ overflow: 'auto', marginLeft: '-5px', marginRight: '-5px' }}>

        {has4GPackage ? (
            <SDWANCard entityName={entityName} unitSerial={men.id} />
        ) : <Nothing>No cellular stats to show</Nothing>}

    </div>;
});

interface Props {
    entityName: string
    men: EnrollmentDeviceState
}

// tslint:disable-next-line: variable-name
const SDWANCard: FC<{ unitSerial: string, entityName: string }> = observer(({ unitSerial, entityName }) => {

    const store = useStore();
    const { error } = useNodeFetcher(unitSerial);
    const node = store.domain.nodes.map.get(unitSerial);

    return <Card title={`Cellular usage of ${entityName}`} icon="fas fa-wifi">
        {(() => {
            if (!node) {
                if (error) {
                    if (error.status === 404) {
                        return <div className={styles.usageUnavailable}>
                            <i className="icon-100_Broken_File"/>
                            <b>Cellular usage unavailable</b>
                            {`We were unable to load cellular usage for ${entityName}. Please try again later.`}
                        </div>;
                    } else if (error.status === 200) {
                        return <div className={styles.usageUnavailable}>
                            <i className="icon-100_Broken_File"/>
                            <b>VeeaHub unavailable</b>
                            Please check that your VeeaHub is powered on and is connected to the internet.
                        </div>;
                    }
                    return <ErrorBox>{error.message}</ErrorBox>;
                }
                return <Spinner />;
            }
            return <SDWANCardContent node={node} />;
        })()}
    </Card>;
});

// tslint:disable-next-line: variable-name
const SDWANCardContent: FC<{ node: NodeState }> = observer(({ node }) => {

    // We refresh the data every 2 minutes.
    const store = useStore();
    const { loading, error, fetchNow } = mergeFetchers(
        useNodeMetricsFetcher(node.props.masId, { pollInterval: minutes(2) }),
        useNodeCellularDataCountFetcher(node.props.masId, { pollInterval: minutes(2) }),
        useNodeSDWANFetcher(node.props.masId, { pollInterval: minutes(2) }),
    );
    const [targetLockedValue, setTargetLockedValue] = React.useState<boolean | null>(null);
    const metrics = node.nodeMetrics;
    const cellular = node.nodeCellularDataCount;
    const sdwan = node.nodeSdwan;

    if (!metrics || !cellular || !sdwan) {
        if (loading) {
            return <Spinner />;
        }
        if (!sdwan && cellular && metrics) {
            return <Spinner text="Waiting for application to boot on VeeaHub..." />;
        }

        if (error) {
            return <MeshDeviceErrorsHandler error={error} customMessage={<>
                <b>No cellullar data found.</b><br />
                Check that your VeeaHub is powered on and its internet connection is working.<br />
            </>} />;
        }

        return <Nothing raw>{`We could not load your cellular data. Please try restarting your VeeaHub or contact`}
            {` customer support if the problem persists.`}</Nothing>;
    }

    async function onToggleAutomatic4GFailover() {
        if (!sdwan) {
            return;
        }
        const newLockedValue = !sdwan.locked;
        setTargetLockedValue(newLockedValue);
        await setSDWANLockedState(store, newLockedValue, node);
        await waitForMs(seconds(1));
        fetchNow();
    }

    const currentUsage = sdwan.inUse === undefined ? 'Not available' :
        sdwan.inUse ? 'In Use' : `Not In Use${sdwan.locked ? ', Disabled' : ''}`;
    const lastUsage = sdwan.lastUsage === undefined ? 'Not available' :
        sdwan.lastUsage === 0 ? 'Never' : unix(sdwan.lastUsage).fromNow();

    const isConnected = metrics.network_mode !== ''
        && metrics.network_operator !== ''
        && metrics.connection_status.toLowerCase() === 'connected';
    const network = !isConnected ? 'Not connected' :
        <>{metrics.network_operator} {'\u2013'} {metrics.network_mode}</>;

    return <>
        {targetLockedValue !== null ? <Once value={sdwan.locked} equal={targetLockedValue} run={() => {
            setTargetLockedValue(null);
        }} /> : null}
        <Property value={currentUsage}>Current Usage</Property>
        <Property value={lastUsage}>Last Usage</Property>
        <Property value={<Toggle className={styles.toggle} value={!sdwan.locked} disabled={targetLockedValue != null}
            onChange={onToggleAutomatic4GFailover} />}>
            Automatic 4G Failover
        </Property>
        <Property value={network}>Network</Property>
        <Property value={<SignalStrength strength={isConnected ? Math.floor(metrics.signal_level / 25) : 0} />}>
            Signal strength
        </Property>
        <CollapsiblePanel className={`${styles.panel}`} defaultValue={false} title={
            <Property value={
                <>
                    <Bytes className="mr-30"
                        value={cellular.bytes_recv_current_day + cellular.bytes_sent_current_day}
                        info="Today" />
                    <Bytes className="mr-20"
                        value={cellular.bytes_recv_current_month + cellular.bytes_sent_current_month}
                        info="Month" />
                </>
            }>Data usage</Property>
        }>
            <div className={`${styles.property} ${styles.bkg}`}>
                <div className={styles.name}>{''}</div>
                <div className={styles.value}>
                    <b className={`${styles.bytes} mr-20`}>Received</b>
                    <b className={`${styles.bytes} mr-30`}>Sent</b>
                </div>
            </div>
            <Property value={
                <>
                    <Bytes className="mr-30" value={cellular.bytes_recv_current_day} />
                    <Bytes className="mr-20" value={cellular.bytes_sent_current_day} />
                </>}>
                Today
            </Property>
            <Property value={
                <>
                    <Bytes className="mr-30" value={cellular.bytes_recv_previous_day} />
                    <Bytes className="mr-20" value={cellular.bytes_sent_previous_day} />
                </>}>
                Yesterday
            </Property>
            <Property value={
                <>
                    <Bytes className="mr-30" value={cellular.bytes_recv_current_month} />
                    <Bytes className="mr-20" value={cellular.bytes_sent_current_month} />
                </>}>
                This Month
            </Property>
            <Property value={
                <>
                    <Bytes className="mr-30" value={cellular.bytes_recv_previous_month} />
                    <Bytes className="mr-20" value={cellular.bytes_sent_previous_month} />
                </>}>
                Last Month
            </Property>
        </CollapsiblePanel>
    </>;
});

// tslint:disable-next-line: variable-name
const Property: FC<{ value: React.ReactNode, className?: string }> = ({ value, className, children }) => (
    <div className={`${className ?? ''} ${styles.property} ${styles.bkg}`}>
        <div className={styles.name}>{children} :</div>
        <div className={styles.value}>{value}</div>
    </div>
);

// tslint:disable-next-line: variable-name
const SignalStrength: FC<{ strength: number }> = ({ strength }) => (
    <span className={`${styles.signal} s-${strength}`}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
    </span>
);

// tslint:disable-next-line: variable-name
const Bytes: FC<{ value: number, info?: string, className: string }> = ({ value, info, className }) => {
    const { title, formatted } = formatBytes(value);
    return <span className={`${styles.bytes} ${className}`} title={title}>
        {formatted}
        <span className={styles.info}>{info}</span>
    </span>;
};

function formatBytes(value: number) {
    if (value < 1000) {
        return { title: 'Number in bytes', formatted: `${value} B` };
    } else if (value < Math.pow(1000, 2)) {
        value /= 1000.0;
        return { title: 'Number in kilobyte', formatted: `${value.toPrecision(4)} kB` };
    } else if (value < Math.pow(1000, 3)) {
        value /= Math.pow(1000, 2);
        return { title: 'Number in megabytes', formatted: `${value.toPrecision(3)} MB` };
    } else if (value < Math.pow(1000, 4)) {
        value /= Math.pow(1000, 3);
        return { title: 'Number in gigabytes', formatted: `${value.toPrecision(3)} GB` };
    } else {
        value /= Math.pow(1000, 4);
        return { title: 'Number in terabytes', formatted: `${value.toFixed(2)} TB` };
    }
}