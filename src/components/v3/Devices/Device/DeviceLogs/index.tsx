import * as React from 'react';
import { FC } from 'react';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { observer } from 'mobx-react-lite';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useNode } from '@/hooks/useNode';
import { Button, TextBox } from '@/components/v3/core';
import { useNodeLogsBetweenFetcher } from '@/hooks/fetchers';
import { Logs } from './Logs';
import { LogSelector } from './LogSelector';
import { useStore } from '@/hooks/useStore';
import { NotAllowed } from '@/components/v3/NotAllowed';


// tslint:disable-next-line: variable-name
export const DeviceLogs: FC<Props> = observer(({}) => {

    // Make sure when this component is mounted that we scroll to the top.
    useScrollToTop();

    const store = useStore();
    const history = useHistory();
    const hasDeviceLogsFeature = store.view.activeuser.hasDeviceLogsFeature;
    const query = new URLSearchParams(history.location.search);

    const today = moment().utc().hour(23).minute(0).second(0).millisecond(0);
    const before = getDate(query.get('before'), today);
    const after =  getDate(query.get('after'), today.clone().subtract(7, 'days'));
    const logFile = query.get('file');

    const { selectedGroupId, deviceId } = useParams<{ selectedGroupId: string, deviceId: string }>();
    // FIXME: use error handling v2
    const { node, esNode /*, loading, error */ } = useNode(deviceId, { isInvalid: !hasDeviceLogsFeature });

    // FIXME: use error handling v2
    const {
        loading: logRangeLoading,
    } = useNodeLogsBetweenFetcher(
        deviceId,
        before.toISOString().slice(0, -5),
        after.toISOString().slice(0, -5),
        { isInvalid: !hasDeviceLogsFeature },
    );
    const logRange = node?.logsRanges;

    React.useEffect(() => {

        if (logRangeLoading && logRange && logRange.length > 0) {
            query.set('file', logRange[0].name);
            history.replace({
                ...history.location,
                search: `?${query}`,
            });
        }

    }, [ logRangeLoading ]);

    const name = esNode?.name ?? deviceId;

    const setFile = React.useCallback((file: string) => {
        query.set('file', file);
        history.replace({
            ...history.location,
            search: `?${query}`,
        });
    }, [ history ]);

    if (!hasDeviceLogsFeature) {
        return <NotAllowed />;
    }

    return <div className="mx-4 md:mx-0 mb-4">
        <div className="flex justify-between flex-wrap">
            <h1 className="text-2xl font-medium mb-4">
                <Link to={`/${selectedGroupId}/devices`} className="text-primary hover:underline">VeeaHubs</Link>
                <i className="mx-3 text-xl fas fa-caret-right text-gray-300" />
                <Link to={`/${selectedGroupId}/devices/${deviceId}`} className="text-primary hover:underline">
                    {name}
                </Link>
                <i className="mx-3 text-xl fas fa-caret-right text-gray-300" />
                Logs
            </h1>
        </div>
        <div className="rounded border dark:bg-gray-900 dark:text-white bg-white border-solid dark:border-gray-800 border-gray-300 text-sm mb-6">
            <div className="rounded-t sticky top-14 lg:top-16 border-b border-solid dark:border-gray-800 dark:bg-gray-900 border-gray-300 bg-white">
                <div className="p-5 flex items-center">
                    <div className="font-medium uppercase">Range</div>
                    <TextBox defaultValue="" placeholder="Before" />
                    <TextBox defaultValue="" placeholder="After" />
                    <Button>View logs</Button>
                </div>
                <LogSelector logFile={logFile} logRange={logRange} setFile={setFile} />
            </div>
            <Logs logFile={logFile} deviceId={deviceId} />
        </div>
    </div>;
});

interface Props {}


function getDate(date: string | null, defaultDate: moment.Moment): moment.Moment {
    const parsedDate = moment.utc(date);
    if (parsedDate.isValid()) {
        return parsedDate;
    }
    return defaultDate;
}