

/**
 * PollInterval is an utility class that generate
 * events whenever the smaller poll interval has
 * expired.
 */
export class PollInterval {

    private pollIntervals: number[] = [];
    private pollTimeoutId: number = 0;

    constructor(
        private next: () => void,
    ) {}

    /**
     * Add a new poll interval.
     * @param pollInterval poll interval to add.
     */
    addPollInterval(pollInterval: number) {
        this.pollIntervals.push(pollInterval);
        this.pollIntervals.sort((a, b) => a - b);

        // Schedule additional event we clear immediately because
        // in the context of the fetcher that mean that a request
        // will have been scheduled now already
        clearInterval(this.pollTimeoutId);
        this.pollTimeoutId = window.setInterval(this.next, this.smallerPollInterval);
    }

    /**
     * Remove a poll interval, the associated component unmounted
     * so we no longer to poll for him. But we might still need to poll
     * for others (albeit at a different pace).
     *
     * @param pollInterval interval to remove.
     */
    removePollInterval(pollInterval: number): number {
        const pi = this.pollIntervals.indexOf(pollInterval);
        if (pi === -1) {
            console.error(`Attempt to remove pollInterval value from a tracker but wasn't present! This is a bug and will break polling`);
        } else {
            this.pollIntervals.splice(pi, 1);
        }
        if (this.pollIntervals.length > 0) {
            if (this.pollIntervals[0] !== pollInterval) {
                clearInterval(this.pollTimeoutId);
                this.pollTimeoutId = window.setInterval(this.next, this.smallerPollInterval);
            }
        } else {
            clearInterval(this.pollTimeoutId);
        }
        return this.pollIntervals.length;
    }

    private get smallerPollInterval(): number {
        return this.pollIntervals[0];
    }
}