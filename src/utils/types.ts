// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type Class<T> = new(...args: any[]) => T;
export type StringValidator = (arg: string) => boolean | string;

export type Dictionary<K extends string | number | symbol, V> = { [key in K]: V };

export function isIn<T>(key: string | number | symbol, obj: T): key is keyof T {
    return key in obj;
}

/**
 * A better typed Object.keys.
 * @param obj obj to take the keys of
 */
export function objectKeys<T>(obj: T): (keyof T)[] {
    return Object.keys(obj) as (keyof T)[];
}