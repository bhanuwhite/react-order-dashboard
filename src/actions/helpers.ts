import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ajax, AjaxError, AjaxResponse } from 'rxjs/ajax';
import { inviteUserToRefreshPage } from '@/actions';
import { Store } from '@/store';
import { SchemaValidator, Any, TypeOf } from 'typesafe-schema';
import { requireLoginResponse } from '@/schemas/self-api';
import { acsErrorSchema, masStdResponseSchema, vffErrorSchema } from '@/schemas';
import { getStatusText } from 'http-status-codes';
import { pushError } from './errors';
import { groupsStdResponseSchema } from '@/schemas/groups-api';


const ACCEPT_HEADER = {
    Accept: 'application/json',
};

const JSON_HEADERS = {
    ...ACCEPT_HEADER,
    'Content-Type': 'application/json',
};

/**
 * Send a POST request to the MAS, expecting a standard response on the error path.
 * (It must pass the masStdSchema check).
 *
 * This method differ from postStdMasResponse only in that the `Content-Type` header
 * is set to `application/json`.
 *
 * @param endpoint endpoint to use for the POST
 * @param data data to send, should be a POJO or an instance of `FormData`. Will be automatically converted
 *             as appropriate depending on the Content-Type header.
 * @param schemaSuccess schema to validate the 'success' path (20x and 30x http status code)
 * @param headers extra headers to set in the request.
 */
export function postJSONStdMasResponse<T extends Any>(
    store: Store,
    endpoint: string,
    data: any,
    schemaSuccess: SchemaValidator<T>,
    headers: Header = {},
) {
    return postStdMasResponse(store, endpoint, data, schemaSuccess, { ...headers, ...JSON_HEADERS });
}

/**
 * Send a GET request to the MAS, expecting a standard response on the error path.
 * (It must pass the masStdSchema check).
 *
 * @param endpoint endpoint to use for the GET
 * @param schemaSuccess schema to validate the 'success' path (20x and 30x http status code)
 * @param headers extra headers to set in the request.
 */
export function getJSONStdMasResponse<T extends Any>(
    store: Store,
    endpoint: string,
    schemaSuccess: SchemaValidator<T>,
    headers: Header = {},
) {

    return requestStdMasResponse(
        store,
        () => ajax.get(endpoint, { ...headers, ...JSON_HEADERS }),
        endpoint,
        schemaSuccess,
    );
}

/**
 * Send a POST request to the MAS, expecting a standard response on the error path.
 * (It must pass the masStdSchema check).
 *
 * @param endpoint endpoint to use for the POST
 * @param data data to send, should be a POJO or an instance of `FormData`. Will be automatically converted
 *             as appropriate depending on the Content-Type header. If that header is not set, the default is
 *             set based on the type of data, see RxJs doc about ajax.post().
 * @param schemaSuccess schema to validate the 'success' path (20x and 30x http status codes)
 * @param headers extra headers to set in the request.
 */
export function postStdMasResponse<T extends Any>(
    store: Store,
    endpoint: string,
    data: any,
    schemaSuccess: SchemaValidator<T>,
    headers: Header = {},
) {

    return requestStdMasResponse(
        store,
        () => ajax.post(endpoint, data, { ...ACCEPT_HEADER, ...headers }),
        endpoint,
        schemaSuccess,
    );
}

 /**
  * Send a multi-part form data POST request to the MAS, expecting a standard response on the error path.
  * (It must pass the masStdSchema check).
  *
  * @param store
  * @param endpoint endpoint to use for the POST
  * @param data data to send, should be an instance of `FormData`. Will be automatically converted
  *             as appropriate depending on the Content-Type header. If that header is not set, the default is
  *             set based on the type of data, see RxJs doc about ajax().
  * @param schemaSuccess schema to validate the 'success' path (20x and 30x http status codes)
  * @param headers extra headers to set in the request.
  * @param responseType `text` or `json`
  * @param setProgressCallback optional setState handler for our custom progress bar (0-100)
  */
export function postMultipartFormDataMasResponse<T extends Any>(
    store: Store,
    endpoint: string,
    data: FormData,
    schemaSuccess: SchemaValidator<T>,
    headers: Header = {},
    responseType: 'text' | 'json' = 'json',
    setProgressCallback?: (progress: number) => void,
) {

    if (responseType === 'json') {
        headers = { ...headers, ...ACCEPT_HEADER };
    }

    return requestStdMasResponse(
        store,
        () => ajax({
            url: endpoint,
            body: data,
            headers,
            responseType,
            method: 'POST',
            createXHR: () => {
                const xhr = new XMLHttpRequest();
                xhr.onprogress = (ev: ProgressEvent<EventTarget>) => {
                    if (setProgressCallback) {
                        const progressNumber = Math.round((100 * ev.loaded) / ev.total);
                        setProgressCallback(progressNumber);
                    }
                };
                return xhr;
            },
        }),
        endpoint,
        schemaSuccess,
    );
}

export interface PlainResponse {
    raw: string
    type: string
}

/**
 * Send a GET request to the MAS, expecting a standard response on the error path.
 * (It must pass the masStdSchema check).
 *
 * @param endpoint endpoint to use for the GET
 * @param schemaSuccess schema to validate the 'success' path (20x and 30x http status code)
 * @param headers extra headers to set in the request.
 */
export function getPlainTextStdMasResponse(
    store: Store,
    endpoint: string,
    headers: Header = {},
): Promise<RequestResult<PlainResponse>> {

    headers = { ...headers, accept: 'text/*' };

    return ajax({
        url: endpoint,
        headers,
        responseType: 'text',
    }).pipe(

        // On the happy path, no validation, it's just text
        map(ajaxResp => {
            return {
                success: true as const,
                response: {
                    raw: ajaxResp.response,
                    type: ajaxResp.xhr.getResponseHeader('content-type') || '',
                },
            };
        }),

        // If there was an error capture it and validate the response with the
        // schema for errors.
        catchError((err: AjaxError) => captureError(err, store, endpoint)),

    ).toPromise();
}

export interface ArrayBufferResponse {
    raw: ArrayBuffer
    type: string
}

/**
 * Send a GET request to the MAS, expecting a standard response on the error path.
 * (It must pass the masStdSchema check).
 *
 * @param endpoint endpoint to use for the GET
 * @param schemaSuccess schema to validate the 'success' path (20x and 30x http status code)
 * @param headers extra headers to set in the request.
 */
export function getArrayBufferStdMasResponse(
    store: Store,
    endpoint: string,
    headers: Header = {},
): Promise<RequestResult<ArrayBufferResponse>> {

    return ajax({
        url: endpoint,
        headers,
        responseType: 'arraybuffer',
    }).pipe(

        // On the happy path, no validation, since we cannot validate an array buffer
        map(ajaxResp => {
            return {
                success: true as const,
                response: {
                    raw: ajaxResp.response,
                    type: ajaxResp.xhr.getResponseHeader('content-type') || '',
                },
            };
        }),

        // If there was an error capture it and validate the response with the
        // schema for errors.
        catchError((err: AjaxError) => captureError(err, store, endpoint)),

    ).toPromise();
}

/**
 * Helper to reduce boilerplate on PATH replace operation.
 * @param path path in PATCH replace operation
 * @param value new value
 */
export function rep(path: string, value: any) {
    return { op: 'replace', path, value };
}

/**
 * Send a PATCH request to the MAS, expecting a standard response on the error path.
 * (It must pass the masStdSchema check).
 *
 * @param endpoint endpoint to use for the PATCH
 * @param patch patch data to send in the request body
 * @param schemaSuccess schema to validate the 'success' path (20x and 30x http status codes)
 * @param headers extra headers to set in the request
 */
export function patchJSONStdMasResponse<T extends Any>(
    store: Store,
    endpoint: string,
    patch: any,
    schemaSuccess: SchemaValidator<T>,
    headers: Header = {},
) {

    return requestStdMasResponse(
        store,
        () => ajax.patch(endpoint, patch, { ...headers, ...JSON_HEADERS }),
        endpoint,
        schemaSuccess,
    );
}

/**
 * Send a PUT request to the MAS, expecting a standard response on the error path.
 * (It must pass the masStdSchema check).
 *
 * This method differ from putStdMasResponse only in that the `Content-Type` header
 * is set to `application/json`.
 *
 * @param endpoint endpoint to use for the PUT
 * @param data data to send, should be a POJO or an instance of `FormData`. Will be automatically converted
 *             as appropriate depending on the Content-Type header.
 * @param schemaSuccess schema to validate the 'success' path (20x and 30x http status code)
 * @param headers extra headers to set in the request.
 */
export function putJSONStdMasResponse<T extends Any>(
    store: Store,
    endpoint: string,
    data: any,
    schemaSuccess: SchemaValidator<T>,
    headers: Header = {},
) {
    return putStdMasResponse(store, endpoint, data, schemaSuccess, { ...headers, ...JSON_HEADERS });
}

/**
 * Send a PUT request to the MAS, expecting a standard response on the error path.
 * (It must pass the masStdSchema check).
 *
 * @param endpoint endpoint to use for the PUT
 * @param data put data to send in the request body
 * @param schemaSuccess schema to validate the 'success' path (20x and 30x http status codes)
 * @param headers extra headers to set in the request
 */
export function putStdMasResponse<T extends Any>(
    store: Store,
    endpoint: string,
    data: any,
    schemaSuccess: SchemaValidator<T>,
    headers: Header = {},
) {

    return requestStdMasResponse(
        store,
        () => ajax.put(endpoint, data, { ...headers, ...ACCEPT_HEADER }),
        endpoint,
        schemaSuccess,
    );
}

/**
 * Send a DELETE request to the MAS, expecting a standard response on the error path.
 * (It must pass the masStdSchema check).
 *
 * @param endpoint endpoint to use for the DELETE
 * @param schemaSuccess schema to validate the 'success' path (20x and 30x http status codes)
 * @param headers extra headers to set in the request.
 */
export function deleteStdMasResponse<T extends Any>(
    store: Store,
    endpoint: string,
    schemaSuccess: SchemaValidator<T>,
    headers: Header = {},
) {

    return requestStdMasResponse(
        store,
        () => ajax.delete(endpoint, { ...headers, ...ACCEPT_HEADER }),
        endpoint,
        schemaSuccess,
    );
}

// Helper function to do the request
function requestStdMasResponse<T extends Any>(
    store: Store,
    sendRequest: () => Observable<AjaxResponse>,
    endpoint: string,
    schemaSuccess: SchemaValidator<T>,
): Promise<RequestResult<TypeOf<T>>> {

    return sendRequest().pipe(

        // On the happy path, validate the response, this can't throw any error
        // because we don't want to have the catchError after handling
        // exception generated by this function.
        map(ajaxResp => {

            // FIXME: Help! Text responses should not need schema validation because, well,
            // it's a non-parsed text response. We should create a new function for text responses,
            // or modify this one so that the return type is not based on
            // the generic SchemaValidator type
            if (['json', 'text'].includes(ajaxResp.responseType)) {
                const val = schemaSuccess.validate(ajaxResp.response);

                if (val.type === 'error') {
                    pushError(store, {
                        type: 'schema',
                        endpoint,
                        reason: val.reason,
                        path: val.path,
                    });
                    return {
                        success: false as const,
                        message: val.reason,
                    };
                }
                return {
                    success: true as const,
                    response: val.value,
                };
            }
            return {
                success: false as const,
                status: ajaxResp.status,
                message: errorBestEffort(ajaxResp),
            };
        }),

        // If there was an error capture it and validate the response with the
        // schema for errors.
        catchError((err: AjaxError) => captureError(err, store, endpoint)),

    ).toPromise();
}

/**
 * If there was an error capture it;
 * validate the response with the error schemas.
 * @param err
 * @param store
 * @param endpoint
 */
export function captureError(err: AjaxError, store: Store, _endpoint: string): Observable<RequestError> {
    if (err.responseType === 'json' && err.response !== null) {

        const body = err.response;
        const status = err.status;

        // FIXME: Is it really that hard to have all of our backend services AGREE on a single schema for errors...
        // Check response against error schemas to determine
        // if error is coming from MAS or KeyCloak
        const masSchemaVal = masStdResponseSchema.validate(body);
        const requireLoginSchemaVal = requireLoginResponse.validate(body);
        const groupsSchemaVal = groupsStdResponseSchema.validate(body);
        const acsErrorSchemaVal = acsErrorSchema.validate(body);
        const vffErrorSchemaVal = vffErrorSchema.validate(body);

        // Valid KeyCloak error response (login required or expired refresh token)
        if (requireLoginSchemaVal.type === 'success' && status === 401) {
            const { value: { code, message } } = requireLoginSchemaVal;

            inviteUserToRefreshPage(store, code);

            const errorDetails: RequestError = { success: false, message, status };
            return of(errorDetails);

        } else if (masSchemaVal.type === 'success' || groupsSchemaVal.type === 'success') { // Valid error response

            let schemaVal: typeof groupsStdResponseSchema.schema._O;
            if (masSchemaVal.type === 'success') {
                schemaVal = masSchemaVal.value;
            } else if (groupsSchemaVal.type === 'success') {
                schemaVal = groupsSchemaVal.value;
            }

            const { message } = schemaVal!;

            return of({ success: false, message, status });

        } else if (acsErrorSchemaVal.type === 'success') {

            // Once we have error codes we could actually
            // turn error like partner missing into links
            const message = acsErrorSchemaVal.value.Message;
            return of({ success: false, message, status });

        } else if (vffErrorSchemaVal.type === 'success') {

            // Error returned by vff
            return of({ success: false, message: vffErrorSchemaVal.value.error, status });
        } else {

            // Unrecognized error response
            return of({
                success: false,
                status,
                message: formatWorseError(err, masSchemaVal.reason),
            });
        }
    }

    return of({
        success: false,
        status: err.status,
        message: errorBestEffort(err),
    });
}

function errorBestEffort(ajaxResp: { status: number }): string {
    if (200 <= ajaxResp.status && ajaxResp.status < 300) {
        return `Your action completed successfully (Status ${formatStatus(ajaxResp.status)}). ` +
            `However, the response was malformed. Maybe try refreshing your browser? ` +
            `If the error persists, please contact our support.`
        ;
    }
    if (ajaxResp.status === 403 || ajaxResp.status === 401) {
        return `Your are not authorized to perform this action (Error ${formatStatus(ajaxResp.status)})`;
    }
    if (ajaxResp.status === 418) {
        return `Would you like some tea? It appears that the server is a teapot`;
    }
    if (400 <= ajaxResp.status && ajaxResp.status < 500) {
        return `Invalid action (Error ${formatStatus(ajaxResp.status)})`;
    }
    return `Internal server error (Error ${formatStatus(ajaxResp.status)})`;
}

function formatStatus(statusCode: number): string {
    try {
        return `${statusCode}: ${getStatusText(statusCode)}`;
    } catch (e) {
        return `${statusCode}`;
    }
}

// Helper to talk about the inconsistencies of our glorious backend
function formatWorseError(err: AjaxError, reason: string): string {
    return `Error ${err.status} from the server. Tried to look for a message ` +
        `from the server but it returned an invalid response. Some help: '${reason}'.\n` +
        `It can't be worse, you did your best. :)`;
}

export type RequestResult<T> = RequestError | RequestSuccess<T>;
export type LooseRequestResult = RequestError | LooseSuccess;

interface RequestError {
    success: false
    /** HTTP status code of the request if relevant (so if it's not a schema error) */
    status?: number
    /** Message that was extracted from the response */
    message: string
}

interface RequestSuccess<T> {
    success: true
    response: T
}

interface LooseSuccess {
    type: 'success'
}

interface Header {
    [key: string]: string
}