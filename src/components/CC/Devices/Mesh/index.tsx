import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams, Link, useRouteMatch, Switch, Route } from 'react-router-dom';
import { PageIntro, RoutedTabBar, LinkTab, Container, Spinner, HeadTitle } from '@/components/core';
import { MeshDeviceErrorsHandler } from '@/components/core/Errors';
import { NotFound } from '@/components/CC/404';
import { UnauthorizedBody } from '@/components/CC/401';
import { MeshOverview } from './MeshOverview';
import { Subscriptions } from './Subscriptions';
import { MeshDeviceList } from './MeshDeviceList';
import { MeshAbout } from './MeshAbout';
import { useMesh } from '@/hooks/useMesh';
import { useStore } from '@/hooks/useStore';
import { Padding } from './Padding';
import { FetchError } from '@/fetcher';
import { DeviceEvents } from '../Device/Events/DeviceEvents';


// tslint:disable-next-line: variable-name
export const Mesh: FC<{}> = observer(({}) => {

    const store = useStore();
    const { meshId } = useParams<{ meshId?: string }>();
    const { path, url } = useRouteMatch();
    const { mesh, esMesh, loading, error, fetchNow } = useMesh(meshId ?? 'invalid');
    const hideSubscriptionTab = store.domain.enrollment.meshes.haveAnyVtpnPromoPackages
        && !store.view.debugOptions.showTrialVtpnSubscriptions;

    if (!meshId) {
        return <NotFound />;
    }

    if (!mesh && !esMesh && !loading) {
        if (error) {
            return <MeshPage toPrefix={url} name={`Mesh ${meshId}`}
                hideSubscriptionTab={hideSubscriptionTab}>
                <MeshDeviceErrorsHandler error={error} />
            </MeshPage>;
        }
    }

    const meshIsEnrolled = !!mesh && !!esMesh;
    const meshTabContentProps = { loading, error, meshIsEnrolled };

    return <MeshPage
        toPrefix={url}
        name={esMesh?.name ?? meshId}
        hideSubscriptionTab={hideSubscriptionTab}
    >
        <Route exact path={`${path}/subscriptions`}>
            {
                hideSubscriptionTab ?
                <Padding className="lg:pb-40"><UnauthorizedBody /></Padding> :
                <Subscriptions mesh={mesh} esData={esMesh} updateMeshData={fetchNow} />
            }
        </Route>
        <Route exact path={`${path}/devices`}>
            <MeshTabContent {...meshTabContentProps} canDisplayDuringBootstrap={true}>
                <MeshDeviceList menUnitSerial={meshId} />
            </MeshTabContent>
        </Route>
        <Route exact path={`${path}/about`}>
            <MeshTabContent {...meshTabContentProps} canDisplayDuringBootstrap={true}>
                <MeshAbout mesh={mesh} esData={esMesh} />
            </MeshTabContent>
        </Route>
        <Route exact path={`${path}/events`}>
            <MeshTabContent {...meshTabContentProps} canDisplayDuringBootstrap={true}>
                <DeviceEvents
                    unitSerials={mesh?.nodes || []}
                    name={mesh?.props.name || 'mesh'}
                    meshPage
                />
            </MeshTabContent>
        </Route>
        <Route path={path}>
            <MeshOverview meshId={meshId} />
        </Route>
    </MeshPage>;
});

// tslint:disable-next-line: variable-name
const MeshTabContent: FC<MeshTabContentProps> = ({
    children,
    meshIsEnrolled,
    canDisplayDuringBootstrap,
    loading,
    error,
}) => {
    const errorState = !loading && !!error;
    if (meshIsEnrolled || canDisplayDuringBootstrap) {
        return <>{children}</>;
    } else if (errorState) {
        return <MeshDeviceErrorsHandler error={error!} />;
    } else {
        return <Spinner />;
    }
};

// tslint:disable-next-line: variable-name
const MeshPage: FC<MeshPageProps> = ({ toPrefix, name, hideSubscriptionTab, children }) => {
    const { selectedGroupId } = useParams<{ selectedGroupId: string }>();
    return <>
        <HeadTitle>{`Veea Control Center - Mesh ${name}`}</HeadTitle>
        <PageIntro title={name} icon="icon-70_Mesh">
            <Link to={`/cc/${selectedGroupId}/devices`}>
                <i className="fas fa-chevron-left"></i>My VeeaHubs &amp; Meshes
            </Link>
        </PageIntro>
        <RoutedTabBar className="mt-15">
            <LinkTab exact to={`${toPrefix}`} dataQaComponent="mesh-overview-tab">Overview</LinkTab>
            {!hideSubscriptionTab && <LinkTab
                to={`${toPrefix}/subscriptions`}
                dataQaComponent="mesh-subscriptions-tab">
                    Subscriptions
            </LinkTab>}
            <LinkTab to={`${toPrefix}/devices`} dataQaComponent="mesh-devices-tab">VeeaHubs</LinkTab>
            <LinkTab to={`${toPrefix}/events`} dataQaComponent="mesh-events-tab">Events</LinkTab>
            <LinkTab to={`${toPrefix}/about`} dataQaComponent="mesh-about-tab">About</LinkTab>
        </RoutedTabBar>
        <Container solid className="p-0">
            <Switch>
                {children}
            </Switch>
        </Container>
    </>;
};

interface MeshTabContentProps {
    canDisplayDuringBootstrap: boolean
    meshIsEnrolled: boolean
    loading: boolean
    error?: FetchError
}

interface MeshPageProps {
    toPrefix: string
    name: string
    hideSubscriptionTab: boolean
}