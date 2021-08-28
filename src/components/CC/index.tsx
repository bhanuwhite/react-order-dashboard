import * as React from 'react';
import { FC } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Container, Footer, HeadTitle } from '@/components/core';
import { useStore } from '@/hooks/useStore';
import { useRedirectIfNotLoggedIn } from '@/hooks/useRedirectIfNotLoggedIn';
import { Home } from './Home';
import { FeaturePreview } from './FeaturePreview';
import { DebugOptions } from './DebugOptions';
import { TopBar } from './TopBar';
import { Devices } from './Devices';
import { Mesh } from './Devices/Mesh';
import { Device } from './Devices/Device';
import { Privafy } from '../Privafy';
import { logoutPrivafy } from '@/actions';
import { Help } from './Help';
import { NotFound } from './404';
import { Account } from './Account';
import { observer } from 'mobx-react-lite';
import { OnboardingNeeded } from './OnboardingNeeded';
import { Offline } from './Offline';
import { Administration } from './Administration';
import { ApplicationsAdministration } from './Administration/Applications';
import { Invitations } from './Invitations';


export const CC: FC<Props> = observer(({}) => {

    const store = useStore();

    useRedirectIfNotLoggedIn(store);

    React.useEffect(() => {

        // If the user has just logged in, make sure we log out any existing
        // Privafy user session (might be another user).
        if (document.referrer.includes('auth')) {
            try {
                logoutPrivafy();
            } catch (err) {
                console.error(err);
            }
        }

    }, [store]);

    // Don't render anything if user is not logged in.
    if (!store.view.activeuser.isLoggedIn && store.view.activeuser.isServerOnline) {
        return null;
    }

    if (!store.view.activeuser.isServerOnline) {
        return <>
            <HeadTitle>Veea Control Center</HeadTitle>
            <Offline />
            <Container>
                <Footer />
            </Container>
        </>;
    }

    const defaultGroupId = store.view.activeuser.defaultGroup;

    return <>
        <TopBar />
        <HeadTitle>Veea Control Center</HeadTitle>
        <Switch>
            <Route exact path="/cc/help"><Help /></Route>
            <Route exact path="/cc/invites"><Invitations /></Route>
            <Route exact path="/cc/account"><Account /></Route>
            <Route path="/cc/applications/"><ApplicationsAdministration /></Route>
            <Route path="/cc/admin/"><Administration /></Route>
            {store.view.activeuser.onboardingNeeded ?
                <Route path="/"><OnboardingNeeded /></Route>
            : null}
            <Route exact path="/cc/feature-preview"><FeaturePreview /></Route>
            <Route exact path="/cc/debug-options"><DebugOptions /></Route>
            <Route path="/cc/:selectedGroupId/devices/mesh/:meshId"><Mesh /></Route>
            <Route path="/cc/:selectedGroupId/devices/device/:deviceId"><Device /></Route>
            <Route path="/cc/:selectedGroupId/devices"><Devices /></Route>
            <Route exact path="/cc/:selectedGroupId/privafy"><Privafy /></Route>
            <Route exact path="/cc/devices"><Redirect to={`/cc/${defaultGroupId}/devices`} /></Route>
            <Route exact path="/cc/:selectedGroupId"><Home /></Route>
            <Route exact path="/cc"><Redirect to={`/cc/${defaultGroupId}`} /></Route>
            <Route path="/cc/*"><NotFound /></Route>
        </Switch>
        <Container>
            <Footer />
        </Container>
    </>;
});
interface Props {}