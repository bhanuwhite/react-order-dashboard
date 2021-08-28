import { observable } from 'mobx';

/**
 * Provide information not provided by
 * React-router such as the previous location.
 *
 * This is useful to implement link that can
 * be opened with a middle mouse click.
 *
 * Note that you should override the onClick event
 * to
 */
export interface HistoryStore {
    prevLocation?: string
}

export const createHistory = () => observable<HistoryStore>({});