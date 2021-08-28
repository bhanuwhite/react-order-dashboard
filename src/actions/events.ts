import { getJSONStdMasResponse, postJSONStdMasResponse, RequestResult } from './helpers';
import { executeSearchSchema, getStreamsSchema, createSearchSchema, masStdResponseSchema } from '@/schemas';
import { createDeviceEvents } from '@/store/view/events';
import { NodeState } from '@/store/domain/nodes';
import { Store } from '@/store';
import { action } from 'mobx';
import { IError } from '@/components/core/Errors';

// Interfaces for API responses, the reason we define here is that typesafe-schema does not support
// indexable types ([key: string] format), used when the key name is unknown. Since the graylog API
// keys the results by ID the schema could not be used, instead we use the schema to ensure the top
// level attributes are there that are known, then annotate the results array with an interface

export interface Event {
    message: any;
}
export interface SearchData {
    total_results: number,
    messages: Event[],
    type: string
}
interface SearchType {
    [key: string]: SearchData
}
interface Result {
    search_types: SearchType
}
export interface Results {
    [key: string]: Result
}

export enum DateType {
    Start,
    End,
}

interface ConfigPayload {
    level: string | undefined,
    blacklisted_subsystems ?: {category: string, subcategory: string}[]
}

const DEFAULT_EVENTS_LIMIT = 150;

// getEvents executes a search to retrieve the events for a hub
export async function getEvents(store: Store, searchId: string) {
    const endpoint = `/mas/views/search/${searchId}/execute`;
    const data = {
        parameter_bindings: {},
    };
    return postJSONStdMasResponse(
        store,
        endpoint,
        data,
        executeSearchSchema,
        {'X-Requested-By': 'control-center'});
}

// getStreams retrieves the list of event streams scoped to the active user
export async function getStreams(store: Store) {
    const endpoint = '/mas/v2/streams';
    return getJSONStdMasResponse(store, endpoint, getStreamsSchema);
}

/**
 * createSearch creates a search query with graylog to be executed to retrieve results
 * @param store Mobx store to get stateful data
 * @param streamId ID of the stream to filter by
 * @param offset Offset amount for pagination
 * @param to Date string of the end date
 * @param from Date string of the start date
 * @param search Query string to perform a search on the filtered events
 * @param stream Boolean to indicate if the search will be polled, if true use a relative time range for the search
 */
export async function createSearch(
    store: Store,
    searchId: string,
    streams: string[],
    offset: number,
    to: string,
    from: string,
    search: string,
    stream: boolean = false,
    limit: number = DEFAULT_EVENTS_LIMIT) {

    const endpoint = `/mas/views/search`;

    const data = {
        id: searchId,
        queries: [
           {
              id: '0e6c3024-c326-4e63-8eb2-f7fd0c1ddb61',
              query: {
                 type: 'elasticsearch',
                 query_string: search,
              },
              timerange: {},
              filter: {
                filters: [] as {id: string, type: string}[],
                type: 'or',
              },
              search_types: [
                 {
                    timerange: null,
                    query: null,
                    streams: [],
                    id: '9c3fdd57-4ed4-473e-b4bd-be8060c099d2',
                    name: null,
                    limit,
                    offset,
                    sort: [
                       {
                          field: 'timestamp',
                          order: 'DESC',
                       },
                    ],
                    decorators: [],
                    type: 'messages',
                    filter: null,
                 },
              ],
           },
        ],
        parameters: [],
    };

    for (const streamId of streams) {
        data.queries[0].filter.filters.push({id: streamId, type: 'stream'});
    }

    if (stream) {
        data.queries[0].timerange = {
            type: 'relative',
            range: 300,
        };
    } else {
        data.queries[0].timerange = {
            type: 'absolute',
            from,
            to,
        };
    }

    return postJSONStdMasResponse(store, endpoint, data, createSearchSchema, {'X-Requested-By': 'control-center'});
}

// getInitialStreams populates the store with the streams scoped to the user
export async function getInitialStreams(store: Store) {
    // Get the streams for a user from the MAS
    const res = await getStreams(store);
    // Check for failures
    if (!res.success) {
        return res;
    }

    // Update the store with the response
    action(() => {
        store.view.deviceEvents.streams = res.response;
    })();
}

// flush events each time a user switches context to a different device
export function flushEvents(store: Store) {
    action(() => {
        store.view.deviceEvents = createDeviceEvents();
    })();
}

// findStreamIdFromSerial looks up the stream ID using a unit serial
export function findStreamIdFromSerial(store: Store, unitSerial: string): string {
    let streamId = '';
    store.view.deviceEvents.streams.forEach(stream => {
        if (unitSerial === stream.unit_serial) {
            streamId = stream.stream;
        }
    });
    return streamId;
}

// getInitialEvents retrieves the events for the default date range for a unit
export async function getInitialEvents(
    store: Store,
    searchId: string,
    streams: string[],
    endDate: string,
    startDate: string): Promise<RequestResult<Results>> {
    // Create the search query with graylog through the MAS to get back a search ID
    const searchRes = await createSearch(
        store,
        searchId,
        streams,
        0,
        endDate,
        startDate,
        '',
        false,
    );

    // Check for failures
    if (!searchRes.success) {
        console.error('createSearch failed', searchRes);
        return searchRes;
    }

    // Get a list of events using the search ID created previously
    const res = await getEvents(store, searchRes.response.id);

    // Check for failures
    if (!res.success) {
        console.error('getEvents failed', res);
        return res;
    }

    return { success: true, response: res.response.results };
}

// setEvents updates the store with events
export function setEvents(store: Store, events: Results) {
    action(() => {
        store.view.deviceEvents.events = events;
    })();
}

// dbusProxy sends a POST to the mas's endpoint /dbus/proxy to proxy a request over wamp to a unit's DBUS
function dbusProxy(store: Store, data: any) {
    const endpoint = `/mas/v2/dbus/proxy`;
    return postJSONStdMasResponse(store, endpoint, data, masStdResponseSchema, {'X-Requested-By': 'control-center'});
}

// setLoggingConfig sets the logging filters on the Veeahub over API <-> WAMP <-> DBUS
export async function setLoggingConfig(
    store: Store,
    unitSerial: string,
    node: NodeState | undefined,
    level: string,
    blacklistedCategories: string[],
    severityUpdated: boolean,
    blacklistedSubsystemsUpdated: boolean) {

    const payload: ConfigPayload = {
        level: severityUpdated ? level : node?.nodeLoggingConfig?.level,
    };

    if (blacklistedSubsystemsUpdated) {
        payload.blacklisted_subsystems = [];
        for (const category of blacklistedCategories) {
            payload.blacklisted_subsystems.push({
                category: `${category}`,
                subcategory: '',
            });
        }
    }

    const data = {
        bus: 'io.veea.VeeaHub.SystemControl',
        method: 'EventLoggingSetConfig',
        unit_serial: unitSerial,
        payload: JSON.stringify(payload),
    };

    return dbusProxy(store, data);
}

export function setError(store: Store, err: IError | undefined) {
    action(() => {
        store.view.errors.eventsError = err;
    })();
}