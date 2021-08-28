import * as React from 'react';


export function useAction(
    action: () => Promise<ErrorOrSuccessProps>,
    deps: React.DependencyList,
) {

    // FIXME: Ideally this should go right in the store and
    //        we should show a toast if the operation run in
    //        the background (like when this hook is unmounted)
    const [ step, setStep ] = React.useState<Steps>({ kind: 'initial' });

    const reset = React.useCallback(() => setStep({ kind: 'initial' }), []);
    const exec = React.useCallback(async () => {
        try {
            setStep({ kind: 'loading' });
            const res = await action();
            const { success, ...rest } = res;
            setStep({
                kind: success ? 'success' : 'failure',
                ...rest,
            });
        } catch (err) {
            setStep({
                kind: 'failure',
                summary: 'Oops! There was an unexpected failure',
                description: `${err instanceof Error ? err.message : err}`,
            });
        }
    }, deps);

    return {
        exec,
        step,
        reset,
    };
}

interface ErrorOrSuccessProps {
    success: boolean
    summary: string
    description?: React.ReactNode
}

type Steps = Initial | Loading | Success | Failure;

interface Initial {
    kind: 'initial'
}

interface Loading {
    kind: 'loading'
}

export interface Success {
    kind: 'success'
    summary: React.ReactNode
    description?: React.ReactNode
}

export interface Failure {
    kind: 'failure'
    summary: React.ReactNode
    description?: React.ReactNode
}
