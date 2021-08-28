import { Unreachable } from './exceptions';

// See https://github.com/microsoft/TypeScript/issues/33353 for more context
export interface StrictIterableIterator<T, TReturn> extends Iterator<T, TReturn> {
    [Symbol.iterator](): StrictIterableIterator<T, TReturn>;
}

/**
 * Return the next value assuming iteration can't be finished.
 * Throw an exception if it isn't.
 * @param iter IterableIterator
 */
export function iterNext<T>(iter: IterableIterator<T>): T {
    const res = iter.next();
    if (!res.done) {
        return res.value;
    }
    throw new Unreachable();
}