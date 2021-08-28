import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './HealthStatus.module.scss';
import { useStore } from '@/hooks/useStore';
import { mergeFetchers } from '@/fetcher';
import { useNodesFetcher, useVmeshesFetcher, useOwnerEnrollDataFetcher } from '@/hooks/fetchers';
import { MeshDeviceErrorsHandler } from '@/components/core/Errors';
import { formatPercent } from '@/utils/format';
import { Link, useParams } from 'react-router-dom';


// tslint:disable-next-line: variable-name
export const HealthStatus: FC<Props> = observer(({}) => {

    const store = useStore();
    const { selectedGroupId } = useParams<{ selectedGroupId: string }>();
    const { loading, error } = mergeFetchers(
        useNodesFetcher(selectedGroupId),
        useVmeshesFetcher(selectedGroupId),
        useOwnerEnrollDataFetcher(selectedGroupId),
    );
    const { nodes, meshes } = store.derived.health.getStatusSummary();
    const loadingModifier = loading ? styles.loading : '';

    if (error) {
        <div className={styles.overallHealthBar}><MeshDeviceErrorsHandler error={error} /></div>;
    }

    return <div>
        <div data-qa-component="overall-health-bar" className={`${styles.overallHealthBar} ${loadingModifier}`}>
            <Group dataQaComponent="nodes-health" title="VeeaHubs">
                <Column to={`/cc/${selectedGroupId}/devices/devices?health=healthy%2Cneed-reboot`}
                    total={nodes.total} title="Healthy" value={nodes.healthy + nodes['need-reboot']}/>
                <Column to={`/cc/${selectedGroupId}/devices/devices?health=errors`}
                    total={nodes.total} title="Errors" value={nodes.errors}/>
                <Column to={`/cc/${selectedGroupId}/devices/devices?health=installing`}
                    total={nodes.total} title="Busy" value={nodes.busy + nodes.installing}/>
                <Column to={`/cc/${selectedGroupId}/devices/devices?health=offline`}
                    total={nodes.total} title="Offline" value={nodes.offline + nodes.unknown} />
            </Group>
            <Group dataQaComponent="health-totals" title="Total" className={styles.displayNoneMobile}>
                <Column title="Meshes" value={meshes.total}/>
                <Column title="VeeaHubs" value={nodes.total}/>
            </Group>
            <Group dataQaComponent="meshes-health" title="Meshes">
                <Column to={`/cc/${selectedGroupId}/devices/meshes?health=healthy%2Cneed-reboot`}
                    total={meshes.total} title="Healthy" value={meshes.healthy + meshes['need-reboot']}/>
                <Column to={`/cc/${selectedGroupId}/devices/meshes?health=errors`}
                    total={nodes.total} title="Errors" value={meshes.errors}/>
                <Column to={`/cc/${selectedGroupId}/devices/meshes?health=busy`}
                    total={meshes.total} title="Busy" value={meshes.busy + meshes.installing}/>
                <Column to={`/cc/${selectedGroupId}/devices/meshes?health=offline%2Cerrors`}
                    total={meshes.total} title="Offline" value={meshes.offline + meshes.unknown}/>
            </Group>
        </div>
    </div>;
});
interface Props {}

// tslint:disable-next-line: variable-name
const Group: FC<GroupProps> = ({ title, children, className, dataQaComponent = '' }) => (
    <div className={styles.group + (className ? ` ${className}` : '')} data-qa-component={dataQaComponent}>
        <div data-qa-component="group-title" className={styles.gtitle}>{title}</div>
        {children}
    </div>
);
interface GroupProps {
    title: string
    className?: string
    dataQaComponent?: string
}

// tslint:disable-next-line: variable-name
const Column: FC<ColumnProps> = ({ title, value, total, to }) => (
    <Linkable to={to}>
        <p data-qa-component="health-col-title" className={styles.title}>{title}</p>
        <p data-qa-component="health-col-value" className={`notranslate ${styles.value}`}>
            {total && total > 100 ?
                <>{formatPercent(value, total)} <span className={styles.percentUnit} /></> :
                value
            }
        </p>
    </Linkable>
);
interface ColumnProps {
    title: string
    value: number
    total?: number
    to?: string
}

// tslint:disable-next-line: variable-name
const Linkable: FC<{ to?: string }> = observer(({ to, children }) => {
    const store = useStore();
    if (to && store.view.featurePreview.listFilters) {
        return <Link className={styles.column} to={to}>{children}</Link>;
    }
    return <div className={styles.column}>{children}</div>;
});