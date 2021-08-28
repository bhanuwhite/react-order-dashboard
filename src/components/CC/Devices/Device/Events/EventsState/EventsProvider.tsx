import moment from 'moment';
import React, { FC } from 'react';

// tslint:disable-next-line: variable-name
export const EventsContext = React.createContext<EventsContextType>({ state: {}, actions: {} } as EventsContextType);

// tslint:disable-next-line: variable-name
export const EventsProvider: FC<{
    streamValues: string[],
    unitSerialValue: string,
    initialNumberOfEvents: number,
    initialNumberOfPages: number,
    nameValue: string,
}> = ({ streamValues, unitSerialValue, initialNumberOfEvents, initialNumberOfPages, nameValue, children }) => {
    const [startDate, setStartDateValue] = React.useState<string>(moment().subtract(4, 'hours').utc().format());
    const [endDate, setEndDateValue] = React.useState<string>(moment().utc().format());
    const [startDateErrorMsg, setStartDateError] = React.useState<string>('');
    const [endDateErrorMsg, setEndDateError] = React.useState<string>('');
    const [showStartDate, setShowStartDate] = React.useState<boolean>(false);
    const [showEndDate, setShowEndDate] = React.useState<boolean>(false);
    const [poller, setPoller] = React.useState<number>(0);

    const [search, setSearchValue] = React.useState<string>('');
    const [pendingReq, setPendingReq] = React.useState<boolean>(false);
    const [playing, setPlaying] = React.useState<boolean>(false);
    // liveStartDate & liveEndDate are used to determine the date range of the last known "live tail"
    // These are different from startDate & endDate which are the dates of the last "search"
    // These dates are used when a user wants to download the contents of the "live tail" session
    const [liveStartDate, setLiveStartDate] = React.useState<string>('');
    const [liveEndDate, setLiveEndDate] = React.useState<string>('');
    const [includeMetadata, setIncludeMetadata] = React.useState<boolean>(false);
    const [numberOfEvents, setNumberOfEvents] = React.useState<number>(initialNumberOfEvents);

    const [pending, setPendingSearch] = React.useState<boolean>(false);
    const [numberOfPages, setNumberOfPages] = React.useState<number>(initialNumberOfPages);
    const [currentPage, setCurrentPage] = React.useState<number>(0);

    const [streams] = React.useState<string[]>(streamValues);
    const [unitSerial] = React.useState<string>(unitSerialValue);

    const [networkError, setNetworkError] = React.useState<NetworkError>({ status: null, message: '' });

    const [severityFilter, setSeverityFilter] = React.useState<string>('');
    const [blacklistedSubsystems, setBlacklistedSubsystems] = React.useState<string[]>([]);

    const [severityUpdated, setSeverityUpdated] = React.useState<boolean>(false);
    const [blacklistedSubsystemsUpdated, setBlacklistedSubsystemsUpdated] = React.useState<boolean>(false);

    const [showSettingsModal, setShowSettingsModal] = React.useState<boolean>(false);
    const [altSyslogServer, setAltSyslogServer] = React.useState<string>('');

    const [name, setName] = React.useState<string>(nameValue);

    const value = {
        state: {
            startDate,
            endDate,
            startDateErrorMsg,
            endDateErrorMsg,
            showStartDate,
            showEndDate,
            poller,
            search,
            playing,
            pendingReq,
            includeMetadata,
            numberOfEvents,
            pending,
            numberOfPages,
            currentPage,
            streams,
            unitSerial,
            networkError,
            severityFilter,
            blacklistedSubsystems,
            severityUpdated,
            blacklistedSubsystemsUpdated,
            showSettingsModal,
            altSyslogServer,
            name,
            liveStartDate,
            liveEndDate,
        },
        actions: {
            setStartDateValue,
            setEndDateValue,
            setStartDateError,
            setEndDateError,
            setShowStartDate,
            setShowEndDate,
            setPoller,
            setCurrentPage,
            setPendingReq,
            setPlaying,
            setSearchValue,
            setIncludeMetadata,
            setNumberOfEvents,
            setPendingSearch,
            setNumberOfPages,
            setNetworkError,
            setSeverityFilter,
            setBlacklistedSubsystems,
            setSeverityUpdated,
            setBlacklistedSubsystemsUpdated,
            setShowSettingsModal,
            setAltSyslogServer,
            setName,
            setLiveStartDate,
            setLiveEndDate,
        },
    };

    return (
        <EventsContext.Provider value={value}>
            {children}
        </EventsContext.Provider>
    );
};

export function useEventsState() {
    return React.useContext(EventsContext);
}

interface NetworkError {
    status: number | null,
    message: string,
}

interface EventsContextType {
    state: {
        startDate: string,
        endDate: string,
        startDateErrorMsg: string,
        endDateErrorMsg: string,
        showStartDate: boolean,
        showEndDate: boolean,
        poller: number,
        search: string,
        pendingReq: boolean,
        playing: boolean,
        includeMetadata: boolean,
        numberOfEvents: number,
        pending: boolean,
        numberOfPages: number,
        currentPage: number,
        streams: string[],
        unitSerial: string,
        networkError: NetworkError,
        severityFilter: string,
        blacklistedSubsystems: string[],
        severityUpdated: boolean,
        blacklistedSubsystemsUpdated: boolean,
        showSettingsModal: boolean,
        altSyslogServer: string,
        name: string,
        liveStartDate: string,
        liveEndDate: string,
    },
    actions: {
        setStartDateValue: React.Dispatch<React.SetStateAction<string>>,
        setEndDateValue: React.Dispatch<React.SetStateAction<string>>,
        setStartDateError: React.Dispatch<React.SetStateAction<string>>,
        setEndDateError: React.Dispatch<React.SetStateAction<string>>,
        setShowStartDate: React.Dispatch<React.SetStateAction<boolean>>,
        setShowEndDate: React.Dispatch<React.SetStateAction<boolean>>,
        setPoller: React.Dispatch<React.SetStateAction<number>>,
        setSearchValue: React.Dispatch<React.SetStateAction<string>>,
        setPendingReq: React.Dispatch<React.SetStateAction<boolean>>,
        setPlaying: React.Dispatch<React.SetStateAction<boolean>>,
        setIncludeMetadata: React.Dispatch<React.SetStateAction<boolean>>,
        setNumberOfEvents: React.Dispatch<React.SetStateAction<number>>,
        setPendingSearch: React.Dispatch<React.SetStateAction<boolean>>,
        setNumberOfPages: React.Dispatch<React.SetStateAction<number>>,
        setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
        setNetworkError: React.Dispatch<React.SetStateAction<NetworkError>>,
        setSeverityFilter: React.Dispatch<React.SetStateAction<string>>,
        setBlacklistedSubsystems: React.Dispatch<React.SetStateAction<string[]>>,
        setSeverityUpdated: React.Dispatch<React.SetStateAction<boolean>>,
        setBlacklistedSubsystemsUpdated: React.Dispatch<React.SetStateAction<boolean>>,
        setShowSettingsModal: React.Dispatch<React.SetStateAction<boolean>>,
        setAltSyslogServer: React.Dispatch<React.SetStateAction<string>>,
        setName: React.Dispatch<React.SetStateAction<string>>,
        setLiveStartDate: React.Dispatch<React.SetStateAction<string>>,
        setLiveEndDate: React.Dispatch<React.SetStateAction<string>>,
    },
}
