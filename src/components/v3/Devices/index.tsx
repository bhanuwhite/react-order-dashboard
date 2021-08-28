import { FC } from 'react';
import { Switch, Route } from 'react-router';
import { PageNotFound } from '../PageNotFound';
import { DeviceList } from './DeviceList';
import { Device } from './Device';
import { DeviceLogs } from './Device/DeviceLogs';


// tslint:disable-next-line: variable-name
export const Devices: FC<Props> = ({}) => (
    <Switch>
        <Route exact path="/:selectedGroupId/devices/"><DeviceList /></Route>
        <Route exact path="/:selectedGroupId/devices/:deviceId/"><Device /></Route>
        <Route exact path="/:selectedGroupId/devices/:deviceId/logs"><DeviceLogs /></Route>
        <Route path="/:selectedGroupId/devices/"><PageNotFound /></Route>
    </Switch>
);

interface Props {}
