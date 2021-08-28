import * as React from 'react';
import { FC } from 'react';
import { NodeLogsRange } from '@/store/domain/nodes';


// tslint:disable-next-line: variable-name
export const LogSelector: FC<Props> = React.memo(({ logFile, logRange, setFile }) => {

    const maxValue = logRange?.reduce((acc, val) => val.size > acc ? val.size : acc, 0) ?? 10;
    const zeroCount = Math.floor(Math.log10(maxValue));
    const topValue = zeroCount > 2 ?
        Math.ceil(maxValue / Math.pow(10, zeroCount - 2)) * Math.pow(10, zeroCount - 2) :
        Math.pow(10, zeroCount + 1);

    const secondValue = topValue * 2 / 3;
    const thirdValue = topValue / 3;

    return <div className="p-5 grid grid-flow-col grid-rows-4 grid-cols-[50px,1fr] auto-cols-fr">
        <div className="border-r border-t dark:border-gray-700 border-gray-300 pr-3">
            <div className="relative -top-2.5 dark:bg-gray-900 bg-white pr-1 text-right">
                {fmtValue(topValue)}
            </div>
        </div>
        <div className="border-r border-t  dark:border-gray-700 border-gray-300 pr-3">
            <div className="relative -top-2.5 dark:bg-gray-900 bg-white pr-1 text-right">
                {fmtValue(secondValue)}
            </div>
        </div>
        <div className="border-r border-t dark:border-gray-700 border-gray-300 pr-3">
            <div className="relative -top-2.5 dark:bg-gray-900 bg-white pr-1 text-right">
                {fmtValue(thirdValue)}
            </div>
        </div>
        <div className="border-t dark:border-gray-700 border-gray-300 pr-3">
            <div className="relative -top-2.5 dark:bg-gray-900 bg-white pr-1 text-right">
                0
            </div>
        </div>
        {logRange && logRange.map(log =>
            <div className="group contents" key={log.name} onClick={() => setFile(log.name)}>
                <div className="border-t dark:border-gray-700 border-gray-300 flex items-end">
                    <div className="mx-2 bg-primary group-hover:bg-primary-light w-full relative z-1 -bottom-px" style={
                        { height: setHeight(log.size, topValue, secondValue) }
                    }/>
                </div>
                <div className="border-t dark:border-gray-700 border-gray-300 flex items-end">
                    <div className="mx-2 bg-primary group-hover:bg-primary-light w-full relative z-1 -bottom-px" style={
                        { height: setHeight(log.size, secondValue, thirdValue) }
                    }/>
                </div>
                <div className="border-t dark:border-gray-700 border-gray-300 flex items-end">
                    <div className="mx-2 bg-primary group-hover:bg-primary-light w-full relative z-1 -bottom-px" style={
                        { height: setHeight(log.size, thirdValue, 0) }
                    }/>
                </div>
                <div className={`border-t dark:border-gray-700 border-gray-300 text-center ${log.name === logFile ? 'font-bold' : ''}`}>
                    {log.lastModified.format('MMM DD')}
                </div>
            </div>,
        )}
    </div>;
});

interface Props {
    logFile: string | null
    logRange: NodeLogsRange[] | undefined
    setFile: (newFile: string) => void
}

function setHeight(value: number, stepValue: number, prevStepValue: number): string {
    if (value < prevStepValue) {
        return '0%';
    }
    if (value > stepValue) {
        return 'calc(100% + 1px)';
    }
    return `${Math.floor((value - prevStepValue) * 100 / (stepValue - prevStepValue))}%`;
}

function fmtValue(value: number): string {
    const zeroCount = Math.floor(Math.log10(value));
    switch (zeroCount) {
        case 0:
        case 1:
        case 2:
            return `${value}`;
        case 3:
        case 4:
        case 5:
            return `${Math.floor(value / 1000)}k`;
        case 6:
        case 7:
        case 8:
            return `${Math.floor(value / 1000_000)}M`;
        default:
            return `${Math.floor(value / 1000_000_000)}B`;
    }
}