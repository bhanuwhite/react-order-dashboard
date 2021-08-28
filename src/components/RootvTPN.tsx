import { hot } from 'react-hot-loader/root';
import { FC } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { StoreProvider } from '@/store/context';
import { FetcherProvider } from '@/fetcher';
import { Store } from '@/store';
import { VTPN } from './VTPN';
import { History } from './History';
import { InitEndpointsForFetcher } from '@/fetcher';
import { StripeProvider } from './StripeProvider';
import { RefreshPageInvite } from './RefreshPageInvite';
import { RefreshSession } from './RefreshSession';



// tslint:disable-next-line: variable-name
export const Root: FC<Props> = hot(({ store }) => (
<StripeProvider>
    <StoreProvider store={store}>
    <FetcherProvider>
        <InitEndpointsForFetcher />
        <RefreshSession />
        <Router>
            <History />
            <Switch>
                <Route path="/">
                    <VTPN />
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
