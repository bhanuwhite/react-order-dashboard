import { observable } from 'mobx';
import { Page } from './page';
import { QueryParams } from '@/fetcher/instance/util';
import { Value } from '../domain/_helpers';

/**
 * Contains the state for all active cursors in the
 * application.
 */
export class PagesStore {

    /**
     * Contains cached values of cursors.
     * If memory usage turns out to be high for certain usage,
     * we could consider writing an observable lru map (with fixed capacity)
     * and use it here.
     */
    private map = observable.map<string, Page<any>>();

    /**
     * Update the cache with the new entry for this cursor.
     * @param cursor cursor to add / update.
     */
    newPageFromResponse<T extends Value>(
        query: QueryParams,
        nextOpaqueId: string | null,
        prevOpaqueId: string | null,
    ): Page<T> {
        return Page.newPage<T>(query, nextOpaqueId, prevOpaqueId, this.map);
    }

    /**
     * Get a page instance by id. Empty ids are prohibited.
     * Ids are assumed to be of the form:
     *
     *      /path/to/api?next=<opaque cursor id>
     *      /path/to/api?prev=<opaque cursor id>
     *
     * All pages have two id that can fetch them, but pages are constructed
     * progressively.
     *
     * @param id id of the page to look up.
     */
    getPage<T extends Value>(id: string): Page<T> | undefined {

        if (process.env.NODE_ENV === 'development' && id === '') {
            throw new Error('Empty ids are prohibited');
        }

        return this.map.get(id);
    }
}

export const createPages = () => new PagesStore();

export { Page };