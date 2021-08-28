import { FC } from 'react';
import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Button } from '@/components/core';
import * as style from './DeviceEvents.module.scss';
import { usePerformSearch } from './UsePerformSearch';
import { useEventsState } from './EventsState/EventsProvider';


// tslint:disable-next-line: variable-name
export const QueryFilters: FC = observer(() => {
    const {
        state: {
            search,
            poller,
            unitSerial,
        },
        actions: {
            setIncludeMetadata,
            setSearchValue,
            setPlaying,
            setCurrentPage,
            setShowSettingsModal,
        },
    } = useEventsState();

    const performSearch = usePerformSearch();

    // toggleMetadata handles the onChange event handler for the checkbox to determine if metadata
    // should be shown along the message of an event
    function toggleMetadata(e: React.ChangeEvent<HTMLInputElement>) {
        // Update the local state includeMetadata based on if checkbox is checked
        if (e.target.checked) {
            setIncludeMetadata(true);
        } else {
            setIncludeMetadata(false);
        }
    }

    // doSearch is the event handler for the search button, it stops the live stream and performs a
    // search using the query string
    function doSearch(event: React.MouseEvent<any>) {
        // Prevent a page reload
        event.preventDefault();
        setPlaying(false);
        setCurrentPage(0);
        clearInterval(poller);
        performSearch()();
    }

    return <>
        <div className={style.fullWidth}>
            <div className={`${style.col_pad} input`}>
                <strong className={style.dateLabel}>
                    Search :
                    <a href="https://docs.graylog.org/en/3.3/pages/searching/query_language.html" target="_blank">
                        <i
                            className={`${style.searchHelp} fas fa-lg fa-question-circle`}
                            style={{ color: '#505064' }}
                        />
                    </a>
                </strong>
                <input
                    className={`${style.datepicker} ${style.search}`}
                    onChange={e => setSearchValue(e.target.value)}
                    value={search}
                    type="text"
                    placeholder="e.g. application_name:pimd" />
            </div>

            <div className={`${style.col_half} ${style.buttonsContainer}`}>
                <Button className={style.playButton} large primary type="button" onClick={doSearch}>
                    <i className={`fas fa-search`}></i> Search
                </Button>
            </div>

            <div className={style.includeMetadata}>
                <div className="input">
                    <input onChange={toggleMetadata} type="checkbox"/> Show metadata?
                </div>
            </div>

            <div className={`${style.col} ${style.buttonsContainer}`}>
                {unitSerial !== 'mesh' ?
                    <Button
                        className={style.playButton}
                        large
                        primary
                        type="button"
                        onClick={() => setShowSettingsModal(true)}
                    >
                        <i className={`fas fa-cog`}></i> Settings
                    </Button>
                : null }
            </div>
        </div>
    </>;
});