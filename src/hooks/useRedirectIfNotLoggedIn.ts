import * as React from 'react';
import type { Store } from '@/store';
import type { History } from 'history';
import { useStore } from './useStore';
import { useHistory } from 'react-router';


/**
 * React hook to redirect the user to the authentication page if the user
 * is not logged in.
 *
 * @param store store to use, if set, this argument should not become undefined.
 * @param history history to use, if set, this argument should not become undefined.
 */
export function useRedirectIfNotLoggedIn(
    store: Store = useStore(),
    history: History = useHistory(),
): void {

    React.useEffect(() => {
        // Hard redirect if the user is not logged in.
        if (!store.view.activeuser.isLoggedIn && store.view.activeuser.isServerOnline) {
            const cpn = window.location.pathname;
            window.location.href = `/login/?prevLocation=${cpn}%23${history.location.pathname}`;
            return;
        }
    }, [store, history]);
}