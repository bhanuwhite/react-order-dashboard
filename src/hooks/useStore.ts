import * as React from 'react';
import { storeContext } from '@/store/context';

export function useStore() {
    const store = React.useContext(storeContext);
    if (!store) {
        throw new Error('StoreProvider not set in parent hiearachy');
    }
    return store;
}