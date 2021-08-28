import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { Route, Switch, Redirect } from 'react-router';
import { useStore } from '@/hooks/useStore';
import { useInvitationsFetcher } from '@/hooks/fetchers';
import { minutes } from '@/utils/units';
import { PageNotFound } from '../PageNotFound';
import { NotAllowed } from '../NotAllowed';
import { RoutedTabBar, LinkTab } from '../core';
import { Account } from './Account';
import { Invitations } from './Invitations';


// tslint:disable-next-line: variable-name
export const Settings: FC<{}> = observer(({}) => {

    const store = useStore();
    const userHasPartnerAdminPermissions = store.view.activeuser.hasPartnerAdminFeature;
    const userHasWhitelistFeature = store.view.activeuser.hasWhitelistFeature;

    const page = <SettingsPage userHasWhitelistFeature={userHasWhitelistFeature}
        userHasPartnerAdminPermissions={userHasPartnerAdminPermissions}
    />;

    return <Switch>
        <Route exact path="/settings"><Redirect to="/settings/account" /></Route>
        <Route exact path="/settings/account">{page}</Route>
        <Route exact path="/settings/invites">{page}</Route>
        <Route path="/settings/groups">{page}</Route>
        <Route path="/settings/partners">
            {userHasPartnerAdminPermissions ? page : <NotAllowed />}
        </Route>
        <Route path="/settings/feature-preview">{page}</Route>
        <Route path="/settings/whitelist">
            {userHasWhitelistFeature ? page : <NotAllowed />}
        </Route>
        <Route path="*"><PageNotFound /></Route>
    </Switch>;
});


// tslint:disable-next-line: variable-name
const SettingsPage: FC<Props> = observer(({ userHasPartnerAdminPermissions, userHasWhitelistFeature }) => {

    const store = useStore();
    const invitationsCount = store.domain.invitations.pendingCount;

    // Fetch invitations
    useInvitationsFetcher({ pollInterval: minutes(10) });

    return <div className="mx-4 md:mx-0 mb-4">
        <h1 className="text-2xl font-medium mb-4">Settings</h1>
        <div className="rounded border dark:bg-gray-900 bg-white border-solid dark:border-gray-700 border-gray-300 py-4 px-4">
            <RoutedTabBar tabsClassName="space-x-6" className="mb-4">
                <LinkTab to="/settings/account">My Account</LinkTab>
                <LinkTab to="/settings/invites" badge={invitationsCount > 0 ? invitationsCount : undefined}>
                    Invites
                </LinkTab>
                <LinkTab to="/settings/groups">Groups</LinkTab>
                {userHasPartnerAdminPermissions && <LinkTab to="/settings/partners">Partners</LinkTab>}
                <LinkTab to="/settings/feature-preview">Feature Preview</LinkTab>
                {userHasWhitelistFeature && <LinkTab to="/settings/whitelist">Whitelist</LinkTab>}
            </RoutedTabBar>
            <Switch>
                <Route exact path="/settings/account"><Account /></Route>
                <Route exact path="/settings/invites"><Invitations /></Route>
                <Route path="/settings/groups">TODO</Route>
                <Route path="/settings/partners">TODO</Route>
                <Route path="/settings/feature-preview">TODO</Route>
                <Route path="/settings/whitelist">TODO</Route>
            </Switch>
        </div>
    </div>;
});

interface Props {
    userHasPartnerAdminPermissions: boolean
    userHasWhitelistFeature: boolean
}