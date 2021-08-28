import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams, Link, useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';
import { HeadTitle, PageIntro, RoutedTabBar, LinkTab, Container } from '@/components/core';
import { NotFound } from '../../404';
import { DeviceOverview } from './DeviceOverview';
import { DeviceStatus } from './DeviceStatus';
import { DeviceAbout } from './DeviceAbout';
import { DeviceEvents } from './Events/DeviceEvents';
import { MeshDeviceErrorsHandler } from '@/components/core/Errors';
import { useNode } from '@/hooks/useNode';
import { useStore } from '@/hooks/useStore';
import { HealthOverview } from '../HealthOverview';
import { Padding } from '../Mesh/Padding';
import { DeviceLogs } from './DeviceLogs';


// tslint:disable-next-line: variable-name
export const Device: FC<Props> = observer(({}) => {

    const store = useStore();
    const { deviceId } = useParams<{ deviceId?: string }>();
    const { path, url } = useRouteMatch();
    const { node, esNode, loading, error } = useNode(deviceId ?? '');
    const name = node?.props.name ?? esNode?.name ?? deviceId ?? 'unknown';
    const health = store.derived.health.getNodeHealthStatus(node, esNode);
    const nodeIsBootstrapping = esNode?.status === 'bootstrapping' || (esNode?.status === 'ready' && !node);

    if (!deviceId || (!node && !esNode && !loading)) {

        /**
         * There is a moment during the end of device enrollment,
         * where ES will have status ready, yet our backend will throw an error
         * saying device not found in MAS data.
         */
        const deviceFinishingEnrollment = nodeIsBootstrapping && error?.message.toLowerCase().includes('not found');
        if (error && !deviceFinishingEnrollment) {
            return <DevicePage toPrefix={url} name={name}>
                <MeshDeviceErrorsHandler error={error} />
            </DevicePage>;
        }
        return <NotFound />;
    }

    return <DevicePage
        toPrefix={url}
        name={name}
    >
        {/* <Route exact path={`${path}/applications`}>Applications</Route> */}
        <Route exact path={`${path}/status`}>
            {esNode && nodeIsBootstrapping ? <Padding>
                <HealthOverview
                    unitSerial={esNode.id}
                    health={health}
                    error={esNode.error}
                    progress={esNode.progress}
                />
            </Padding> : <DeviceStatus node={node} loading={loading} error={error} />}
        </Route>
        <Route exact path={`${path}/about`}><DeviceAbout unitSerial={deviceId} /></Route>
        <Route exact path={`${path}/events`}>
            <DeviceEvents unitSerials={[deviceId]} name={name}/>
        </Route>
        <Route exact path={`${path}/logs`}><DeviceLogs unitSerial={deviceId} masId={node?.props.masId ?? ''}/></Route>
        <Route path={`${path}/overview`}><DeviceOverview unitSerial={deviceId} /></Route>
        <Route path={path}><Redirect to={`${url}/overview`}/></Route>
    </DevicePage>;
});

interface Props {}


// tslint:disable-next-line: variable-name
const DevicePage: FC<DevicePageProps> = ({ name, toPrefix, children }) => {

    const store = useStore();
    const { selectedGroupId } = useParams<{ selectedGroupId: string }>();
    const userHasDeviceLogsPermission = store.view.activeuser.hasDeviceLogsFeature;

    return (
        <>
            <HeadTitle>{`Veea Control Center - VeeaHub ${name}`}</HeadTitle>
            <PageIntro title={name} icon="icon-78_VeeaHub">
                <Link to={`/cc/${selectedGroupId}/devices/devices`}>
                    <i className="fas fa-chevron-left"></i>My VeeaHubs &amp; Meshes
                </Link>
            </PageIntro>
            <RoutedTabBar className="mt-15">
                <LinkTab to={`${toPrefix}/overview`} dataQaComponent="device-overview-tab">Overview</LinkTab>
                <LinkTab to={`${toPrefix}/status`} dataQaComponent="device-status-tab">Status</LinkTab>
                <LinkTab to={`${toPrefix}/events`} dataQaComponent="device-events-tab">Events</LinkTab>
                {userHasDeviceLogsPermission &&
                    <LinkTab to={`${toPrefix}/logs`} dataQaComponent="device-logs-tab">Logs</LinkTab>
                }
                <LinkTab to={`${toPrefix}/about`} dataQaComponent="device-about-tab">About</LinkTab>
            </RoutedTabBar>
            <Container solid className="p-0">
                <Switch>
                    {children}
                </Switch>
            </Container>
        </>
    );
};

interface DevicePageProps {
    toPrefix: string
    name: string
}