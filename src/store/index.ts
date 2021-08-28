import * as moment from 'moment';
import { configure, action } from 'mobx';
import { createView, ViewStore } from './view';
import { createDomain, DomainStore } from './domain';
import { createHistory, HistoryStore } from './history';
import { createDerived, DerivedStore } from './derived';
import { createPages, PagesStore } from './pages';
import { createClock, Clock } from './clock';

if (process.env.NODE_ENV !== 'production') {
    // Make sure the store is only accessed when using actions.
    configure({ enforceActions: 'always' });
    (window as any).$moment = moment;
}


export function createStore(): Store {

    const clock = createClock();
    const view = createView();
    const domain = createDomain();
    const history = createHistory();
    const pages = createPages();
    const derived = createDerived(domain.vmeshes, domain.enrollment, domain.nodes);

    const store: Store =  {
        clock,
        view,
        domain,
        history,
        derived,
        pages,
    };

    if (process.env.NODE_ENV !== 'production') {
        // Provide access in the dev tools
        (window as any).$debugMobxStore = store;
        (window as any).$action = action;
    }

    return store;
}

export interface Store {
    /**
     * A clock to force refresh a status. It has two properties
     * that can be observed, one that tick every minutes another
     * that tick every seconds.
     */
    clock: Clock
    /**
     * Contains all cursors as returned by the various backend endpoints.
     */
    pages: PagesStore
    /**
     * Contains data that components / actions wants to share
     * with other components but that aren't populated by
     * fetchers.
     */
    view: ViewStore
    /**
     * Contains data fetched from the various services.
     * This data is only modified by the `Fetcher`'s
     * response handlers. See the `@/fetcher/endpoints`
     * module for example of response handlers.
     */
    domain: DomainStore
    /**
     * Contains information about the previous location
     * the user visited.
     */
    history: HistoryStore
    /**
     * This part of the store contains derived values
     * that depends on other part of the store or helper
     * functions.
     */
    derived: DerivedStore
}
