import { hot } from 'react-hot-loader/root';
import { FC } from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { StoreProvider } from '@/store/context';
import { FetcherProvider } from '@/fetcher';
import { Store } from '@/store';
import { Demo } from './demo/Demo';
import { Home } from './demo/Home';
import { CC } from './CC';
import { History } from './History';
import { InitEndpointsForFetcher } from '@/fetcher';
import { StripeProvider } from './StripeProvider';
import { RefreshPageInvite } from './RefreshPageInvite';
import { RefreshSession } from './RefreshSession';
import { RefreshOnboardingNeeded } from './RefreshOnboardingNeeded';



// tslint:disable-next-line: variable-name
export const Root: FC<Props> = hot(({ store }) => (
<StripeProvider>
    <StoreProvider store={store}>
    <FetcherProvider>
        <InitEndpointsForFetcher />
        <RefreshSession />
        <RefreshOnboardingNeeded />
        <Router>
            <History />
            <Switch>
                <Route path="/cc">
                    <CC />
                </Route>
                {process.env.NODE_ENV === 'development' ?
                    <Route path="/demo">
                        <Demo />
                    </Route> :
                    null
                }
                <Route path="/">
                    {process.env.NODE_ENV === 'development' ?
                        <Home /> :
                        <Redirect to="/cc" />
                    }
                </Route>
            </Switch>
            <RefreshPageInvite />
        </Router>
    </FetcherProvider>
    </StoreProvider>
</StripeProvider>
));
interface Props {
    store: Store
}
