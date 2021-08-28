import { ValidationError } from 'typesafe-schema';
import { ajax, AjaxError } from 'rxjs/ajax';
import { getPathname, getQueryParams, QueryParams } from './util';
import { Layer } from './layer';
import { inviteUserToRefreshPage } from '@/actions';
import { requireLoginResponse } from '@/schemas/self-api';
import { VERSION_MISMATCHED } from '@/consts';
import { Store } from '@/store';


export type EndpointData = string;

export interface FetchError {
    status: number
    message: string
}

interface ExpressLikeMatcher {
    layer: Layer
    responseHandler: ResponseHandler
    acceptHTTPErrors: boolean
}

export interface FetchResponse {
    /**
     * The body of the response
     */
    body: unknown

    /**
     * The status code of the response
     */
    status: number

    /**
     * XHR object used for the request.
     */
    xhr: XMLHttpRequest
}

export type ResponseHandler = (
    response: FetchResponse,
    reqParams: { [key: string]: string },
    queryParams: QueryParams,
) => Promise<Error | ValidationError | string | undefined>;

/**
 * This utility class send fetch request
 * and dispatch them between the response
 * handlers and nothing else.
 */
export class FetchAndResponseDispatcher {

    constructor(
        private store: Store,
    ) {}

    // This is a stack of handlers. They are processed in order until a match is found.
    private stack: ExpressLikeMatcher[] = [];

    pushMatcher(matcher: string, responseHandler: ResponseHandler, acceptHTTPErrors = false) {
        this.stack.push({ layer: new Layer(matcher), responseHandler, acceptHTTPErrors });
    }

    clearHandlers() {
        this.stack.length = 0;
    }

    fetch(endpoint: string): Promise<FetchError | undefined> {

        // Fetch the a new value.
        return new Promise((resolve) => {
            ajax({
                method: 'GET',
                url: endpoint,
                responseType: 'json',
                async: true,
                headers: { accept: 'application/json' },
            }).subscribe(val => {
                const body = val.response;
                const status = val.status;
                const xhr = val.xhr;
                this.handleAllResponses(endpoint, { body, status, xhr })
                    .then(v => resolve(v))
                    .catch(e => console.error(`Bug found!`, e));
            }, (err: AjaxError) => {
                const body = err.response;
                const status = err.status;
                const xhr = err.xhr;
                this.handleAllResponses(endpoint, { body, status, xhr })
                    .then(v => resolve(v))
                    .catch(e => console.error(`Bug found!`, e));
            });
        });
    }

    private async handleAllResponses(endpoint: EndpointData, val: FetchResponse): Promise<FetchError | undefined> {

        const status = val.status;

        this.checkHeaders(val.xhr);

        // Try to detect if the page should be refreshed.
        if (status === 401) {
            const resp = requireLoginResponse.validate(val.body);
            if (resp.type === 'success') {
                console.error(resp.value.message);
                inviteUserToRefreshPage(this.store, resp.value.code);
                return {
                    message: 'You have been logged out',
                    status,
                };
            }
        }

        // If status is 40x or 50x
        if (status > 399 && process.env.NODE_ENV === 'development') {
            const errMsg = `Got ${JSON.stringify(val.body)} (${status}) while fetching ${endpoint}`;
            console.error(errMsg);
        }

        // Match the request to a response handler
        // The response handler will have mutated the store
        // if successful
        const err = await this.handleResponse(endpoint, val);
        if (err) {
            return { message: err, status };
        }
    }

    // This async function should never reject, only resolve with the error if there's any.
    private async handleResponse(endpoint: EndpointData, val: FetchResponse): Promise<string | undefined> {

        const pathname = getPathname(endpoint);
        const queryParams = getQueryParams(endpoint);
        const isIn40xOR50xRange = val.status > 399;

        for (const { layer, responseHandler, acceptHTTPErrors } of this.stack) {

            const result = layer.match(pathname);
            if (result.type === 'success') {

                if (!acceptHTTPErrors && isIn40xOR50xRange) {

                    if (process.env.NODE_ENV === 'development') {
                        console.warn([
                            `Found handler for ${endpoint} but it doesn't support HTTP Error codes 40x or 50x`,
                            'If you want to handle those error codes, use:',
                            '',
                            `      instance.getWithHTTPErrors('/path/to/resource', async () => { ... });`,
                            '',
                            `instead of instance.get('/path/to/resource', async () => { ... });`,
                        ].join('\n'));
                    }

                    return `Got ${JSON.stringify(val.body)} (${status}) while fetching ${endpoint}`;
                }

                try {
                    // TODO: We should add a timeout here..
                    //       Something along the line of:
                    //
                    //           Promise.race(responseHandler(..), timeout(5s))
                    //
                    //       Unless we leave that up to the responseHandler (which is probably better)
                    const err = await responseHandler(val, result.params, queryParams);

                    // Log the error if any.
                    if (err) {
                        console.error(err);
                    }

                    return formatResponseHandlerErr(layer.pathDebug, err);
                } catch (err) {
                    err = err instanceof Error ? (err.stack ?? err.message) : `${err}`;
                    return err;
                }
            }
        }

        const noHandlerError = `No handler found for ${endpoint}`;
        console.error(noHandlerError);
        return noHandlerError;
    }

    private checkHeaders(xhr: XMLHttpRequest) {
        const version = xhr.getResponseHeader('X-Version');
        if (version && version !== process.env.EC_VERSION) {
            console.info(
                `Detected difference in versions: Backend is ${version}, but we are ${process.env.EC_VERSION}`,
            );
            inviteUserToRefreshPage(this.store, VERSION_MISMATCHED);
        }
    }
}

function formatResponseHandlerErr(layerPath: string, err: Error | string | ValidationError | undefined) {
    if (err instanceof Error) {
        return err.message;
    }
    if (isValidationError(err)) {
        return `In response handler of '${layerPath}', invalid payload at <code>${err.path}</code>: ${err.reason}`;
    }
    return err;
}

function isValidationError(err: string | ValidationError | undefined): err is ValidationError {
    return !!err && Object.hasOwnProperty.call(err, 'type');
}