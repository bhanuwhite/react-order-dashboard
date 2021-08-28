/**
 * Create an operation that group elements of an array to a maximum of `count`
 * and returned the transform values in a single array.
 *
 * @param transform transformation to apply to the original array
 * @param count maximum number of element to group together
 */
export function groupEvery<T, V>(transform: (arr: T[]) => V, count: number): (arr: T[]) => V[] {
    return (arr) => {
        if (arr.length < count) {
            return [transform(arr)];
        }
        const result: V[] = [];
        let rest = 0;
        while (rest < arr.length) {
            result.push(transform(arr.slice(rest, rest + count)));
            rest += count;
        }
        return result;
    };
}

/**
 * Create an array of length end - start with the first
 * value being start and the final value being end-1.
 *
 * The function assumes end > start.
 *
 * @param start start of the range
 * @param end end of the range
 */
export function range(start: number, end: number): number[] {
    const res = [] as number[];

    for (let i = start; i < end; i++) {
        res.push(i);
    }

    return res;
}

/**
 * Create chunk of an array and return the created array.
 * @param arr initial array
 * @param count element to take for each chunk
 */
export function chunk<T>(arr: T[], count: number): T[][] {
    const res = [] as T[][];

    let j = -1;
    for (let i = 0; i < arr.length; i++) {
        if (i % count === 0) {
            res.push([]);
            j++;
        }
        res[j].push(arr[i]);
    }

    return res;
}