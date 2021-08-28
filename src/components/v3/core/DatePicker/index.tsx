import * as React from 'react';
import { FC } from 'react';
import moment from 'moment';
import { newIdGenerator } from '@/utils/uniqueId';
import { useOnClickOutside, useOnClickOutsideManyRefs } from '@/hooks/useOnClickOutside';
import { CalendarPicker, CalendarRangePicker } from './CalendarPicker';


/**
 * Allow a user to select a range between two dates.
 */
// tslint:disable-next-line: variable-name
export const DateRange: FC<DateRangeProps> = ({
    dateOnly,
    className,
    labelStart,
    labelEnd,
    onChange,
    value,
    disabled,
    invalid,
}) => {

    const [ idStart ] = React.useState(newId);
    const [ idEnd ] = React.useState(newId);
    const [ open, setOpen ] = React.useState(false);
    const refStart = React.useRef<HTMLDivElement>(null);
    const refEnd = React.useRef<HTMLDivElement>(null);

    const closeDropdown = React.useCallback(() => open && setOpen(false), [ setOpen, open ]);

    useOnClickOutsideManyRefs(closeDropdown, refStart, refEnd);

    // When the focus is changed inside one of the date dropdown
    const onFocusChange = React.useCallback((event: React.FocusEvent<HTMLDivElement>) => {
        const startEl = refStart.current;
        const endEl = refEnd.current;
        if (
            event.relatedTarget != null &&
            startEl != null &&
            endEl != null &&
            !startEl.contains(event.relatedTarget as Node) &&
            !endEl.contains(event.relatedTarget as Node)
        ) {
            if (open) {
                setOpen(false);
            }
        }
    }, [ open ]);

    // When the start date is changed
    const onChangeStart = React.useCallback((newValue: moment.Moment) => {
        if (newValue.isAfter(value[1])) {
            onChange([newValue, newValue.clone().add(1, 'day')]);
            return;
        }
        onChange([newValue, value[1]]);
    }, [ onChange, value ]);

    // When the end date is changed
    const onChangeEnd = React.useCallback((newValue: moment.Moment) => {
        if (newValue.isBefore(value[0])) {
            onChange([newValue.clone().subtract(1, 'day'), newValue]);
            return;
        }
        onChange([value[0], newValue]);
    }, [ onChange, value ]);

    const {
        labelClassName,
        wrapperClassName,
        topClassName,
        inputClassName,
        iconClassName,
    } = computeClassNames({ open, invalid, disabled, className: 'flex-1', boxClassName: '' });

    className = className ?? '';
    className += ' flex items-center';

    const fmttedValueStart = formatValue(value[0], dateOnly, false);
    const fmttedValueEnd = formatValue(value[1], dateOnly, false);

    const hasLabel = !!(labelStart && labelEnd);

    return <div className={className}>
        <div className={wrapperClassName}>
            {labelStart && <label className={labelClassName} htmlFor={idStart}>{labelStart}</label>}
            <div className="relative left-0 right-0 w-full text-sm">
                <div ref={refStart} className={topClassName} onBlur={onFocusChange}>
                    <div className={`flex items-center w-full h-full ${disabled ? 'cursor-not-allowed' : 'cursor-text'} ${open ? 'border-b dark:border-gray-700 border-gray-300' : ''}`}>
                        <input readOnly disabled={disabled} type="text" id={idStart}
                            onFocus={() => setOpen(true)}
                            value={fmttedValueStart}
                            className={inputClassName}
                        />
                        <div className={iconClassName}>
                            <i className="far fa-calendar-alt" />
                        </div>
                    </div>
                    {open && <div className="w-full">
                        <CalendarPicker
                            dateOnly={dateOnly} timeOnly={false}
                            value={value[0]} onChange={onChangeStart} />
                    </div>}
                </div>
                <div className="opacity-0 py-2 px-4 border border-solid">{fmttedValueStart}</div>
            </div>
        </div>
        <div className={`h-px w-5 dark:bg-gray-700 bg-gray-300 ${hasLabel ? 'relative top-3' : ''}`} />
        <div className={wrapperClassName}>
            {labelEnd && <label className={labelClassName} htmlFor={idEnd}>{labelEnd}</label>}
            <div className="relative left-0 right-0 w-full text-sm">
                <div ref={refEnd} className={topClassName} onBlur={onFocusChange}>
                    <div className={`flex items-center w-full h-full ${disabled ? 'cursor-not-allowed' : 'cursor-text'} ${open ? 'border-b dark:border-gray-700 border-gray-300' : ''}`}>
                        <input readOnly disabled={disabled} type="text" id={idEnd}
                            onFocus={() => setOpen(true)}
                            value={fmttedValueEnd}
                            className={inputClassName}
                        />
                        <div className={iconClassName}>
                            <i className="far fa-calendar-alt" />
                        </div>
                    </div>
                    {open && <div className="w-full">
                        <CalendarRangePicker
                            dateOnly={dateOnly} startDate={value[0]} endDate={value[1]}
                            onChange={onChangeEnd} />
                    </div>}
                </div>
                <div className="opacity-0 py-2 px-4 border border-solid">{fmttedValueEnd}</div>
            </div>
        </div>
    </div>;
};

interface DateRangeProps {
    /**
     * Additional classes to set on the top level dom element.
     */
    className?: string
    /**
     * Label for the start date
     */
    labelStart?: React.ReactNode
    /**
     * Label for the end date
     */
    labelEnd?: React.ReactNode
    /**
     * Set to true if the text field should be disabled
     */
    disabled?: boolean
    /**
     * Set to true if the field should be shown as containing an invalid value.
     */
    invalid?: boolean
    /**
     * Set to true if only the date should be shown
     */
    dateOnly?: boolean
    /**
     * Date to show in the picker
     */
    value: DateRangeTy
    /**
     * When the user select another value
     */
    onChange: (newValue: DateRangeTy) => void
}

type DateRangeTy = readonly [moment.Moment, moment.Moment];


/**
 * Allow a user to pick a date and/or a time.
 */
// tslint:disable-next-line: variable-name
export const DatePicker: FC<Props> = ({
    className,
    boxClassName,
    label,
    disabled,
    invalid,
    placeholder,
    value,
    onChange,
    dateOnly,
    timeOnly,
}) => {

    const [ id ] = React.useState(newId);
    const [ open, setOpen ] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);
    const closeDropdown = React.useCallback(() => open && setOpen(false), [ setOpen, open ]);

    useOnClickOutside(ref, closeDropdown);

    const onFocusChange = React.useCallback((event: React.FocusEvent<HTMLDivElement>) => {
        if (event.relatedTarget != null && !event.currentTarget.contains(event.relatedTarget as Node)) {
            if (open) {
                setOpen(false);
            }
        }
    }, [ open ]);

    const {
        labelClassName,
        wrapperClassName,
        topClassName,
        inputClassName,
        iconClassName,
    } = computeClassNames({ open, invalid, disabled, className, boxClassName });

    const fmttedValue = formatValue(value, dateOnly, timeOnly);

    return <div className={wrapperClassName}>
        {label && <label className={labelClassName} htmlFor={id}>{label}</label>}
        <div className="relative left-0 right-0 w-full text-sm">
            <div ref={ref} className={topClassName} onBlur={onFocusChange}>
                <div className={`flex items-center w-full h-full ${disabled ? 'cursor-not-allowed' : 'cursor-text'} ${open ? 'border-b dark:border-gray-700 border-gray-300' : ''}`}>
                    <input readOnly disabled={disabled} type="text" id={id}
                        placeholder={placeholder}
                        onFocus={() => setOpen(true)}
                        value={fmttedValue}
                        className={inputClassName}
                    />
                    <div className={iconClassName}>
                        <i className="far fa-calendar-alt" />
                    </div>
                </div>
                {open && <div className="w-full">
                    <CalendarPicker dateOnly={dateOnly} timeOnly={timeOnly} value={value} onChange={onChange} />
                </div>}
            </div>
            <div className="opacity-0 py-2 px-4 border border-solid">{fmttedValue}</div>
        </div>
    </div>;
};

interface Props {
    /**
     * Set to true if only the date should be shown
     */
    dateOnly?: boolean
    /**
     * Set to true if only the time should be shown
     */
    timeOnly?: boolean
    /**
     * Additional classes to set on the top level dom element.
     */
    className?: string
    /**
     * Additional classes to set on the box element
     */
    boxClassName?: string
    /**
     * Placeholder for the input
     */
    placeholder?: string
    /**
     * Label for the date field.
     */
    label?: React.ReactNode
    /**
     * Set to true if the text field should be disabled
     */
    disabled?: boolean
    /**
     * Set to true if the field should be shown as containing an invalid value.
     */
    invalid?: boolean
    /**
     * Date to show in the picker
     */
    value: moment.Moment
    /**
     * When the user select another value
     */
    onChange: (newValue: moment.Moment) => void
}

function formatValue(time: moment.Moment, dateOnly: boolean | undefined, timeOnly: boolean | undefined): string {
    if (dateOnly) {
        return time.format('MMM DD, YYYY') + (time.isSame(new Date(), 'day') ? ' (Today)' : '');
    }
    if (timeOnly) {
        return time.format('h:mm A');
    }
    return time.format('MMM DD, YYYY, h:mm A') + (time.isSame(new Date(), 'day') ? ' (Today)' : '');
}

function computeClassNames({ open, invalid, disabled, className, boxClassName }: {
    open: boolean
    invalid: boolean | undefined
    disabled: boolean | undefined
    className: string | undefined
    boxClassName: string | undefined,
}) {
    let wrapperClassName = className ?? '';
    wrapperClassName += ' flex flex-col';

    let topClassName = boxClassName ?? '';
    topClassName += ' absolute top-0 w-full inline-block border border-solid rounded-md transition-all';

    if (invalid && !open) {
        topClassName += ' border-bad focus-within:ring focus-within:ring-bad focus-within:ring-opacity-[28%]';
    } else if (!disabled) {
        // Default
        // Focus
        topClassName += ' hover:border-primary focus-within:ring focus-within:ring-primary focus-within:ring-opacity-[28%] focus-within:bg-white';
        if (!boxClassName?.includes('border-')) {
            topClassName += ' dark:border-gray-700 border-gray-300';
        }
    } else {
        topClassName += ' dark:border-gray-700 border-gray-200';
    }

    if (disabled) {
        topClassName += ' dark:bg-gray-700/75 bg-gray-100/75';
    } else if (!boxClassName?.includes('bg-')) {
        topClassName += ' dark:bg-gray-800 bg-white';
    }

    topClassName += open ? ' z-20' : ' z-10';

    let labelClassName = 'w-max text-xs mb-1.5';

    if (open) {
        labelClassName += invalid ? ' text-bad' : ' text-primary';
    } else {
        labelClassName += ' text-gray-500';
    }

    const inputClassName = 'peer text-sm rounded-md focus:outline-none py-2 px-4 w-full flex-auto dark:text-gray-100'
        + ' disabled:text-gray-400 dark:disabled:text-gray-600 disabled:placeholder-gray-300 disabled:cursor-not-allowed'
        + ' placeholder-gray-400 bg-transparent';

    const iconClassName = 'pr-3 '
        + (open ? 'text-primary' : 'text-gray-300 dark:text-gray-100 dark:peer-disabled:text-gray-600');

    return {
        inputClassName,
        iconClassName,
        wrapperClassName,
        topClassName,
        labelClassName,
    };
}

// Created separate function to avoid creating new closures
// on every render.
const newId = newIdGenerator('input');