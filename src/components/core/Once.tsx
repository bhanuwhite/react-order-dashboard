import * as React from 'react';

/**
 * Execute a run function once `value` is equal to `equal`.
 * This is run as part of a React.useEffect so can be included
 * safely in a render step.
 *
 * This is useful to perform state changes that should be done
 * when a particular value changes, but the context requirement
 * depends of the control flow (and thus are better expressed as
 * part of the rendering flow).
 */
// tslint:disable-next-line: variable-name
export function Once<T>({ value, equal, run }: Props<T>) {
    React.useEffect(() => {
        if (value === equal) {
            run();
        }
    }, [value]);
    return null;
}

interface Props<T> {
    /**
     * Value to test against equal.
     */
    value: T
    /**
     * Equal should ideally be a constant
     * to avoid programming error. It should
     * never changed.
     */
    equal: T
    /**
     * Function to call when the condition is met.
     * If the condition is true after the render,
     * then the function is immediately called.
     */
    run(): void
}
