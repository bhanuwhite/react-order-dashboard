import { Layer } from './layer';
import { getPathname, getQueryParams, QueryParams } from './util';

export interface Merger {
    layer: Layer
    merge: MergeOperation
}

export type MergeOperation = (reqsParams: { [key: string]: string }[], queryParams: QueryParams) => string[] | string;

interface RequestDataForMerge {
    originalQueries: string[]
    reqsParams: { [key: string]: string }[]
    queryParams: QueryParams
}
type MergerId = number;


/**
 * This utility class match a request
 * against a merge utility
 */
export class RequestMerger {

    // Mergers registered their id is their position in this list
    private mergers: Merger[] = [];

    // Requests that have been matched to a merger.
    private matchedRequests = new Map<MergerId, RequestDataForMerge[]>();

    registerMerger(matcher: string, merge: MergeOperation) {
        this.matchedRequests.set(this.mergers.length, []);
        this.mergers.push({ layer: new Layer(matcher), merge });
    }

    /**
     * Match the provided endpoint to one of the merger (returning true if one was found)
     * If successful, the matchers param and query params will be kept inside
     * @param endpoint endpoint to match
     */
    matchAndStoreResult(endpoint: string): boolean {
        const pathname = getPathname(endpoint);
        const queryParams = getQueryParams(endpoint);

        for (let mergerId = 0; mergerId < this.mergers.length; ++mergerId) {
            const { layer } = this.mergers[mergerId];
            const result = layer.match(pathname);
            if (result.type === 'success') {
                const mergeGroups = this.matchedRequests.get(mergerId)!;

                // Check if this request match any existing group
                let added = false;
                for (const group of mergeGroups) {
                    if (group.queryParams.getQueryPart() === queryParams.getQueryPart()) {
                        group.reqsParams.push(result.params);
                        group.originalQueries.push(endpoint);
                        added = true;
                    }
                }

                if (!added) {
                    mergeGroups.push({
                        originalQueries: [endpoint],
                        reqsParams: [result.params],
                        queryParams,
                    });
                }
                return true;
            }
        }

        return false;
    }

    mergeMatchedQueriesAndClear(processQuery: (newEndpoints: string[], originalQueries: string[]) => void) {
        for (const [mergeId, data] of this.matchedRequests) {
            const { merge } = this.mergers[mergeId];

            for (const { reqsParams, queryParams, originalQueries } of data) {
                const newEndpoints = merge(reqsParams, queryParams);
                if (Array.isArray(newEndpoints)) {
                    processQuery(newEndpoints, originalQueries);
                } else {
                    processQuery([newEndpoints], originalQueries);
                }
            }
            data.clear();
        }
    }
}