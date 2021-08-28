import * as React from 'react';
import { FC } from 'react';
import { useStore } from '@/hooks/useStore';
import { refreshSession } from '@/actions/refresh-session';
import { pageVisibility } from '@/utils/pageVisibility';


// tslint:disable-next-line: variable-name
export const RefreshSession: FC<Props> = ({}) => {
    const store = useStore();
    const refreshSessionInterval = window.REFRESH_SESSION_INTERVAL ?? 50 * 60 * 1000; // Default to 50 minutes

    React.useEffect(() => {

        const intervalId = setInterval(() => {
            // Refresh the session while the token is visible. If the page is not visible,
            // skip the refresh. This means that the user will most likely be disconnected.
            if (pageVisibility === 'visible') {
                refreshSession(store);
            }
        }, refreshSessionInterval);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return null;
};

interface Props {}