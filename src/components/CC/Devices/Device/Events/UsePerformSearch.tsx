import { useEventsState } from './EventsState/EventsProvider';
import { createSearch, getEvents, Results, setEvents } from '@/actions/events';
import { useStore } from '@/hooks/useStore';
import { getMessageSearchResult, getErrorStatusCode } from './helpers';

const oneHourInMilliseconds = 1000 * 60 * 60;

export function usePerformSearch() {
    const store = useStore();
    const {
        state: {
            startDate,
            endDate,
            currentPage,
            search,
            streams,
        },
        actions: {
            setPendingSearch,
            setPlaying,
            setNumberOfEvents,
            setNumberOfPages,
            setNetworkError,
        },
    } = useEventsState();

    /**
     * Performs most of the leg work for the component, it creates a graylog search, executes it the
     * writes the results to the event viewer. This function is performed by the poller to get live results,
     * when a user selects a date or changes page.
     *
     * @param stream Boolean to indicate if the search will be polled, if true use a relative time range for the search
     * @param pageNumber Current page number
     * @param intervalIdReference Object containing interval ID that is used to cancel polling after 60 minutes
     */
    return (
        stream: boolean = false,
        pageNumber: number = currentPage,
        intervalIdReference?: { intervalId: number },
    ) => {
        const liveTailStartTime = Date.now();
        return async () => {

            if (intervalIdReference) {
                const { intervalId } = intervalIdReference;
                const elapsedPollTimeInMilliseconds = Date.now() - liveTailStartTime;

                if (elapsedPollTimeInMilliseconds >= oneHourInMilliseconds) {
                    clearInterval(intervalId);
                    setPlaying(false);
                }
            }

            // Inform components a search is pending
            setPendingSearch(true);

            // Create the search query with graylog through the MAS to get back a search ID
            const searchRes = await createSearch(
                store,
                store.view.activeuser.masUser.GraylogSearchTmpl + '01',
                streams,
                150 * pageNumber,
                endDate,
                startDate,
                search,
                stream,
            );

            // Check for failures
            if (!searchRes.success) {
                console.error('createSearch failed', searchRes);
                // Set the errMsg variable to render the ErrorBox and alert the user
                setNetworkError({ status: getErrorStatusCode(store), message: searchRes.message });
                // Inform components the search is complete
                setPendingSearch(false);
                return;
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
                return;
            }

            // Update store with events
            const results: Results = res.response.results;
            setEvents(store, results);

            // Iterate through the list of events and set them to the state variable events to
            // trigger a re render
            const messageSearchResult = getMessageSearchResult(results);
            // Calculate the number of pages for pagination
            const totalNumberEvents = messageSearchResult.total_results;
            setNumberOfEvents(totalNumberEvents);
            setNumberOfPages(Math.ceil(totalNumberEvents / 150));

            // Inform components the search is complete
            setPendingSearch(false);
        };
    };
}
