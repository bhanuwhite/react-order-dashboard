import { ObservableMap, action } from 'mobx';
import { HasFetcherProps, Value } from '@/store/domain/_helpers';
import { Class } from '@/utils/types';
import { updateProps } from '@/utils/obj';


type Id = string;

interface DomainState<V extends Value> {
    map: ObservableMap<Id, V>,
}

/**
 * Helper function that either inserts a new value or updates an existing one.
 *
 * If you need to update multiple entries and want to have entries that are
 * no longer present removed, used `updateMap` or `updateMapWithClass`.
 *
 * @param map map to update
 * @param value new value to insert
 */
export function updateOneEntry<V extends Value>(map: ObservableMap<Id, V>, value: V) {
    const existingEntry = map.get(value.id);

    action(() => {
        if (existingEntry) {
            // tslint:disable-next-line:forin
            for (const p in value) {
                existingEntry[p] = value[p];
            }
        } else {
            map.set(value.id, value);
        }
    })();
}

/**
 * Helper function that does the right thing when a store needs an existing
 * value to be updated. It either insert the new value or update an existing
 * one.
 *
 * If you need to update multiple entries and want to have entries that are
 * no longer present removed, used `updateMap` or `updateMapWithClass`.
 *
 * @param map map to update
 * @param value new value to insert
 */
export function updateOneEntryWithClass<
    P extends Value,
    C extends HasFetcherProps<Pick<P, Exclude<keyof P, 'id'>>>,
>(
    map: ObservableMap<Id, C>,
    ctor: Class<C>,
    value: P,
): C {
    const { id, ...props } = value;
    let existingEntry = map.get(id);

    action(() => {
        if (existingEntry) {
            updateProps(existingEntry.props, props as P);
        } else {
            existingEntry = new ctor(value);
            map.set(id, existingEntry);
        }
    })();

    return existingEntry!;
}

/**
 * Helper function that do the right thing when a store needs to be updated.
 * It takes care of removing entries that are no longer present in the result
 * and it update the field of the store entry instead of replacing it.
 * This is important for observers listening to new values added to the map
 * vs values updated.
 *
 * @param domain domain to update
 * @param values new values to use to populate the store
 * @param convertValue function to convert a value response to a store response
 */
export function updateMap<T extends DomainState<any>, U extends any[]>(
    domain: T,
    values: U,
    convertValue: (newValue: U[0]) => NonNullable<ReturnType<T['map']['get']>> | null,
) {
    type V = NonNullable<ReturnType<T['map']['get']>>;

    // Update a single value
    function doUpdateSingleEntry(newValue: U, newEntry: (id: Id, val: V) => void) {
        const transformedNewValue = convertValue(newValue);
        if (transformedNewValue === null) {
            return null;
        }
        const id: string = transformedNewValue.id;
        const existingEntry = domain.map.get(id);
        if (existingEntry) {
            // tslint:disable-next-line:forin
            for (const p in transformedNewValue) {
                existingEntry[p] = transformedNewValue[p];
            }
        } else {
            newEntry(id, transformedNewValue);
        }
        return id;
    }

    updateMapImpl(domain, values, doUpdateSingleEntry);
}

/**
 * Helper function that do the right thing when a store needs to be updated.
 * It takes care of removing entries that are no longer present in the result
 * and it update the field of the store entry instead of replacing it.
 * This is important for observers listening to new values added to the map
 * vs values updated.
 *
 * The difference with `updateMap` is that it accept a constructor which can
 * intercept the creation of the object. This is useful for class that have custom
 * observable behaviour (such as derived state).
 *
 * @param domain domain to update
 * @param values new values to use to populate the store
 * @param convertValue function to convert a value response to a store response
 */
export function updateMapWithClass<
    C extends HasFetcherProps<any>,
    T extends DomainState<C>,
    U extends any[],
>(
    domain: T,
    ctor: Class<C>,
    values: U,
    convertValue: (newValue: U[0]) => Value & C['props'] | null,
) {
    type V = NonNullable<ReturnType<T['map']['get']>>;

    // Update a single value
    function doUpdateSingleEntry(newValue: U, newEntry: (id: Id, val: V) => void) {
        const transformedNewValue = convertValue(newValue);
        if (transformedNewValue === null) {
            return null;
        }
        const id: string = transformedNewValue.id;
        const existingEntry = domain.map.get(id);
        if (existingEntry) {
            // tslint:disable-next-line:forin
            for (const p in transformedNewValue) {
                if (p !== 'id') {
                    existingEntry.props[p] = transformedNewValue[p];
                }
            }
        } else {
            // TODO: Why are we getting a compile time error if we remove the cast?
            //       TS should deduce that `NonNullable<ReturnType<T['map']['get']>>`
            //       is equal to `C`
            newEntry(id, new ctor(transformedNewValue) as V);
        }
        return id;
    }

    updateMapImpl(domain, values, doUpdateSingleEntry);
}

// Implementation detail.
function updateMapImpl<T extends DomainState<any>, U extends any[]>(
    domain: T,
    values: U,
    doUpdateSingleEntry: (
        newValue: U[0],
        newEntry: (id: Id, val: NonNullable<ReturnType<T['map']['get']>>) => void,
    ) => Id | null,
) {
    // Update all entries for the domain
    action(() => {
        const hasBeenRemoved = new Set<Id>(domain.map.keys());

        // Update all entries
        for (const entry of values) {
            const entryId = doUpdateSingleEntry(entry, (id, val) => {
                domain.map.set(id, val);
            });
            if (entryId !== null) {
                hasBeenRemoved.delete(entryId);
            }
        }

        // Remove entries who have been deleted.
        for (const id of hasBeenRemoved) {
            domain.map.delete(id);
        }

    })();
}