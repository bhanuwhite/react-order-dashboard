import * as React from 'react';
import { FC } from 'react';
import moment from 'moment';
import { Spinner } from '@/components/v3/core';


// tslint:disable-next-line: variable-name
export const Logs: FC<Props> = React.memo(({ logFile, deviceId }) => {

    // Used to control when react should re-render this component
    const [ _reRender, setReRender ] = React.useState(false);
    const [ loading, setLoading ] = React.useState(false);
    const logs = React.useRef([] as Log[][]);

    React.useEffect(() => {

        // Reset logs
        logs.current = [];
        setReRender(a => !a);

        if (logFile) {

            setLoading(true);

            // Start fetching them
            const state: State = {
                cancelled: false,
                logs: logs.current,
                refresh: () => setReRender(a => !a),
            };

            fetchNodeLogs(deviceId, logFile, state)
                .then(() => !state.cancelled && setLoading(false))
                .catch(err => {
                    console.error(err);
                    if (!state.cancelled) {
                        setLoading(false);
                    }
                });

            // Cancel fetch if the file changed.
            return () => {
                state.cancelled = true;
            };
        }

    }, [ logFile, deviceId ]);

    return <>
        <table className="py-2 font-mono">
            <tbody className="align-baseline">
                {logs.current.map((batch, i) => <LogsBatch batch={batch} key={i} />)}
            </tbody>
        </table>
        {loading ?
            <div className="flex justify-center items-center py-2"><Spinner /></div> :
            <div className="text-center py-0.5">End of logs</div>
        }
    </>;
});

// tslint:disable-next-line: variable-name
const LogsBatch: FC<{ batch: Log[] }> = React.memo(({ batch }) => <>
    {batch.map((log, i) => <tr key={i} className="hover:bg-primary-light/10 border-b dark:border-gray-800 border-gray-300">
        <td className="select-none pl-3 pr-1 py-0.5 dark:text-gray-500 text-gray-400 whitespace-nowrap">{log.date}</td>
        <td className="px-0.5 py-0.5">
            <span className={colorForSource(log.source[0])}>{log.source[0] || ''}</span>
            <span className="dark:text-gray-300 text-gray-500">:</span>
            <span className={colorForLevel(log.source[1])}>{log.source[1] || ''}</span>
        </td>
        <td className="pl-1 pr-3 py-0.5 whitespace-pre-wrap" style={{ wordBreak: 'break-word' }}>{log.message}</td>
    </tr>)}
</>);

function colorForSource(sourceName: string): string {
    if (sourceName.startsWith('kern')) {
        return 'text-pink-700';
    }
    return 'text-green-700';
}

function colorForLevel(sourceLevel: string): string {
    if (sourceLevel.startsWith('warn')) {
        return 'text-yellow-700';
    }
    if (sourceLevel.startsWith('err')) {
        return 'text-red-700';
    }
    if (sourceLevel.startsWith('info')) {
        return 'text-blue-700';
    }
    return 'dark:text-gray-300 text-gray-500';
}

interface Props {
    logFile: string | null
    deviceId: string
}

interface Log {
    date: string
    source: [string, string]
    message: string
}

function parseLog(line: string): Log {
    const [
        date,
        _unitSerial,
        source,
        ...rest
    ] = line.split(' ');
    return {
        date: moment(date).format('MMM DD HH:mm:ss.SSS'),
        source: source.split(':') as [string, string],
        message: rest.join(' '),
    };
}

async function fetchNodeLogs(
    deviceId: string,
    logFile: string,
    state: State,
) {
    const result = await fetch(`/mas/v1/vhlog/${deviceId}/${logFile}`);
    const reader = result.body?.pipeThrough(new TextDecoderStream())
        .getReader();

    let partialChunk = '';

    while (reader) {
        const { value, done } = await reader.read();
        if (done) {
            break;
        }
        if (state.cancelled) {
            reader.cancel();
            break;
        }
        const data = partialChunk + value;
        const chunks = data.split('\n');
        partialChunk = chunks.pop()!; // The array always has one value
        let i = state.logs.length - 1;
        if (i < 0) {
            i++;
            state.logs.push([]);
        }
        for (const chunk of chunks) {
            if (chunk.length > 0) {
                if (state.logs[i].length < 1000) {
                    state.logs[i].push(parseLog(chunk));
                } else {
                    i++;
                    state.logs.push([]);
                }
            }
        }
        state.refresh();
    }
}

interface State {
    cancelled: boolean
    logs: Log[][]
    refresh: () => void
}