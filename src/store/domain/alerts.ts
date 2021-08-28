import { observable, computed, action } from 'mobx';
import { isIn } from '@/utils/types';

export interface AlertProps {
    alertname: string
    group: string
    unit_serial: string
    startsAt: string
}


export class AlertsState  {

    @observable
    all: AlertProps[] = [];

    constructor() {}

    @computed
    get alertCounts() {

        const counts = {
            failover: 0,
            NodeCPUUsage: 0,
            unknown: 0,
        };

        for (const alert of this.all) {
            const a = alert.alertname;
            if (isIn(a, counts)) {
                counts[a] += 1;
            } else {
                counts.unknown += 1;
            }
        }
        return counts;
    }
}

export const createAlerts = () => action(() => new AlertsState())();

