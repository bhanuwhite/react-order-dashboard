import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import * as React from 'react';
import { FC } from 'react';


// tslint:disable-next-line: variable-name
export function Dropdown<T extends string | { name: string, id: string } | number>({
    onChange,
    options,
    value,
    optionToNode,
    ...rest
}: Props<T>) {

    if (!optionToNode) {
        optionToNode = (val) => {
            if (typeof val === 'string' || typeof val === 'number') {
                return val;
            }
            if (typeof val === 'object' && 'name' in val) {
                return val.name;
            }
            return `${val}`;
        };
    }

    return <DropdownBox selectedEntry={optionToNode(value, true)} {...rest}>
        {options.map(val =>
            <button key={toKey(val)} type="button" onClick={() => onChange(val)} className="w-full focus-visible:outline-black py-2 px-4 hover:text-primary flex justify-between items-center outline-none hover:bg-primary-light/10">
                {optionToNode!(val, false)}
                {val === value && <i className="fas fa-check-circle text-primary relative -right-1"/>}
            </button>,
        )}
    </DropdownBox>;
}

interface Props<T> extends BaseProps {
    value: T
    options: T[]
    onChange: (newValue: T) => void
    optionToNode?: (val: T, selectedEntry: boolean) => React.ReactNode
    className?: string
}

function toKey<T extends string | { id: string } | number>(val: T): string {
    if (typeof val === 'string' || typeof val === 'number') {
        return `${val}`;
    }
    return val.id;
}


// tslint:disable-next-line: variable-name
export const DropdownBox: FC<DropdownBoxProps> = ({
    selectedEntry,
    children,
    className,
    label,
    labelClassName,
    invalid,
    disabled,
    selectOptionText,
    btnClassName: dropdownClassNameStyle,
    dropdownContentClassName,
}) => {

    const [ open, setOpen ] = React.useState(false);
    const [ hasFocus, setFocus ] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);

    const closeDropdown = React.useCallback(() => open && setOpen(false), [ setOpen, open ]);

    useOnClickOutside(ref, closeDropdown);

    if (!labelClassName) {
        labelClassName = 'w-max text-xs mb-1.5';
    }
    if (hasFocus) {
        labelClassName += invalid ? ' text-bad' : ' text-primary';
    } else {
        labelClassName += ' text-gray-500';
    }

    selectOptionText = selectOptionText ?? 'Select...';
    className = className ?? '';

    if (className.includes('flex')) {
        className += ' flex-col';
    } else {
        className += ' flex flex-col';
    }

    const btnClassName = 'rounded-md flex justify-between items-center group outline-none py-2 px-4 w-full flex-auto bg-transparent ' +
        'disabled:text-gray-400 dark:text-gray-100 dark:disabled:text-gray-600 ' +
        (open ? 'text-primary' : '');

    let dropdownClassName = 'absolute top-0 focus-within:ring focus-within:ring-opacity-[28%] w-full border border-solid transition-all flex flex-col items-start';
    const hasCustomStyle = typeof dropdownClassNameStyle === 'string';

    if (disabled) {
        dropdownClassName += ' rounded-md dark:bg-gray-700/75 bg-gray-100/75';
    } else if (!hasCustomStyle || open) {
        dropdownClassName += ' rounded-md dark:bg-gray-800 bg-white';
    } else {
        dropdownClassName += ` ${dropdownClassNameStyle}`;
    }

    if (invalid && !open) {
        dropdownClassName += ' border-bad focus-within:ring-bad';
    } else if (!disabled && !hasCustomStyle) {
        // Default
        // Focus
        dropdownClassName += ' dark:border-gray-700 border-gray-300 hover:border-primary focus-within:ring-primary';
    } else if (disabled) {
        dropdownClassName += ' dark:border-gray-700 border-gray-200';
    }

    // Depth to make sure the dropdown goes over other dropdown when open
    dropdownClassName += open ? ' z-20' : ' z-10';

    return <div className={className}>
        {label && <span className={labelClassName}>{label}</span>}
        <div className="relative left-0 right-0 w-full text-sm">
            <div ref={ref} className={dropdownClassName} onClick={() => setOpen(!open)}>
                <button type="button" onClick={() => setOpen(!open)} disabled={disabled} className={btnClassName}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : 'false'}
                >
                    {open ? selectOptionText : selectedEntry}
                    <i className={`fas ${invalid && !open ? 'group-focus:text-bad' : 'group-focus:text-primary'} ${open ? 'fa-caret-up' : 'fa-caret-down'}`} />
                </button>
                <div className={`${dropdownContentClassName} ${open ? 'w-full' : 'hidden'}`}>
                    {children}
                </div>
            </div>
            {/*
                The logic was changed so that keyboard focus is not crazily jumping between
                random places. So the same button is kept when the dropdown is opened/closed.
                This hack help make sure that the size of the dropdown is correct as well.
                As everything is rendered in an absolute layer we sadly need the browser
                to render this entry to get the size/width correctly.
            */}
            <div className="opacity-0 py-2 px-4 border border-solid">{selectedEntry}</div>
        </div>
    </div>;
};

interface BaseProps {
    /**
     * Additional classes to set on the top level dom element.
     */
    className?: string
    /**
     * Class name for the label
     */
    labelClassName?: string
    /**
     * Additional classes for the dropdown content
     */
    dropdownContentClassName?: string
    /**
     * Additional classes for the btn that trigger the opening of the dropdown
     */
    btnClassName?: string
    /**
     * Label for the dropdown.
     */
    label?: React.ReactNode
    /**
     * Set to true if the field should be shown as containing an invalid value.
     */
    invalid?: boolean
    /**
     * Set to true if the text field should be disabled
     */
    disabled?: boolean
    /**
     * Select option text (default to 'Select...')
     */
    selectOptionText?: string
}

interface DropdownBoxProps extends BaseProps {
    /**
     * Entry shown in the dropdown
     */
    selectedEntry: React.ReactNode
}