import * as React from 'react';


/**
 * A simple helper to hold an index value. The setter
 * ensures that you can never set a negative value.
 *
 * @param initialValue initial value for the index.
 */
export function useIndex(initialValue = 0): UseIndexHook {

    const [ index, setRawIndex ] = React.useState(initialValue);

    function setIndex(newValue: number) {
        setRawIndex(Math.max(newValue, 0));
    }

    return [ index, setIndex ];
}

type UseIndexHook = [ number, (newValue: number) => void ];