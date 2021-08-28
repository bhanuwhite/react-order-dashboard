import * as React from 'react';
import { FC } from 'react';
import moment from 'moment';
import InputMoment from 'input-moment';
import { observer } from 'mobx-react-lite';
import { Button } from '@/components/core';
import { DateType } from '@/actions/events';
import * as style from './DeviceEvents.module.scss';
import { usePerformSearch } from './UsePerformSearch';
import { useEventsState } from './EventsState/EventsProvider';


// tslint:disable-next-line: variable-name
export const DateFilters: FC = observer(() => {
    const {
        state: {
            startDate,
            endDate,
            startDateErrorMsg,
            endDateErrorMsg,
            showStartDate,
            showEndDate,
            poller,
            playing,
            pendingReq,
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
            setLiveStartDate,
            setLiveEndDate,
        },
    } = useEventsState();
    const performSearch = usePerformSearch();

    // Ensure the poller is removed if any navigation away from the page occurs
    window.onpopstate = () => {
        setPlaying(false);
        setCurrentPage(0);
        clearInterval(poller);
    };

    // toggleShowStartDate toggles the boolean showStartDate that conditionally renders <InputMoment> for the start date
    function toggleShowStartDate() {
        setShowStartDate(!showStartDate);
    }

    // toggleShowEndDate toggles the boolean showStartDate that conditionally renders <InputMoment> for the end date
    function toggleShowEndDate() {
        setShowEndDate(!showEndDate);
    }

    // handleSave is the event handler for the "save" button in the date pickers
    function handleSave(flag: DateType, stream: boolean = false) {
        return () => {
            // Stop the live stream
            clearInterval(poller);
            setPlaying(false);

            // Clear any previous dates from live tail mode
            setLiveStartDate('');
            setLiveEndDate('');

            // Get the events
            performSearch(stream)();

            // Close the date picker if opened
            if (flag === DateType.Start) {
                setShowStartDate(false);
            } else {
                setShowEndDate(false);
            }
        };
    }

    // handleChange is used as the event handler for the onChange of a date picker
    function handleChange(flag: DateType) {
        return (date: moment.Moment) => {
            setPendingReq(true);
            let errorMessage: string = '';
            if (flag === DateType.Start) {
                if (moment(endDate) < date) {
                    errorMessage = 'The start date cannot be after the end date';
                }
                setStartDateError(errorMessage);
                setStartDateValue(date.utc().format());
            } else {
                if (moment(startDate) > date) {
                    errorMessage = 'The end date cannot be before the start date';
                }
                setEndDateError(errorMessage);
                setEndDateValue(date.utc().format());
            }
            setPendingReq(false);
        };
    }

    // play stops and starts the poller to retrieve the events in real time to the event viewer
    function play(event: React.MouseEvent<any>) {
        // Prevent a page reload
        event.preventDefault();

        // Set page to 0 to reset offset
        setCurrentPage(0);

        // If we are already playing, clear the poller and return
        if (playing) {
            clearInterval(poller);
            // Set the date time of when the live tail ended
            setLiveEndDate(moment().utc().format());
        } else {
            // Hide the date pickers
            setShowStartDate(false);
            setShowEndDate(false);

            // Otherwise start the poller to retrieve the latest events every 5 seconds
            performSearch(true)();

            // Set the date when the live mode started
            setLiveStartDate(moment().utc().subtract(5, 'minutes').format());

            /**
             * Typescript will not allow us to pass the intervalId directly to the setInterval callback,
             * but we need the intervalId in order to cancel polling after 60 minutes.
             * This is why it is necessary to wrap the interval ID in an object,
             * which is always passed by reference, and pass that into the callback instead of a number.
             */
            const intervalIdReference = { intervalId: 0 };
            // intervalIdReference.intervalId = setInterval(performSearch(
            //     true,                // stream
            //     0,                   // pageNumber
            //     intervalIdReference, // intervalIdReference
            // ), 10000);

            setPoller(intervalIdReference.intervalId);
        }

        // Toggle the playing boolean
        setPlaying(!playing);
    }

    return <>
        <div className={style.fullWidth}>

            <div className={`${style.col_pad} ${playing ? style.hidden : ''}`}>

                <div className="input">
                    <strong className={style.dateLabel}>Start : </strong>
                    <input
                        className={`${style.datepicker} ${startDateErrorMsg ? style.inputDateError : ''}`}
                        type="text"
                        onClick={toggleShowStartDate}
                        disabled={pendingReq}
                        readOnly
                        value={startDate} />
                    <div className={style.dateMsgError}>{startDateErrorMsg}</div>
                </div>

                {showStartDate ?
                    <InputMoment
                        moment={moment(startDate).utc()}
                        onChange={handleChange(DateType.Start)}
                        onSave={handleSave(DateType.Start)}
                        prevMonthIcon="fas fa-arrow-left"
                        nextMonthIcon="fas fa-arrow-right"
                    />
                : null}

            </div>

            <div className={`${style.col_pad} ${playing ? style.hidden : ''}`}>

                <div className="input">
                    <strong className={style.dateLabel}>End : </strong>
                    <input
                        className={`${style.datepicker} ${endDateErrorMsg ? style.inputDateError : ''}`}
                        type="text"
                        onClick={toggleShowEndDate}
                        readOnly
                        disabled={pendingReq}
                        value={endDate} />
                    <div className={style.dateMsgError}>{endDateErrorMsg}</div>
                </div>

                {showEndDate ?
                    <InputMoment
                        moment={moment(endDate).utc()}
                        onChange={handleChange(DateType.End)}
                        onSave={handleSave(DateType.End)}
                        prevMonthIcon="fas fa-arrow-left"
                        nextMonthIcon="fas fa-arrow-right"
                    />
                : null}

            </div>

            <div className={`${style.col} ${style.buttonsContainer}`}>
                <Button className={style.playButton} large primary type="button" onClick={play}>
                    <i className={`fas fa-${!playing ? 'play' : 'stop'}`}></i> {!playing ? 'Live Tail' : 'Stop Tail'}
                </Button>
            </div>

        </div>
    </>;
});