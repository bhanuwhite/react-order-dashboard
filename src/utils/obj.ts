/**
 * Update a property in an object in a typesafe way.
 * @param obj object to update
 * @param key key to set
 * @param value new value
 */
export function setProp<T, K extends keyof T>(obj: T, key: K, value: T[K]) {
    // Yes it literaly is this simple snippet of code but without
    // the constraints on the type parameters as it is done in the
    // function signature of setProp, the expression below doesn't
    // compile because typescript complains about a missing type
    // signature.
    obj[key] = value;
}

/**
 * Update properties of an object in a typesafe way. The implementation
 * assumes only POJO are used (to avoid the hasOwnProperty check)
 *
 * @param obj object to update
 * @param from source to update from
 */
export function updateProps<T>(obj: T, from: T) {

    // Same as for setProp defined above, this function
    // doesn't do much.

    // tslint:disable-next-line: forin
    for (const prop in from) {
        const tp = prop as keyof T;
        setProp(obj, tp, from[tp]);
    }
}