import * as React from 'react';
import { FC, useRef, useState } from 'react';
import moment, { Moment } from 'moment';
import InputMoment from 'input-moment';
import { Button, Modal, Separator, Spinner } from '@/components/core';
import * as styles from './DeviceLogs.module.scss';
import { downloadLogFile, fetchLogFileList, rotateLogFile } from '@/actions/device_logs';
import { useStore } from '@/hooks/useStore';
import { ErrorBox } from '@/components/core/Errors';
import { downloadTextFile } from './helpers';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MAS_REQUEST_BATCH_SIZE = 3;
const utcMoment = (dateString?: string) => moment(dateString).utc();

// tslint:disable-next-line: variable-name
export const DeviceLogs: FC<{ unitSerial: string, masId: string }> = ({ unitSerial, masId }) => {
    const [startDate, setStartDateValue] = useState<string>(utcMoment().startOf('day').subtract(1, 'day').format());
    const [endDate, setEndDateValue] = useState<string>(utcMoment().endOf('day').format());
    const [showStartDate, setShowStartDate] = useState<boolean>(false);
    const [showEndDate, setShowEndDate] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [downloading, setDownloading] = useState<boolean>(false);
    const [rotating, setRotating] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [downloadObjectUrl, setDownloadObjectUrl] = useState<string>('');
    const startDatePickerRef = useRef<HTMLDivElement>(null);
    const endDatePickerRef = useRef<HTMLDivElement>(null);
    const store = useStore();

    const datePickerRefs = { start: startDatePickerRef, end: endDatePickerRef };
    const showDateFlags = { start: showStartDate, end: showEndDate };
    const setShowDateFlags = { start: setShowStartDate, end: setShowEndDate };
    useCustomDatePickerBehavior(datePickerRefs, showDateFlags, setShowDateFlags);

    React.useEffect(() => clearDownloadObjectUrl, []);

    if (!store.view.activeuser.hasDeviceLogsFeature) {
        return null;
    }

    function handleInputChange(flag: DateRangeType) {
        return (date: Moment) => {
            if (flag === DateRangeType.Start) {
                if (date.isAfter(endDate)) {
                    setErrorMessage('Start date cannot be after the end date.');
                } else {
                    setErrorMessage('');
                }
                setStartDateValue(date.utc().format());
            } else {
                if (date.isBefore(startDate)) {
                    setErrorMessage('End date cannot be before the start date.');
                } else {
                    setErrorMessage('');
                }
                setEndDateValue(date.utc().format());
            }
        };
    }

    async function tryOperation(operationType: OperationType, fn: () => Promise<void>) {
        setErrorMessage('');
        if (operationType === OperationType.Download) {
            setDownloading(true);
        } else {
            setRotating(true);
        }
        try {
            await fn();
        } catch (err) {
            if (operationType === OperationType.Download) {
                setDownloading(false);
            } else {
                setRotating(false);
            }
            setErrorMessage(err.message);
        }
    }

    async function handleRotateLogs() {
        tryOperation(OperationType.Rotate, async () => {
            await rotateLogFile(store, masId);
            setModalOpen(true);
            setRotating(false);
        });
    }

    async function handleDownloadLogs() {
        tryOperation(OperationType.Download, async () => {
            clearDownloadObjectUrl();
            const formattedDateRange = getFormattedDatesForRequest();
            const logFileList = await fetchLogFileList(store, formattedDateRange, unitSerial);
            await fetchLogFiles(logFileList);
        });
    }

    async function fetchLogFiles(logFileList: string[]) {
        tryOperation(OperationType.Download, async () => {
            const results:string[]= [];
            for (let i = 0; i < logFileList.length; i += MAS_REQUEST_BATCH_SIZE) {
                const batch = logFileList.slice(i, i + MAS_REQUEST_BATCH_SIZE);
                const batchResults = await Promise.all(batch.map(lg => downloadLogFile(store, unitSerial, lg)));
                results.push(...batchResults);
            }
            downloadAllLogs(results.join(''));
        });
    }

    function downloadAllLogs(allLogs: string) {
        const formattedDateRange = getFormattedDatesForRequest();
        const fileName = `${unitSerial}_${formattedDateRange.start}_${formattedDateRange.end}.log`;
        const objectUrl = downloadTextFile(fileName, allLogs);
        setDownloadObjectUrl(objectUrl);
        setDownloading(false);
    }

    function clearDownloadObjectUrl() {
        if (!!downloadObjectUrl) {
            URL.revokeObjectURL(downloadObjectUrl);
            setDownloadObjectUrl('');
        }
    }

    function getFormattedDatesForRequest() {
        const formatTokens = 'YYYY-MM-DDTHH:mm:ss';
        return {
            start: utcMoment(startDate).format(formatTokens),
            end: utcMoment(endDate).format(formatTokens),
        };
    }

    const startDatePickerClass = styles.datePicker + (showStartDate ? ` ${styles.datePickerShow}` : '');
    const endDatePickerClass = styles.datePicker + (showEndDate ? ` ${styles.datePickerShow}` : '');
    const dateRangeIsInvalid = moment(startDate).isAfter(endDate);

    return <div className="p-15 pt-15 pb-30 lg:p-30 lg:pb-50">
        <Separator className="mt-0" sticky>VeeaHub Logs</Separator>
        {errorMessage && <ErrorBox>{errorMessage}</ErrorBox>}
        <h3 className={styles.dateRangeLabel}>Date Range:</h3>
        <div className={styles.dateRangeContainer}>
            <div>
                <strong className={styles.dateLabel}>Start: </strong>
                <input
                    className={styles.datePickerInput + (showStartDate ? ` ${styles.datePickerInputShow}` : '')}
                    type="text"
                    onClick={() => setShowStartDate(prevState => !prevState)}
                    readOnly
                    value={utcMoment(startDate).format()}
                />
                <div className={startDatePickerClass} ref={startDatePickerRef}>
                    <InputMoment
                        moment={utcMoment(startDate)}
                        onChange={handleInputChange(DateRangeType.Start)}
                        prevMonthIcon="fas fa-arrow-left"
                        nextMonthIcon="fas fa-arrow-right"
                    />
                </div>
            </div>

            <div>
                <strong className={styles.dateLabel}>End: </strong>
                <input
                    className={styles.datePickerInput + (showEndDate ? ` ${styles.datePickerInputShow}` : '')}
                    type="text"
                    onClick={() => setShowEndDate(prevState => !prevState)}
                    readOnly
                    value={utcMoment(endDate).format()}
                />
                <div className={endDatePickerClass} ref={endDatePickerRef}>
                    <InputMoment
                        moment={utcMoment(endDate)}
                        onChange={handleInputChange(DateRangeType.End)}
                        prevMonthIcon="fas fa-arrow-left"
                        nextMonthIcon="fas fa-arrow-right"
                    />
                </div>
            </div>

            <div>
                <Button primary large
                    disabled={downloading || dateRangeIsInvalid}
                    onClick={handleDownloadLogs}
                    className={styles.downloadLogsButton + (downloading ? ` ${styles.activeLogsButton}` : '')}>
                    {!downloading ?
                        <i className="fas fa-download"></i>
                        : <div className={styles.spinnerButtonWrapper}><Spinner /></div>
                    }
                    Download logs
                </Button>
            </div>
        </div>

        <Separator className={styles.separator}/>

        <Button primary large
            disabled={rotating || dateRangeIsInvalid}
            onClick={handleRotateLogs}
            className={styles.rotateLogsButton + (rotating ? ` ${styles.activeLogsButton}` : '')}>
            {!rotating ?
                <i className="fas fa-sync-alt"></i>
                : <div className={styles.spinnerButtonWrapper}><Spinner /></div>
            }
            Rotate logs
        </Button>

        <div className={`${styles.rotateLogsNote} bkg-light-yellow`}>
            <i className="fas fa-2x fa-info-circle"></i>
            <div>Note:<br/>
                This will rotate the current log file so it can be downloaded.<br/>
                Please allow a minute or two until attempting to download the new log file.
                If the unit has recently rebooted, the logs may not be available for a further 15 minutes.
            </div>
        </div>

        <RotateLogsSuccessModal open={modalOpen} onClose={() => setModalOpen(false)}/>
    </div>;
};

// tslint:disable-next-line: variable-name
export const RotateLogsSuccessModal: FC<RotateLogsSuccessModalProps> = ({ open, onClose }) => (
    <Modal centered extended open={open} onClose={onClose}>
        {/* <img src={`${ASSETS_IMAGES_FOLDER}/modal/icon-success.svg`} style={{ height: '64px', marginBottom: '10px' }} /> */}
        <h1>Success!</h1>
        <hr />
        <h2 style={{fontSize: '16px', color: 'black' }}>
            Please allow a minute or two until attempting to download the new log file.
            If the unit has recently rebooted, the logs may not be available for a further 15 minutes.
        </h2>
        <Button style={{ marginTop: 20 }} onClick={onClose} wide success large>Close</Button>
    </Modal>
);

/**
 * This hook provides custom behavior for the <InputMoment/> component on this screen.
 * It listens for clicks at various positions on the screen relative to the datepicker and
 * will conditionally show / hide the component based on user activity.
 * @param dateRefs
 * @param showDateFlags
 * @param setShowDateFlags
 */
function useCustomDatePickerBehavior(
    dateRefs: DateRefs,
    showDateFlags: ShowDateFlags,
    setShowDateFlags: SetShowDateFlags,
) {
    React.useEffect(() => {
        function clickHandler(event: MouseEvent) {
            const targetNode: HTMLElement = event?.target as HTMLElement;

            const isInputClick = targetNode.nodeName.toLowerCase() === 'input';
            const isDateCellClick = targetNode.nodeName.toLowerCase() === 'td' &&
                !daysOfWeek.includes(targetNode.textContent ?? '');

            const clickOccurredOutsideStartDateModal = dateRefs.start.current &&
                !dateRefs.start.current.contains(targetNode as Node);

            const clickOccurredOutsideEndDateModal = dateRefs.end.current &&
                !dateRefs.end.current.contains(targetNode as Node);

            const shouldCloseStartDateModal = clickOccurredOutsideStartDateModal ||
                (!clickOccurredOutsideStartDateModal && isDateCellClick);

            const shouldCloseEndDateModal = clickOccurredOutsideEndDateModal ||
                (!clickOccurredOutsideEndDateModal && isDateCellClick);

            const isOppositeInput = isInputClick && (
                (showDateFlags.start && clickOccurredOutsideStartDateModal) ||
                (showDateFlags.end && clickOccurredOutsideEndDateModal));

            if (isOppositeInput || (showDateFlags.start && shouldCloseStartDateModal)) {
                setShowDateFlags.start(false);
            }

            if (isOppositeInput || (showDateFlags.end && shouldCloseEndDateModal)) {
                setShowDateFlags.end(false);
            }

            if (isDateCellClick && (shouldCloseStartDateModal || shouldCloseEndDateModal)) {
                targetNode.click();
            }
        }
        window.addEventListener('mousedown', clickHandler);
        return () => window.removeEventListener('mousedown', clickHandler);
    }, [ showDateFlags.start, showDateFlags.end ]);
}

interface DateRefs {
    start: React.RefObject<HTMLDivElement>
    end: React.RefObject<HTMLDivElement>
}

interface ShowDateFlags {
    start: boolean
    end: boolean
}

interface SetShowDateFlags {
    start: React.Dispatch<React.SetStateAction<boolean>>
    end: React.Dispatch<React.SetStateAction<boolean>>
}

interface RotateLogsSuccessModalProps {
    open: boolean
    onClose(): void
}

enum DateRangeType {
    Start,
    End,
}

enum OperationType {
    Download,
    Rotate,
}