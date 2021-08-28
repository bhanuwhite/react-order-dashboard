import * as React from 'react';
import { FC } from 'react';
import { FetcherInstance } from './instance';
import { useStore } from '@/hooks/useStore';


const fetcherContext = React.createContext<FetcherInstance | null>(null);

/**
 * Provide a FetcherInstance for the all application.
 * We use a React context to facilitate testing.
 */
// tslint:disable-next-line: no-shadowed-variable variable-name
export const FetcherProvider: FC<{ fetcherInstance?: FetcherInstance }> = ({ fetcherInstance, children }) => {

    const store = useStore();

    return <fetcherContext.Provider value={fetcherInstance ?? new FetcherInstance(store)}>
        {children}
    </fetcherContext.Provider>;
};

/**
 * Return the fetcher instance or throw if FetcherProvider was not
 * mounted in the React tree.
 */
export function useFetcherInstance() {
    const instance = React.useContext(fetcherContext);
    if (!instance) {
        throw new Error('FetcherProvider not set in parent hiearachy');
    }
    return instance;
}