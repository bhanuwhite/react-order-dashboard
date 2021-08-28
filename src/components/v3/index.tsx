import * as React from 'react';
import { FC } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useRedirectIfNotLoggedIn } from '@/hooks/useRedirectIfNotLoggedIn';
import { useStore } from '@/hooks/useStore';
import { logoutPrivafy } from '@/actions';
import { HeadTitle } from './core';
import { TopBar } from './TopBar';
import { SideBar } from './SideBar';
import { Help } from './Help';
import { Meshes } from './Meshes';
import { Devices } from './Devices';
import { Home } from './Home';
import { Privafy } from './Privafy';
import { Applications } from './Applications';
import { Settings } from './Settings';
import { Footer } from './Footer';
import { GlobalSearchMobile } from './TopBar/GlobalSearch/mobile';


// tslint:disable-next-line: variable-name
export const CCv3: FC<{}> = observer(({}) => {

    const store = useStore();
    const [ sideBarOpen, setSideBarOpen ] = React.useState(false);

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
            {/* <Offline />
            <Container>
                <Footer />
            </Container> */}
        </>;
    }

    const defaultGroupId = store.view.activeuser.defaultGroup;

    return <>
        <HeadTitle>Veea Control Center</HeadTitle>
        <TopBar onClickMenu={() => setSideBarOpen(true)} />
        <GlobalSearchMobile />
        <div className="flex items-start w-full lg:max-w-screen-xl md:px-4 xl:px-0 lg:mt-20 m-auto">
            <SideBar open={sideBarOpen} onClose={() => setSideBarOpen(false)} />
            <div className="flex-grow w-full pt-4 lg:min-h-[450px]">
                <Switch>
                    <Route path="/settings"><Settings /></Route>
                    <Route path="/applications"><Applications /></Route>
                    <Route path="/subscriptions"><Help /></Route>
                    <Route path="/locations"><Help /></Route>
                    <Route exact path="/help"><Help /></Route>
                    <Route exact path="/debug-options"><Help /></Route>
                    <Route path="/:selectedGroupId/devices"><Devices /></Route>
                    <Route path="/:selectedGroupId/meshes"><Meshes /></Route>
                    <Route exact path="/:selectedGroupId/privafy"><Privafy /></Route>
                    <Route exact path="/devices"><Redirect to={`/${defaultGroupId}/devices`} /></Route>
                    <Route exact path="/meshes"><Redirect to={`/${defaultGroupId}/meshes`} /></Route>
                    <Route exact path="/privafy"><Redirect to={`/${defaultGroupId}/privafy`} /></Route>
                    <Route exact path="/:selectedGroupId"><Home /></Route>
                    {/*

                    We should provide redirect for those all routes.

                    <Route exact path="/cc/help"><Help /></Route>
                    <Route exact path="/cc/invites"><Invitations /></Route>
                    <Route exact path="/cc/account"><Account /></Route>
                    <Route path="/cc/applications/"><ApplicationsAdministration /></Route>
                    <Route path="/cc/admin/"><Administration /></Route>
                    <Route exact path="/cc/feature-preview"><FeaturePreview /></Route>
                    <Route exact path="/cc/debug-options"><DebugOptions /></Route>
                    <Route path="/cc/:selectedGroupId/devices/mesh/:meshId"><Mesh /></Route>
                    <Route path="/cc/:selectedGroupId/devices/device/:deviceId"><Device /></Route>
                    <Route path="/cc/:selectedGroupId/devices"><Devices /></Route>
                    <Route exact path="/cc/:selectedGroupId/privafy"><Privafy /></Route>
                    <Route exact path="/cc/devices"><Redirect to={`/cc/${defaultGroupId}/devices`} /></Route>
                    <Route exact path="/cc/:selectedGroupId"><Home /></Route>
                    <Route exact path="/cc"><Redirect to={`/cc/${defaultGroupId}`} /></Route>
                    <Route path="/cc/*"><NotFound /></Route> */}
                </Switch>
                <Footer />
            </div>
        </div>
    </>;
});