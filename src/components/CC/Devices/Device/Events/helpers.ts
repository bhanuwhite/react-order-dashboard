import { Store } from '@/store';
import { objectKeys } from '@/utils/types';
import { storeUserSelf } from '@/actions/activeuser';
import { Common, HttpError } from '@/store/view/errors';
import { Results, Event, SearchData, setError } from '@/actions/events';
import { getInitialEvents, flushEvents, findStreamIdFromSerial, getInitialStreams, setEvents } from '@/actions/events';

// getMessageSearchResult iterates through the graylog response to get the search results for the events
// (the response can return statistics and other data but we only want the messages containing the events)
export function getMessageSearchResult(results: Results): SearchData {
    let messageSearchResult: SearchData = {
        total_results: 0,
        messages: [],
        type: '',
    };
    objectKeys(results).forEach(key => {
        const result = results[key];
        objectKeys(result.search_types).forEach(searchKey => {
            const searchResult = result.search_types[searchKey];

            // Check we have the correct type of response (stats can be returned also)
            if (searchResult.type === 'messages') {
                messageSearchResult = searchResult;
            }
        });
    });
    return messageSearchResult;
}

// transformEvents transforms the Results retrieved from the API to human readable events
export function transformEvents(results: Results, showMetadata: boolean, showSource: boolean = false): string[] {
    let rawEventList: Event[] = [];

    // Iterate through results to retrieve events
    const messageSearchResult = getMessageSearchResult(results);
    rawEventList = messageSearchResult.messages;

    const levels = ['debug', 'info', 'notice', 'warning', 'err', 'crit', 'alert', 'emerg'];

    // Iterate through the events
    return rawEventList.map(message => {
        // If the checkbox to include metadata is checked ensure we include the correct fields
        let eventMessage = `[${message.message.timestamp}] [${levels[message.message.level]}] ${message.message.application_name}: ${message.message.message}`;
        if (showSource) {
            eventMessage = `[${message.message.timestamp}] [${levels[message.message.level]}] ${message.message.source} ${message.message.application_name}: ${message.message.message}`;
        }
        if (showMetadata) {
            const messageKeys = Object.keys(message.message);
            if (messageKeys.length > 0) {
                eventMessage += '\n';
            }
            messageKeys.forEach(metadata => {
                // We are only interested in structured data, so check if we have explictly
                // included this data with the event
                if (metadata.includes('@')) {
                    // If so append to the event message
                    eventMessage += `${metadata}=${message.message[metadata]}, `;
                }
            });
        }
        return eventMessage;
    });
}

export function getErrorStatusCode(store: Store) {
    return (store.view.errors.all as (HttpError & Common)[]).slice().reverse().find(error => {
        return ['/mas/views/search', '/mas/v2/streams'].includes(error.endpoint);
    })?.statusCode ?? 500;
}

export async function eventsBootstrap(
    store: Store,
    unitSerials: string[],
    setEventsBootstrapFinished?: React.Dispatch<React.SetStateAction<boolean>>) {

    // Get the streams and initial events for the hub
    const res = await storeUserSelf(store);
    if (!res.success) {
        console.error('Could not get user', res);
        const err = {
            message: 'Could not get user',
            status: 500,
            customMessage: 'Could not get user',
        };
        setError(store, err);
        setEventsBootstrapFinished!(true);
        return;
    }
    flushEvents(store);
    await getInitialStreams(store);

    // We need the streams associated to the nodes, let's get this from the store
    const streams:string[] = [];
    for (const unitSerial of unitSerials) {
        const streamId = findStreamIdFromSerial(store, unitSerial);
        // Check we found a stream UUID for the node, if not show an error message
        if (streamId === '') {
            const err = {
                status: 404,
                message: 'Currently your VeeaHub does not have an event stream associated to it',
                customMessage: 'Currently your VeeaHub does not have an event stream associated to it',
            };

            setError(store, err);
            setEventsBootstrapFinished!(true);
            return;
        }
        streams.push(streamId);
    }

    const events = await getInitialEvents(
        store,
        res.response.GraylogSearchTmpl + '01',
        streams,
        store.view.deviceEvents.endDate,
        store.view.deviceEvents.startDate,
    );

    // Update the store
    if (events.success) {
        setEvents(store, events.response);
    } else {
        console.error('Could not get initial events for device ', events);
        const err = {
            message: 'Could not get initial events for VeeaHub',
            customMessage: 'Could not get initial events for VeeaHub',
            status: getErrorStatusCode(store),
        };
        setError(store, err);
        setEventsBootstrapFinished!(true);
        return;
    }

    setError(store, undefined);
    setEventsBootstrapFinished!(true);
}