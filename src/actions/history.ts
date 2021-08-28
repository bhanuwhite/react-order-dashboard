import { action } from 'mobx';
import { Store } from '@/store';
import { getSelectedGroupIdFromPathname } from '@/utils/selected-group';

export const setPrevLocation = action((store: Store, prevLocation: string) => {
    store.history.prevLocation = prevLocation;
});

export const updateSelectedGroup = action((store: Store, currentPathname: string) => {
    const match = getSelectedGroupIdFromPathname(currentPathname);
    if (match) {
        store.view.selectedGroup.groupId = match;
    }
});