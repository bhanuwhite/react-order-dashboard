import * as React from 'react';
import { FC, useState } from 'react';
import { newIdGenerator } from '@/utils/uniqueId';
import { useControllableProp, ControllableArgs } from '@/hooks/useControllable';


// tslint:disable-next-line: variable-name
export const TextArea: FC<Props & ControllableProps> = (
    { children, className, required, label, disabled, invalid, ...arg },
) => {

    const [id] = useState(newId);
    const [value, updater] = useControllableProp(arg);
    const [hasFocus, setFocus] = useState(false);

    label = label ?? '';
    label = (hasFocus || value !== '') ? '' : label;

    const classes = ['text-area'];
    if (className) {
        classes.push(className);
    }
    if (hasFocus) {
        classes.push('focus');
    }
    if (invalid) {
        classes.push('invalid');
    }
    if (disabled) {
        classes.push('disabled');
    }

    return <div className={classes.join(' ')}>
        <div className="text-area-content">
            <div className="text-area--inner">
                <label htmlFor={id}>{label}</label>
                <textarea id={id} required={required}
                    disabled={disabled}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    value={value} onChange={e => updater(e.target.value)}
                />
            </div>
            {children}
        </div>
    </div>;
};

interface Props {
    /**
     * Additional classes to set on the top level dom element.
     */
    className?: string
    /**
     * Set to true if the field should be shown as containing an invalid value.
     */
    invalid?: boolean
    /**
     * Set to true if the field should be disabled
     */
    disabled?: boolean
    /**
     * Label for the text field.
     */
    label?: React.ReactNode
    /**
     * Set the required field on the input element (only useful in a form)
     */
    required?: boolean
}
type ControllableProps = ControllableArgs<string>;

// Created separate function to avoid creating new closures
// on every render.
const newId = newIdGenerator('input');