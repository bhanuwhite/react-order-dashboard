import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Route, Switch } from 'react-router-dom';
import { Container, HeadTitle, LinkTab, PageIntro, RoutedTabBar, Spinner } from '@/components/core';
import { NotFoundBody } from '@/components/CC/404';
import { UnauthorizedBody } from '@/components/CC/401';
import { useStore } from '@/hooks/useStore';
import { minutes } from '@/utils/units';
import { useUserPartnerIdFetcher } from '@/hooks/fetchers/acs-endpoints';
import { ACLAdministration } from '../ACLs';
import { Partner } from '../Partners/Partner';
import { Application, ApplicationFormModes } from './Application';
import { ApplicationsList } from './ApplicationsList';


// tslint:disable-next-line: variable-name
export const ApplicationsAdministration: FC<{}> = observer(() => {
    const store = useStore();
    const partnerId = store.view.activeuser.partnerId;
    const userId = store.view.activeuser.authUserId;

    // Refresh partner id while user is on the application page every 5 minutes
    const { loading } = useUserPartnerIdFetcher(userId, { pollInterval: minutes(5) });

    return <>
        <HeadTitle>Veea Control Center - Applications</HeadTitle>
        <PageIntro title="Applications" icon="icon-166_Hierarchy">
            Manage Applications, Testing Teams and more
        </PageIntro>
        <RoutedTabBar className="mt-15">
            <LinkTab to="/cc/applications">
                My Applications
            </LinkTab>
            <LinkTab to="/cc/applications/testing-teams">My Testing Teams</LinkTab>
            {partnerId && <LinkTab to={`/cc/applications/partner/${partnerId}`}>
                My Partner
            </LinkTab>}
        </RoutedTabBar>
        <Container solid className="p-10 lg:p-30">
            {partnerId ?
                <Switch>
                    <Route path="/cc/applications/testing-teams"><ACLAdministration /></Route>
                    <Route exact path="/cc/applications"><ApplicationsList /></Route>
                    <Route exact path="/cc/applications/new">
                        <Application formMode={ApplicationFormModes.New}/>
                    </Route>
                    <Route exact path="/cc/applications/:applicationId/version">
                        <Application formMode={ApplicationFormModes.NewVersion}/>
                    </Route>
                    <Route exact path="/cc/applications/:applicationId">
                        <Application formMode={ApplicationFormModes.Edit}/>
                    </Route>
                    <Route exact path="/cc/applications/partner/:partnerId">
                        <Partner />
                    </Route>
                    <Route path="/cc/applications/*">
                        <NotFoundBody />
                    </Route>
                </Switch> :
                loading ?
                <Spinner /> :
                <UnauthorizedBody />
            }
        </Container>
    </>;
});