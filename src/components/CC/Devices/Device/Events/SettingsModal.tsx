import { FC } from 'react';
import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import * as style from './DeviceEvents.module.scss';
import { Modal, Button } from '@/components/core';
import { useEventsState } from './EventsState/EventsProvider';
import Select from 'react-select';
import { ValueType } from 'react-select';
import { setLoggingConfig } from '@/actions/events';
import { getErrorStatusCode } from './helpers';

// OptionType represents an option in the <Select>
interface OptionType {
    value: number
    label: string
}

// custom styles for <Select>
const dropdownStyles = {
    menuList: (provided: any) => ({
        ...provided,
        maxHeight: '200px',
    }),
};

interface Props {
    refetchNodeLoggingConfig: () => void
}

// tslint:disable-next-line: variable-name
export const SettingsModal: FC<Props> = observer(({ refetchNodeLoggingConfig }) => {
    const store = useStore();

    const {
        state: {
            blacklistedSubsystems,
            severityFilter,
            showSettingsModal,
            severityUpdated,
            blacklistedSubsystemsUpdated,
            unitSerial,
            // altSyslogServer,
        },
        actions: {
            setSeverityFilter,
            setBlacklistedSubsystems,
            setSeverityUpdated,
            setBlacklistedSubsystemsUpdated,
            setShowSettingsModal,
            setNetworkError,
        },
    } = useEventsState();

    // Get the node the couch db fetcher is associated to via unitSerial
    const node = store.domain.nodes.map.get(unitSerial);

    // Convert the blacklisted_subsystems recieved from the API to an array of OptionType (index and label) for <Select>
    // Additionally we need to set the currentSubsystems to an array of OptionType based on the blacklisted_subsystems
    // A subsystem is a category & sub category combined. Since we currently only support filtering through categories
    const availableCategories: OptionType[] = [];
    const categories = node?.nodeLoggingConfig?.available_categories || [];
    const currentSubsystems: OptionType[] = [];
    // Since the subsystem contains a "category" and "subcategory" we need to extract the
    // category since this is currently only supported
    const blacklistedCategories = node?.nodeLoggingConfig?.blacklisted_subsystems.map(val => val.category) || [];
    for (let i = 0; i < categories.length; i++) {
        availableCategories.push({value: i, label: categories[i] || ''});
        // Also get the current blacklisted categories and set this to provide the defaultValue
        if (blacklistedCategories.includes(categories[i])) {
            currentSubsystems.push({value: i, label: categories[i] || ''});
        }
    }

    // Convert the logLevels recieved from the API to an array of OptionType (index and label) for <Select>
    // Additionally we need to find the current level set
    const logLevels: OptionType[] = [];
    const levels = node?.nodeLoggingConfig?.available_levels || [];
    let currentLevel: OptionType = {value: 0, label: ''};
    for (let i = 0; i < levels.length; i++) {
        logLevels.push({value: i, label: levels[i] || ''});
        // Also get the current log level and set this to provide the defaultValue
        if (node?.nodeLoggingConfig?.level === levels[i]) {
            currentLevel = {value: i, label: levels[i] || ''};
        }
    }

    // updateSeverity updates the store with the selected label value
    function updateSeverity(value: ValueType<OptionType>) {
        const opt = value as OptionType;
        setSeverityFilter(opt.label);
        setSeverityUpdated(true);
    }

    // updateSubsystem iterates through the selected subsystems and updates the store with the label values
    function updateSubsystem(value: ValueType<OptionType>) {
        const opts = value as OptionType[] || [];
        const selectedCategories:string[] = [];
        for (const opt of opts) {
            selectedCategories.push(opt.label);
        }
        setBlacklistedSubsystems(selectedCategories);
        setBlacklistedSubsystemsUpdated(true);
    }

    // save contacts the MAS to update the logging severity and sub system filters if changed
    async function save(event: React.MouseEvent<any>) {
        // Prevent a page reload
        event.preventDefault();

        // Check which filters we need to update
        if (severityUpdated || blacklistedSubsystemsUpdated) {
            const res = await setLoggingConfig(
                store,
                unitSerial,
                node,
                severityFilter,
                blacklistedSubsystems,
                severityUpdated,
                blacklistedSubsystemsUpdated);

            if (!res.success) {
                console.error(res.message);
                setNetworkError({ status: getErrorStatusCode(store) ?? 500, message: res.message });
            }
            setSeverityUpdated(false);
            setBlacklistedSubsystemsUpdated(false);
        }

        setShowSettingsModal(false);
        refetchNodeLoggingConfig();
    }

    return <Modal
        title="VeeaHub Logging Settings"
        centered
        extended={true}
        className={style.loggingConfigModal}
        noClose
        open={showSettingsModal}
    >

        <h2>Update the fields below to filter events and logs from the VeeaHub to reduce data transfer rates</h2>

        <form>
            <strong className={style.dateLabel}>Severity Filter : </strong>
            <Select
                defaultValue={currentLevel}
                onChange={updateSeverity}
                styles={dropdownStyles}
                options={logLevels}/>

            <strong className={style.dateLabel}>Blacklisted Categories : </strong>
            <Select
                defaultValue={currentSubsystems}
                onChange={updateSubsystem}
                isMulti={true}
                styles={dropdownStyles}
                options={availableCategories}/>

            {/* <strong className={style.dateLabel}>Alternative Syslog Server : </strong>
            <input
                className={`${style.datepicker} ${style.search}`}
                type="text"
                defaultValue={altSyslogServer}
                placeholder="tcp://example.syslog.server.com"
            /> */}

            <div className={style.modalButtons}>
                <Button className={style.playButton} large primary onClick={() => setShowSettingsModal(false)}>
                    <i className={`fas fa-times`}></i> Close
                </Button>

                <Button className={style.playButton} large primary onClick={save}>
                    <i className={`fas fa-save`}></i> Save
                </Button>
            </div>
        </form>
    </Modal>;
});