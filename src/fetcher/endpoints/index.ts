import React, { FC } from 'react';
import { useStore } from '@/hooks/useStore';
import { useFetcherInstance } from '../context';
import { handleESEndpoints } from './es-endpoints';
import { handleMASEndpoints } from './mas-endpoints';
import { handleSelfEndpoints } from './self-endpoints';
import { handleGroupServiceEndpoints } from './groupservice-endpoints';
import { handleACSEndpoints } from './acs-endpoints';
import { handleVFFEndpoints } from './vff-endpoints';


// tslint:disable-next-line: variable-name
export const InitEndpointsForFetcher: FC<{}> = () => {

    /**
     * We only care about the reference to the root store.
     * The root store never changes, so there's no need for
     * this component to be an observer.
     */
    const store = useStore();
    const instance = useFetcherInstance();

    React.useEffect(() => {
        handleESEndpoints(instance, store);
        handleACSEndpoints(instance, store);
        handleMASEndpoints(instance, store);
        handleSelfEndpoints(instance, store);
        handleGroupServiceEndpoints(instance, store);
        handleVFFEndpoints(instance, store);
        return () => {
            instance.clearHandlers();
        };
    }, [instance, store]);

    return null;
};