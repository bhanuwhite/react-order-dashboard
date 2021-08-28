import * as React from 'react';
import { FC } from 'react';
import { useStore } from '@/hooks/useStore';
import * as style from './DeviceEvents.module.scss';
import { Nothing, Spinner } from '@/components/core';
import { findStreamIdFromSerial } from '@/actions/events';
import { useNodeLoggingConfigFetcher } from '@/hooks/fetchers';
import { EventsProvider, useEventsState } from './EventsState/EventsProvider';
import { Padding } from '../../Mesh/Padding';
import { MeshDeviceErrorsHandler } from '@/components/core/Errors';
import { DateFilters } from './DateFilter';
import { QueryFilters } from './QueryFilter';
import { EventViewer } from './EventViewer';
import { SettingsModal } from './SettingsModal';
import { getMessageSearchResult, eventsBootstrap } from './helpers';


// tslint:disable-next-line: variable-name
export const DeviceEvents: FC<Props> = ({ unitSerials, name, meshPage }) => {
    const store = useStore();

    // opening the event tab will initiate a bootstrap process,
    // which is a pre-fetch for the events section
    const [eventsBootstrapFinished, setEventsBootstrapFinished] = React.useState<boolean>(false);

    // On intial render
    React.useEffect(() => {
        eventsBootstrap(store, unitSerials, setEventsBootstrapFinished);
    }, [unitSerials]);


    if (!eventsBootstrapFinished) {
        return <Padding><Spinner /></Padding>;
    }

    const streams: string[] = [];

    // We need the streams associated to the nodes, let's get this from the store
    for (const unitSerial of unitSerials) {
        const streamId = findStreamIdFromSerial(store, unitSerial);
        // Check we found a stream UUID for the node, if not show an error message
        if (streamId !== '') {
            streams.push(streamId);
        }
    }

    // Check we have at least 1 stream
    if (streams.length < 1) {
        return <Padding><UnavailableStreamAssociatedMsg /></Padding>;
    }

    const unitSerialValue = meshPage ? 'mesh' : unitSerials[0];

    // Calculate the number of initial events
    const messageSearchResult = getMessageSearchResult(store.view.deviceEvents.events);
    const initialNumberOfEvents = messageSearchResult.total_results;

    return <EventsProvider
        streamValues={streams}
        unitSerialValue={unitSerialValue}
        initialNumberOfEvents={initialNumberOfEvents}
        initialNumberOfPages={initialNumberOfEvents / 150}
        nameValue={name}>
            <EventsForm />
        </EventsProvider>;
};

interface Props {
    unitSerials: string[]
    name: string
    meshPage?: boolean
}

// tslint:disable-next-line: variable-name
const UnavailableStreamAssociatedMsg: FC = () => {
    return <Nothing raw>
        <b>TEMPORARILY UNAVAILABLE</b><br />
        <b>Currently your VeeaHub does not have an event stream associated to it</b><br />
        Please check back here soon, if the problem persists please contact support.
    </Nothing>;
};

// tslint:disable-next-line: variable-name
export const EventsForm: FC = () => {
    const store = useStore();
    const { state: { numberOfEvents, networkError, unitSerial } } = useEventsState();
    const node = store.domain.nodes.map.get(unitSerial);
    const { fetchNow, error: fetchError } = useNodeLoggingConfigFetcher(node?.props.masId);

    if (networkError.status || networkError!.status === 0) { // 0 meaning Ajax network error
        // Check if the error message is simply related to the hub rebooting, if so
        // provide the user a more meaningful error message
        let errorMsg = networkError.message;
        if (errorMsg.includes('wamp.error.no_such_procedure')) {
            errorMsg = 'The hub is currently rebooting, please wait and try again soon';
        }
        return <Padding>
            <MeshDeviceErrorsHandler
                error={{ status: networkError.status ?? 500, message: errorMsg }}
                customMessage={errorMsg}
            />
        </Padding>;
    }

    if (unitSerial !== 'mesh') {
        if (node === undefined) {
            return <Padding>
                <MeshDeviceErrorsHandler
                    error={{ status: 404, message: `Unit with serial ${unitSerial} could not be found` }}
                    customMessage={`Unit with serial ${unitSerial} could not be found`}
                />
            </Padding>;
        }

        if (fetchError) {
            return <Padding>
                <MeshDeviceErrorsHandler
                    error={{ status: fetchError.status ?? 500, message: fetchError.message }}
                    customMessage={'This VeeaHub is running a version that does not support \
                    events, please upgrade the platform in order to use this feature'}
                />
            </Padding>;
        }
    }

    return <div className="p-15 lg:p-30">
        <div className={style.applicationPopupListSection}>
            {store.view.errors.eventsError ?
                <MeshDeviceErrorsHandler
                    error={store.view.errors.eventsError}
                    customMessage={store.view.errors.eventsError.message}
                />
            : null}
            <div className={style.applicationPopupDetailsSeparator}>
                Events: {numberOfEvents}
            </div>

            <div className={style.eventViewerContainer}>
                <form>
                    <DateFilters />
                    <QueryFilters />
                </form>

                <SettingsModal refetchNodeLoggingConfig={fetchNow} />

                <EventViewer />
            </div>
        </div>
    </div>;
};
