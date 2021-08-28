import { useLocation } from 'react-router-dom';
import { Store } from '@/store';
import { getSelectedGroupIdFromPathname } from '@/utils/selected-group';

/**
 * Returns the selected group id if there's one in the URL
 * or the default group id from the store.
 *
 * Most component should not use this hook. This hook is for
 * component that are outside a Route starting with /cc/:selectedGroupId
 * (like the TopBar for instance)
 */
export function useSelectedGroupId(store: Store) {
    const location = useLocation();
    const match = getSelectedGroupIdFromPathname(location.pathname);
    if (match) {
        return match;
    }
    if (store.view.selectedGroup.groupId !== '') {
        return store.view.selectedGroup.groupId;
    }
    return store.view.activeuser.defaultGroup;
}