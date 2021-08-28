import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import type { FetchError } from './fetch';


export interface FetchState {
    /**
     * True if the request is pending
     */
    loading: boolean
    /**
     * If defined, contains the fetch error.
     */
    error?: FetchError
}

export type StateChangeCallback = (newFetchState: FetchState) => void;

export class FetchObservers {

    private callbacks: StateChangeCallback[] = [];
    private notifyWaiters = new Subject<void>();

    /**
     * Add an observer that will be notified when a fetch has completed
     * for the endpoint they are interested in.
     * @param callback observer to call when a fetch completed.
     */
    addObserver(callback: StateChangeCallback) {
        this.callbacks.push(callback);
    }

    /**
     * Remove an observer that will be notified when a fetch has completed
     * for the endpoint they are interested in.
     * @param callback observer to call when a fetch completed.
     */
    removeObserver(callback: StateChangeCallback) {
        const index = this.callbacks.indexOf(callback);
        if (index > -1) {
            this.callbacks.splice(index, 1);
        }
    }

    notifyResult(fetchState: FetchState) {
        for (const callback of this.callbacks) {
            callback(fetchState);
        }
        if (!fetchState.loading) {
            this.notifyWaiters.next();
        }
    }

    waitNextFetch(): Promise<void> {
        return this.notifyWaiters.pipe(take(1)).toPromise();
    }

}