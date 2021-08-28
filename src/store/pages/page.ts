/**
 * Some of the fetch endpoints expect a query parameter named either `next` or `prev`.
 * Their responses have the following structure:
 *
 * ```json
 * {
 *     "data": <some api specific data>,
 *     "meta": {
 *         "nextCursor": <opaque cursor string>,
 *         "prevCursor": <opaque cursor string>
 *     }
 * }
 * ```
 *
 * This module provide helpers to correctly handle this data in the fetcher
 * and in the store.
 * @packageDocumentation
 */
import { QueryParams } from '@/fetcher/instance/util';
import { removeNextOrPrev } from './helpers';
import { Value } from '../domain/_helpers';


/**
 * Representation of a paginated result obtained from a backend.
 * This object can be referenced by multiple ids and can have one
 * of the following state:
 *
 *    * Partially initialized: we know the existence of that data set
 *      because another result points to it.
 *    * Fully initialized: we got the response from the backend.
 *
 * Page object are always part of a doubly-linked list. However, all
 * pages aren't part of the same doubly-linked list.
 *
 * They should be if the endpoint is the same.
 */
export class Page<T extends Value> {

    /** Endpoint this page works with */
    readonly endpoint: string;

    /** The next page opaque id */
    nextOpaqueId: string | null = null;

    /** The previous page opaque id  */
    prevOpaqueId: string | null = null;

    /** Reference to the previous page if there's one */
    private prevPage: Page<T> | null = null;

    /** Reference to the next page if there's one */
    private nextPage: Page<T> | null = null;

    /** True if the page was fetched once. Otherwise it's a placeholder */
    private isValid = false;

    /**
     * Resources referenced by the page. There's an indirection because resources
     * can also be fetched directly. This should really be seen as `T[]`.
     */
    private refs: string[] = [];

    /** Create a new page */
    static newPage<T extends Value>(
        query: QueryParams,
        nextOpaqueId: string | null,
        prevOpaqueId: string | null,
        cache: Map<string, Page<T>>,
    ): Page<T> {

        const fullendpoint = query.getEndpoint();
        const endpoint = removeNextOrPrev(fullendpoint);

        const page = cache.get(fullendpoint) ?? new Page<T>(endpoint);

        // Mark the page as valid
        page.isValid = true;

        // Add the page to the cache if not present.
        if (!cache.has(fullendpoint)) {
            cache.set(fullendpoint, page);
        }

        // Update or set the prev / next opaque ids
        page.nextOpaqueId = nextOpaqueId;
        page.prevOpaqueId = prevOpaqueId;

        // Do we have a next page?
        if (page.nextOpaqueId !== null) {
            const nextPage = page.nextPage ?? new Page<T>(endpoint);
            cache.set(page.nextEndpoint(), nextPage);
            page.nextPage = nextPage;
            nextPage.prevPage = page;
        } else {
            // Maybe we used to have a next page, make sure we remove it.
            // FIXME should we remove the previous page from the cache ??
            //       what could go wrong :/
            page.nextPage = null;
        }

        // Do we have a prev page ?
        if (page.prevOpaqueId !== null) {
            const prevPage = page.prevPage ?? new Page<T>(endpoint);
            cache.set(page.prevEndpoint(), prevPage);
            page.prevPage = prevPage;
            prevPage.nextPage = page;
        } else {
            // Maybe we used to have a prev page, make sure we remove it.
            page.prevPage = null;
        }

        return page;
    }

    /**
     * Visit the pages (first forward, then backward).
     * @param firstPage page where the visit starts at
     * @param visitor visitor callback if it returns true, the visit stop
     */
    static visitPages<T extends Value>(firstPage: Page<T>, visitor: (page: Page<T>) => boolean | void) {

        // Navigate forward first
        let currentPage: Page<T> | null = firstPage;
        do {
            if (visitor(currentPage)) {
                return;
            }
            currentPage = currentPage.nextPage;
        } while (currentPage);

        // Then backwards
        currentPage = firstPage.prevPage;
        while (currentPage) {
            if (visitor(currentPage)) {
                return;
            }
            currentPage = currentPage.prevPage;
        }
    }

    private constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    /**
     * Remove all the references stored in this page.
     */
    clearRefs() {
        this.refs.length = 0;
    }

    /**
     * Add a reference to the provided value. This is not
     * an actual JavaScript reference but an id.
     * @param value value to hold a "reference" to.
     */
    addRef(value: T) {
        this.refs.push(value.id);
    }

    /** Extract values associated with this cursor */
    values(map: Map<string, T>): T[] {
        return this.refs.map(ref => map.get(ref)).filterNullable();
    }

    /**
     * Returns an iterable over the references.
     */
    allRefs(): Iterable<string> {
        return this.refs;
    }

    /**
     * Returns the endpoint for the next page.
     */
    nextEndpoint(): string {

        if (this.nextOpaqueId == null) {
            console.error('API missuse of Page.nextEndpoint.');
            return this.endpoint;
        }

        const hasQuery = this.endpoint.indexOf('?') !== -1;
        if (hasQuery) {
            return `${this.endpoint}&next=${this.nextOpaqueId}`;
        }
        return `${this.endpoint}?next=${this.nextOpaqueId}`;
    }

    /**
     * Returns the endpoint for the previous page.
     */
    prevEndpoint(): string {

        if (this.prevOpaqueId == null) {
            console.error('API missuse of Page.prevEndpoint.');
            return this.endpoint;
        }

        const hasQuery = this.endpoint.indexOf('?') !== -1;
        if (hasQuery) {
            return `${this.endpoint}&prev=${this.prevOpaqueId}`;
        }
        return `${this.endpoint}?prev=${this.prevOpaqueId}`;
    }

    /**
     * Returns true if this page has a previous page.
     */
    hasPrev(): boolean {
        return this.prevOpaqueId !== null;
    }

    /**
     * Returns true if this page has a next page.
     */
    hasNext(): boolean {
        return this.nextOpaqueId !== null;
    }

    /**
     * Returns true if this page was fetched at least once.
     */
    wasFetched(): boolean {
        return this.isValid;
    }
}