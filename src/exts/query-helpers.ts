export {};

declare global {
    interface URLSearchParams {
        /**
         * Returns the first value associated to the given search parameter and cast it to a number.
         * If this fails returns null.
         */
        getInt(name: string): number | null;
    }
}

URLSearchParams.prototype.getInt = function getInt(name: string) {
    const val = this.get(name);
    if (!val) {
        return null;
    }
    const res = parseInt(val, 10);
    if (Number.isNaN(res)) {
        return null;
    }
    return res;
};