// tslint:disable-next-line: max-line-length
// Extracted from https://github.com/mui-org/material-ui/blob/2082679d80db7848cf47187a128a22491bf0b492/packages/material-ui/src/utils/useEventCallback.js

import * as React from 'react';

const useEnhancedEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

/**
 * https://github.com/facebook/react/issues/14099#issuecomment-440013892
 *
 */
// tslint:disable-next-line: ban-types
export function useEventCallback(fn: Function) {
    const ref = React.useRef(fn);
    useEnhancedEffect(() => {
        ref.current = fn;
    });
    return React.useCallback((...args) => {
        const tmp = ref.current;
        return tmp(...args);
    }, []);
}