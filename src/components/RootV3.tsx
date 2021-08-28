import { hot } from 'react-hot-loader/root';
import { FC } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { StoreProvider } from '@/store/context';
import { FetcherProvider, InitEndpointsForFetcher } from '@/fetcher';
import { Store } from '@/store';
import { History } from './History';
import { StripeProvider } from './StripeProvider';
import { RefreshPageInvite } from './RefreshPageInvite';
import { RefreshSession } from './RefreshSession';
import { RefreshOnboardingNeeded } from './RefreshOnboardingNeeded';
import { Demo } from './v3/Demo';
import { CCv3 } from './v3';


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
                <Route path="/demo"><Demo /></Route>
                <Route path="/"><CCv3 /></Route>
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
