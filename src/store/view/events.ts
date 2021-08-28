import moment from 'moment';
import { observable } from 'mobx';
import { Results } from '@/actions/events';

// DeviceEventsState stores the query filters and event logs for a device's events
export interface DeviceEventsState {
    startDate: string
    endDate: string
    streams: {unit_serial: string, stream: string}[]
    events: Results
}

export const createDeviceEvents = () => observable<DeviceEventsState>({
    startDate: moment().utc().subtract(4, 'hours').format(),
    endDate: moment().utc().format(),
    streams: [],
    events: {},
});