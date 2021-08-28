export {};

declare global {
    interface Array<T> {
        /** Returns an array where nullable elements have been removed. */
        filterNullable(): NonNullable<T>[];
        /** Check if the two arrays are equals. */
        equals<U>(other: U[]): boolean;
        /** Remove all elements from this array. */
        clear(): void
        /** Check if a predicate is true for all elements in the array */
        all(predicate: (value: T, index: number, array: T[]) => unknown): boolean
    }
}

Array.prototype.filterNullable = function filterUndefined() {
    return this.filter(val => val !== undefined && val !== null);
};

Array.prototype.equals = function equals(other) {
    if (other.length !== this.length) {
        return false;
    }
    for (let i = 0; i < this.length; ++i) {
        if (this[i] !== other[i]) {
            return false;
        }
    }
    return true;
};

Array.prototype.all = function all(predicate: (value: any, index: number, array: any[]) => unknown) {
    return !this.some((value, index, array) => !predicate(value, index, array));
};

Array.prototype.clear = function clear() {
    this.length = 0;
};