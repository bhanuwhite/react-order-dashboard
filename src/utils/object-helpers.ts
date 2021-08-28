import { Dictionary, objectKeys } from '@/utils/types';


/**
 * Map an object to a dictionary and default initialize the value to `defaultValue`.
 * @param dict dictionary.
 * @param defaultValue default value to use for the new type
 */
export function defaultObjFrom<V, T, D>(dict: T, defaultValue: D): Dictionary<keyof T, V | D> {
    return objectKeys(dict).reduce((res, fieldName) => {
        res[fieldName] = defaultValue;
        return res;
    }, {} as { [key in keyof T]: V | D });
}