import { Store } from '@/store';
import { action } from 'mobx';
import { updateOneEntryWithClass } from '@/fetcher/endpoints/helpers';
import { MeshAvailableUpdatesState, MeshAvailableUpdatesProps } from '@/store/domain/enrollment';
import { Value } from '@/store/domain/_helpers';

/**
 * Empty the state that contains available software updates for mesh.
 * Callback used after software update is initiated, and makes sure that this fact is synced across all screens.
 * @param store Store
 * @param meshId a user's mesh UUID
 */
export function flushAvailableUpdates(store: Store, meshId: string) {
    action(() => {
        const updates: Value & MeshAvailableUpdatesProps = { id: meshId, updates: [] };
        updateOneEntryWithClass(store.domain.enrollment.availableUpdates.map, MeshAvailableUpdatesState, updates);
    })();
}