/**
 * Extract the pathname of the provided string.
 * The string isn't expected to be a url, instead it
 * will be of the form:
 *
 *      /path/to/api?query=param&otherparam
 *
 * @param pathnameandquery value to extract the pathname from
 */
export function getPathname(pathnameandquery: string): string {
    if (pathnameandquery[0] !== '/') {
        pathnameandquery = '/' + pathnameandquery;
    }
    const index = pathnameandquery.indexOf('?');
    if (index >= 0) {
        return pathnameandquery.slice(0, index);
    }
    return pathnameandquery;
}

/**
 * Extract the query of the provided string.
 * The string isn't expected to be a url, instead it
 * will be of the form:
 *
 *      /path/to/api?query=param&otherparam
 *
 * @param pathnameandquery value to extract the query from
 */
export function getQueryParams(pathnameandquery: string): QueryParams {
    const index = pathnameandquery.indexOf('?');
    if (index === -1) {
        return new QueryParams(pathnameandquery, pathnameandquery.length, {});
    }
    const query = new URLSearchParams(pathnameandquery.slice(index + 1));
    const res: { [key: string]: string | string[] } = {};

    query.forEach((val, key) => {
        if (key in res) {
            const oldVal = res[key];
            if (Array.isArray(oldVal)) {
                oldVal.push(val);
            } else {
                res[key] = [oldVal, val];
            }
        } else {
            res[key] = val;
        }
    });

    return new QueryParams(pathnameandquery, index, res);
}

export class QueryParams {

    constructor(
        private endpoint: string,
        private offset: number,
        private query: { [key: string]: string | string[] | undefined },
    ) {}

    getStringOrDefault(key: string, defaultValue: string = ''): string {
        const val = this.query[key];
        return typeof val === 'string' ? val : defaultValue;
    }

    getArrayOrDefault(key: string, defaultValue: string[] = []): string[] {
        const val = this.query[key];
        if (Array.isArray(val)) {
            return val;
        }
        if (typeof val === 'string') {
            return [val];
        }
        return defaultValue;
    }

    get(key: string) {
        return this.query[key];
    }

    has(key: string) {
        return typeof this.query[key] !== 'undefined';
    }

    getQueryPart(): string {
        return this.endpoint.slice(this.offset);
    }

    getEndpoint(): string {
        return this.endpoint;
    }
}