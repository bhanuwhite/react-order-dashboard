import { Store } from '@/store';
import { ignoreSchema } from '@/schemas';
import {
    postJSONStdMasResponse,
    patchJSONStdMasResponse,
    getJSONStdMasResponse,
    deleteStdMasResponse,
} from './helpers';


/**
 * Send a request for node manager to the backend.
 * This function can also use information from the store
 * and from the request to return early. The
 *
 * @param store mobx store
 * @param reqInfo request info
 */
export async function sendRequestForNodeManager(
    store: Store,
    reqInfo: RequestDetails,
): Promise<NodeManagerPostMessageAPIResponse> {

    const {
        url,
        contentType,
        data,
        method,
        requestId,
    } = reqInfo;

    const isJson = contentType.startsWith('application/json');

    if (!isJson) {
        const responseText = `PostMessageAPI Error: Unsupported contentType ${contentType}`;
        return {
            type: 'response',
            requestId,
            response: responseText,
            responseText,
            success: false,
            status: 400,
        };
    }

    function convertData(obj: any) {
        const queryParts: string[] = [];
        // tslint:disable-next-line: forin
        for (const prop in obj) {
            queryParts.push(`${prop}=${encodeURIComponent(obj[prop])}`);
        }
        return '?' + queryParts.join('&');
    }

    const res = method === 'GET' ? await getJSONStdMasResponse(store, url + convertData(data), ignoreSchema) :
        method === 'POST' ? await postJSONStdMasResponse(store, url, data, ignoreSchema) :
        method === 'PATCH' ? await patchJSONStdMasResponse(store, url, data, ignoreSchema) :
        /* method === 'DELETE' ? */ await deleteStdMasResponse(store, url, ignoreSchema);

    if (res.success) {
        return {
            type: 'response',
            requestId,
            response: { data: res.response },
            responseText: '',
            success: true,
            status: 200,
        };
    }
    return {
        type: 'response',
        requestId,
        response: res.message,
        responseText: res.message,
        success: false,
        status: res.status ?? 500,
    };
}

interface NodeManagerPostMessageAPIResponse {
    type: 'response'
    requestId: number
    success: boolean
    response: unknown
    responseText: string
    status: number
}

interface RequestDetails {
    contentType: string
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
    url: string
    data: unknown
    requestId: number
}