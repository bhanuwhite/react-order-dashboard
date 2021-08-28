import { observer } from 'mobx-react-lite';
import type { FC } from 'react';
import { useStore } from '@/hooks/useStore';
import { useAlertsFetcher } from '@/hooks/fetchers';
import { MeshDeviceErrorsHandler } from '@/components/core/Errors';
// import { PieDatum } from '@nivo/pie';
import { PieChart } from './PieChart';
import * as styles from './index.module.scss';
import { minutes } from '@/utils/units';


const humanLabels =  {
    failover: 'Failover',
    NodeCPUUsage: 'High CPU',
    unknown: 'Unknown',
};

// tslint:disable-next-line: variable-name
export const Alerts: FC<Props> = observer(({}) => {

    const store = useStore();
    const { loading, error } = useAlertsFetcher({ pollInterval: minutes(2) });

    // notify mobx of our interest in this
    const alerts = store.domain.alerts;
    const datum: any[] = [];
    let totalAlerting = 0;

    // tslint:disable-next-line: forin
    for (const count in alerts.alertCounts) {
        const alertCount = count as keyof typeof alerts.alertCounts;
        const value = alerts.alertCounts[alertCount];
        totalAlerting += value;

        datum.push( {
            id: humanLabels[alertCount],
            label: humanLabels[alertCount],
            value,
        });
    }

    if (totalAlerting === 0) {
        datum.push({
            id: 'All good',
            label: 'All good',
            value: 1, // Dummy value.
        });
    }

    if (error) {
        return <MeshDeviceErrorsHandler error={error} />;
    }

    return <div className={`${styles.pieChart} ${loading ? styles.loading : ''}`}>
        <PieChart data={datum}/>
        <div className={styles.total}>
            <span>{totalAlerting}</span>
        </div>
    </div>;
});


interface Props {}