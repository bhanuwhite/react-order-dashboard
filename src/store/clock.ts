/**
 * A clock that ticks every minutes.
 *
 * Observers that listen to that clock will be refreshed
 * every minutes.
 *
 *
 * Note that observers can watch on this property if it's used
 * by computed properties.
 */
import { action, observable } from 'mobx';


export class Clock {

    /** A clock that ticks every minutes */
    minutes = observable.box(Math.floor(Date.now() / 60_000) * 60_000);

    /** A clock that ticks every seconds */
    seconds = observable.box(Date.now());

    constructor() {
        setInterval(this.tick.bind(this), 1000);
    }

    private tick() {
        action(() => {
            const now = Date.now();
            if (now - this.minutes.get() > 60_000) {
                this.minutes.set(now);
            }
            this.seconds.set(now);
        })();
    }
}

export const createClock = () => new Clock();