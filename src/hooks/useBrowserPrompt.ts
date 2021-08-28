import * as React from 'react';


/**
 * Ask the user confirmation before they leave the page.
 * This work if the user is navigating away from the SPA (so to a different domain or refreshing the page)
 * @param message message to show to the user
 */
export function useBrowserPrompt(hasUserMadeChanges = true, message: string = ''): void {

    React.useEffect(() => {

        function beforeUnload(ev: BeforeUnloadEvent) {
            ev.preventDefault();
            ev.returnValue = message;
        }

        if (hasUserMadeChanges) {
            window.addEventListener('beforeunload', beforeUnload);
        }

        return () => {
            if (hasUserMadeChanges) {
                window.removeEventListener('beforeunload', beforeUnload);
            }
        };
    }, [hasUserMadeChanges, message]);
}