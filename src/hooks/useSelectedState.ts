import * as React from 'react';
import { observable, action } from 'mobx';
import { Page } from '@/store/pages';
import { StrictIterableIterator } from '@/utils/iters';



/**
 * React hook to handle selected state for paginated data.
 *
 * @param page current page.
 */
export function useSelectedStateForPaginatedData(page: Page<any> | undefined): SelectedStateHook {

    const [ state ] = React.useState(action(() => new SelectedState(page)));

    // When the page has changed we update the current page
    React.useEffect(() => {
        state.setPage(page);
    }, [page]);

    // If the endpoint change we clear the selection
    React.useEffect(() => {
        state.deselectAll();
    }, [page?.endpoint]);

    return state;
}

interface SelectedStateHook {
    /** Number of items selected */
    count(): number
    /** Returns true if the provided id is selected */
    isSelected(id: string): boolean
    /** Select the given id */
    select(id: string): void
    /** toggle selected state for an id, if value is provided it set it to that value instead */
    toggle(id: string, value?: boolean): void
    /** select all item on the current page */
    selectAllOnActivePage(): void
    /** select all item that have been fetched across pages */
    selectAllFetched(): void
    /** deselect all */
    deselectAll(): void
    /** Are all elements from all pages selected? */
    allSelected(): boolean
    /** Returns an iterator over ids. (so that the underlying impl can any between array/map/set) */
    ids(): StrictIterableIterator<string, void>
}

/**
 * We use this class to avoid generating too many allocations
 * on each render. The fact that we use a class means we don't
 * allocate any closure on each render. We also create the instance
 * in the callback provided to useState to avoid allocating there
 * as well.
 *
 * Not sure if this is worth it though, but it shows how we can
 * reduce memory pressure if we start having issues.
 *
 * See https://stackoverflow.com/questions/18970509/memory-allocation-for-javascript-types
 * for detailed examples
 */
class SelectedState implements SelectedStateHook {

    constructor(page: Page<any> | undefined) {
        this.currentPage = page ?? null;
    }

    private state = observable.set<string>();

    @observable
    private currentPage: Page<any> | null;

    /** This property is initialized in the ctor. This has to be a lambda to bind this */
    count = () => {
        return this.state.size;
    }

    /** This property is initialized in the ctor. This has to be a lambda to bind this */
    isSelected = (id: string) => {
        return this.state.has(id);
    }

    /** This property is initialized in the ctor. This has to be a lambda to bind this */
    select = (id: string) => {
        action(() => {
            this.state.add(id);
        })();
    }

    /** This property is initialized in the ctor. This has to be a lambda to bind this */
    toggle = (id: string, value?: boolean) => {
        action(() => {
            if (typeof value === 'undefined') {
                if (this.state.has(id)) {
                    this.state.delete(id);
                } else {
                    this.state.add(id);
                }
            } else if (value) {
                this.state.add(id);
            } else {
                this.state.delete(id);
            }
        })();
    }

    /** This property is initialized in the ctor. This has to be a lambda to bind this */
    setPage = (page: Page<any> | undefined) => {
        if (this.currentPage !== page) {
            action(() => {
                this.currentPage = page ?? null;
            })();
        }
    }

    /** This property is initialized in the ctor. This has to be a lambda to bind this */
    selectAllOnActivePage = () => {
        const iter = this.currentPage?.allRefs();
        if (iter) {
            action(() => {
                for (const id of iter) {
                    this.state.add(id);
                }
            })();
        }
    }

    /** This property is initialized in the ctor. This has to be a lambda to bind this */
    selectAllFetched = action(() => {
        if (this.currentPage) {
            Page.visitPages(this.currentPage, page => {
                for (const id of page.allRefs()) {
                    this.state.add(id);
                }
            });
        }
    });

    /** This property is initialized in the ctor. This has to be a lambda to bind this */
    deselectAll = () => {
        action(() => {
            this.state.clear();
        })();
    }

    /** This property is initialized in the ctor. This has to be a lambda to bind this */
    allSelected = () => {

        if (!this.currentPage) {
            return false;
        }

        // We go over all pages, check that we have obtained all of them
        // if we haven't then the answer is false (as we haven't selected any item in the next page)
        // If we have all pages, then we check the ids. If all are marked as selected, then yep
        // everything was selected :)

        let allFetched = true;
        Page.visitPages(this.currentPage, page => {
            allFetched = allFetched && page.wasFetched();

            // Stop visiting if at least one page wasn't fetched.
            return !allFetched;
        });

        if (!allFetched) {
            return false;
        }

        let allIncluded = true;
        Page.visitPages(this.currentPage, page => {
            for (const ref of page.allRefs()) {
                allIncluded = allIncluded && this.state.has(ref);
            }

            // Stop visiting if at least one ref wasn't in the state.
            return !allIncluded;
        });

        return allIncluded;
    }

    /** This property is initialized in the ctor. This has to be a lambda to bind this */
    ids = () => this.state.values();
}