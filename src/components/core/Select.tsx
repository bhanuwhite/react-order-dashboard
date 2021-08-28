import * as React from 'react';
import { useState } from 'react';
import { newIdGenerator } from '@/utils/uniqueId';
import { useControllableProp, ControllableArgs } from '@/hooks/useControllable';


// tslint:disable-next-line: variable-name
export function Select<T extends string | number>(
    {
        inputRef,
        innerLabelAbove,
        outerLabelAbove,
        invalid,
        children,
        disabled,
        className,
        innerClassName,
        required,
        label,
        onFocusOut,
        autoComplete,
        ...arg
    }: Props & ControllableArgs<T>,
) {

    const [id] = useState(newId);
    const [value, updater] = useControllableProp(arg);
    const [hasFocus, setFocus] = useState(false);

    label = label ?? '';
    label = !innerLabelAbove && !outerLabelAbove && (hasFocus || value !== '') ? '' : label;

    const classes = ['text-field'];
    if (className && !outerLabelAbove) {
        classes.push(className);
    }
    if (hasFocus) {
        classes.push('focus');
    }
    if (invalid) {
        classes.push('invalid');
    }
    if (innerLabelAbove) {
        classes.push('inner-label-above');
    }

    const selectFieldInner = <div className={classes.join(' ')}>
        <div className="text-field-content">
            <div className="text-field--inner">
                {label && !outerLabelAbove && <label htmlFor={id}>{label}</label>}
                <select ref={inputRef} disabled={disabled} className={'select-menu' + (innerClassName ? ` ${innerClassName}` : '')}
                    onChange={e => updater(
                        (typeof value === 'string' ? e.target.value : Number(e.target.value)) as T,
                    )}
                    onFocus={() => setFocus(true)}
                    onBlur={(ev) => (setFocus(false), onFocusOut?.(ev))}
                    required={required}
                    value={value}
                    id={id}
                    autoComplete={autoComplete}>
                    {children}
                </select>
            </div>
        </div>
    </div>;

    if (outerLabelAbove) {
        return <div className={'flex flex-col' + (className ? ` ${className}` : '')}>
            {label && outerLabelAbove && <label className="w-max" htmlFor={id}><b>{label}</b></label>}
            {selectFieldInner}
        </div>;
    } else {
        return selectFieldInner;
    }
}

interface Props {
    /**
     * Additional classes to set on the top level dom element.
     */
    className?: string
    /**
     * Additional classes to set on the select HTML node
     */
    innerClassName?: string
    /**
     * Label for the text field.
     */
    label?: React.ReactNode
    /**
     * Set to true to have the label shown above the field and inside the select border.
     */
    innerLabelAbove?: boolean
    /**
     * Set to true to have the label shown above the field and outside the select border.
     */
    outerLabelAbove?: boolean
    /**
     * Set to true if field should be disabled
     */
    disabled?: boolean
    /**
     * Set the required field on the input element (only useful in a form)
     */
    required?: boolean
    /**
     * Set to true if the field should be shown as containing an invalid value
     */
    invalid?: boolean
    /**
     * React children
     */
    children: React.ReactNode
    /**
     * Ref to select element
     */
    inputRef?: React.RefObject<HTMLSelectElement> | ((instance: HTMLSelectElement | null) => void)
    /**
     * Called when the focus on the input was lost
     */
    onFocusOut?: (ev: React.FocusEvent<HTMLSelectElement>) => void
    /**
     * Browser autocomplete value
     */
    autoComplete?: string
}

// Created separate function to avoid creating new closures
// on every render.
const newId = newIdGenerator('input');