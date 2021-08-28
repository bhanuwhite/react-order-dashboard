import { FC } from 'react';
import { useRouteMatch, Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { Container } from '@/components/core';
import { PageIntro } from '@/components/core';
import { RoutedTabBar, LinkTab } from '@/components/core';
import { MeshList } from './MeshList';
import { DeviceList } from './DeviceList';
import { useQuery } from '@/hooks/useQuery';
import { HEALTH_FILTER } from './ListFilters/consts';

// tslint:disable-next-line: variable-name
export const Devices: FC<Props> = ({}) => {

    const query = useQuery();
    const { path, url } = useRouteMatch();
    const { location: { pathname } } = useHistory();
    const healthFilter = query.get(HEALTH_FILTER);

    const getHealthStatusQueryParams = (screenType: string) =>
        pathname.includes(`devices/${screenType}`) && healthFilter
            ? `?${query.toString()}`
            : '';

    return <>
        <PageIntro title="VeeaHubs &amp; Meshes" icon="icon-78_VeeaHub">
            Browse &amp; manage your VeeaHubs and meshes.
        </PageIntro>
        <RoutedTabBar className="mt-15">
            <LinkTab to={`${url}/meshes${getHealthStatusQueryParams('mesh')}`}>My Meshes</LinkTab>
            <LinkTab to={`${url}/devices${getHealthStatusQueryParams('device')}`}>My VeeaHubs</LinkTab>
        </RoutedTabBar>
        <Container solid className="p-10 lg:p-30">
            <Switch>
                <Route path={`${path}/meshes`}>
                    <MeshList />
                </Route>
                <Route path={`${path}/devices`}>
                    <DeviceList />
                </Route>
                <Route exact path={`${path}/`}><Redirect to={`${url}/meshes`} /></Route>
            </Switch>
        </Container>
    </>;
};
interface Props {}