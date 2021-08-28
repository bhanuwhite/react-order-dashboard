import * as React from 'react';


/**
 * Set the given class on the body element until
 * the component which called this hook is unmounted
 * or the className argument is changed.
 *
 * @param className class name to set to the body element.
 */
export function useBodyClass(className: string) {

    React.useEffect(() => {

        if (className.trim() === '') {
            return;
        }

        className.trim().split(' ').forEach(cls => document.body.classList.add(cls));

        return () => {
            className.trim().split(' ').forEach(cls => document.body.classList.remove(cls));
        };

    }, [className]);
}