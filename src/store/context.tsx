import * as React from 'react';
import { FC } from 'react';
import { Store } from '@/store';

export const storeContext = React.createContext<Store | null>(null);


// tslint:disable-next-line: no-shadowed-variable variable-name
export const StoreProvider: FC<{ store: Store }> = ({ store, children }) => (
    <storeContext.Provider value={store}>
        {children}
    </storeContext.Provider>
);
