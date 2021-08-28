import * as React from 'react';
import moment from 'moment';
import { FC } from 'react';
import { Button } from '@/components/core';
import { observer } from 'mobx-react-lite';
import ReactPaginate from 'react-paginate';
import { useStore } from '@/hooks/useStore';
import { getErrorStatusCode } from './helpers';
import * as style from './DeviceEvents.module.scss';
import { usePerformSearch } from './UsePerformSearch';
import { downloadUTF8Text } from '@/utils/download';
import { transformEvents, getMessageSearchResult } from './helpers';
import { useEventsState } from './EventsState/EventsProvider';
import { createSearch, getEvents, Results } from '@/actions/events';

// tslint:disable-next-line: variable-name
export const EventViewer: FC = observer(() => {
    const store = useStore();
    const { events } = store.view.deviceEvents;
    const {
        state: {
            includeMetadata,
            pending,
            numberOfPages,
            playing,
            unitSerial,
            name,
            startDate,
            endDate,
            streams,
            search,
            liveStartDate,
            liveEndDate,
        },
        actions: {
            setCurrentPage,
            setNetworkError,
            setPendingSearch,
        },
    } = useEventsState();
    const performSearch = usePerformSearch();

    // changePage updates the currently selected page and calls `performSearch` to get the events using the latest
    function onPageChange(event: { selected: number }) {
        setCurrentPage(event.selected);
        performSearch(playing, event.selected)();
    }

    // getResults creates and executes a search to graylog
    async function getResults(offset: number, limit: number): Promise<Results> {
        // Check if the user's last search was a live tail, if so get the date range of the query to use in the search
        let start = startDate;
        let end = endDate;
        if (liveStartDate !== '') {
            start = liveStartDate;
            // Check we have an end date, if none is set the live tail is still active so
            // get events up until now
            end = liveEndDate === '' ? moment().utc().format() : liveEndDate;
        }
        // Create the search query with graylog through the MAS to get back a search ID
        const searchRes = await createSearch(
            store,
            store.view.activeuser.masUser.GraylogSearchTmpl + '01',
            streams,
            offset,
            end,
            start,
            search,
            false,
            limit,
        );

        // Check for failures
        if (!searchRes.success) {
            console.error('createSearch failed', searchRes);
            // Set the errMsg variable to render the ErrorBox and alert the user
            setNetworkError({ status: getErrorStatusCode(store), message: searchRes.message });
            // Inform components the search is complete
            setPendingSearch(false);
            return {};
        }

        // Get a list of events using the search ID created previously
        const res = await getEvents(store, searchRes.response.id);

        // Check for failures
        if (!res.success) {
            console.error('getEvents failed', res);
            // Set the errMsg variable to render the ErrorBox and alert the user
            setNetworkError({ status: getErrorStatusCode(store), message: res.message });
            // Inform components the search is complete
            setPendingSearch(false);
            return {};
        }

        return res.response.results;
    }

    // downloadEvents gets the events from the current viewer and downloads them as a text file to the browser
    async function downloadEvents(event: React.MouseEvent<any>) {
        // Prevent a page reload
        event.preventDefault();

        // Define the current "page" we want
        let offset = 0;
        const limit = 500;

        // Retrieve the initial results and parse the metadata to get the total number of events
        const initialResults = await getResults(offset, limit);
        const searchResult = getMessageSearchResult(initialResults);
        const totalNumberEvents = searchResult.total_results;

        // Transform the initial events to a list of message strings
        const transformedEvents = transformEvents(
            initialResults,
            includeMetadata,
            unitSerial === 'mesh');

        // Iterate the "pages" until the total number of events has been downloaded and appened to transformedEvents
        while (offset + limit < totalNumberEvents) {
            offset += limit;
            const newResults = await getResults(offset, limit);
            const newEvents = transformEvents(
                newResults,
                includeMetadata,
                unitSerial === 'mesh');

            transformedEvents.push(...newEvents);
        }

        // Join the list of message strings to a single string
        const allEvents = transformedEvents.join('\n');

        // Determine the filename based on if we are in "live tail" mode
        let filename = `${name}_${startDate}-${endDate}.txt`;
        if (playing) {
            filename = `${name}_live-${new Date().toUTCString()}.txt`;
        }
        // Download the events to a text file
        downloadUTF8Text(allEvents, filename);
    }

    return <>
        <div className={style.textareaContainer}>
            <textarea
                readOnly
                disabled={pending}
                spellCheck={false}
                className={style.eventViewer}
                value={transformEvents(events, includeMetadata, unitSerial === 'mesh').join('\n')}>
            </textarea>

            <Button className={style.download__btn} large primary type="button" onClick={downloadEvents}>
                <i className={`fas fa-download`}></i> Download
            </Button>
        </div>

        <div className={style.paginationContainer}>
            <ReactPaginate
                previousLabel={'<<<'}
                nextLabel={'>>>'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={numberOfPages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={onPageChange}
                containerClassName={'pagination'}
                activeClassName={'activePage'}
            />
        </div>
    </>;
});