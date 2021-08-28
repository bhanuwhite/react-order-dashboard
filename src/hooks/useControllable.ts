import * as React from 'react';


interface ControlledByCaller<T> {
    value: T
    onChange: (newValue: T) => void
}

interface ControlledByComponent<T> {
    defaultValue: T
}

export type ControllableArgs<T> = ControlledByCaller<T> | ControlledByComponent<T>;

// See https://react.christmas/2019/10
export function useControllableProp<T>(arg: ControllableArgs<T>): [T, (e: T) => void] {

    // While this seems a bit controversial as hooks should never
    // be called inside conditions/loops/nested function
    // What matters is that whatever the control flow, the number
    // of time a hook is called should be known *statically* and be
    // the same in each branch.
    //
    // In this particular custom hook, we have two branch
    // which both call twice the different hooks.
    if ('defaultValue' in arg) {
        // tslint:disable-next-line: react-hooks-nesting
        const [internalValue, setInternalValue] = React.useState(arg.defaultValue);
        const currentUpdater = (e: T) => setInternalValue(e);

        // tslint:disable-next-line: react-hooks-nesting
        React.useEffect(() => {
            // Do nothing
        }, [false, undefined]);

        return [internalValue, currentUpdater];
    } else {
        // tslint:disable-next-line: react-hooks-nesting
        const [, setInternalValue] = React.useState(arg.value);

        // tslint:disable-next-line: react-hooks-nesting
        React.useEffect(() => {
            setInternalValue(arg.value);
        }, [true, arg.value]);

        return [arg.value, arg.onChange];
    }
}