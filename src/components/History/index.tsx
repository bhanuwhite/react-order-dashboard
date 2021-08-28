import * as React from 'react';
import { FC } from 'react';
import { useHistory } from 'react-router';
import { setPrevLocation, updateSelectedGroup } from '@/actions/history';
import { useStore } from '@/hooks/useStore';


/**
 * The `History` component does a couple of thing:
 *
 *  - It put in the store the previous location
 *    the user visited to allow anchors element (<Link>)
 *    that allow to navigate back to have the correct
 *    href set when the user open them in a new tab.
 *
 *  - It caches the selectedGroupId which is populated
 *    with the location (it always keep track of the
 *    last one present in the URL)
 *
 */
// tslint:disable-next-line: variable-name
export const History: FC<{}> = ({}) => {
    const history = useHistory();
    const store = useStore();
    React.useEffect(() => {
        let currentPathname = history.location.pathname;
        return history.listen((location) => {
            // Keep track of the previous location
            // Used to have correct anchor (that works on middle click)
            if (currentPathname !== location.pathname) {
                setPrevLocation(store, currentPathname);
                updateSelectedGroup(store, location.pathname);
                currentPathname = location.pathname;
            }
        });
    }, [history, store]);
    return null;
};