import * as React from 'react';

export function useScrollToTop() {
    React.useLayoutEffect(() => window.scrollTo(0, 0), []);
}