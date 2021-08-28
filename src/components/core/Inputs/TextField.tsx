import * as React from 'react';
import { FC, useState } from 'react';
import { newIdGenerator } from '@/utils/uniqueId';
import { useControllableProp, ControllableArgs } from '@/hooks/useControllable';


// tslint:disable-next-line: variable-name
export const TextField: FC<Props & ControllableProps> = ({
    type,
    invalid,
    disabled,
    innerLabelAbove,
    outerLabelAbove,
    children,
    className,
    autoComplete,
    prependIcon,
    appendIcon,
    inputRef,
    onFocusOut,
    onAppendIconClick,
    onPrependIconClick,
    required,
    label,
    min,
    max,
    ...arg
}) => {

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
    if (disabled) {
        classes.push('disabled');
    }
    if (innerLabelAbove) {
        classes.push('inner-label-above');
    }

    const textFieldInner = <div className={classes.join(' ')}>
        <div className="text-field-content">
            {prependIcon ? <PrependIcon icon={prependIcon} onClick={onPrependIconClick} /> : null}
            <div className="text-field--inner">
                {label && !outerLabelAbove && <label htmlFor={id}>{label}</label>}
                <input disabled={disabled} type={type ?? 'text'} id={id} required={required}
                    onFocus={() => setFocus(true)}
                    onBlur={(ev) => (setFocus(false), onFocusOut?.(ev))}
                    value={value} onChange={e => updater(e.target.value)}
                    ref={inputRef}
                    autoComplete={autoComplete}
                    min={min}
                    max={max}
                />
            </div>
            {appendIcon ? <AppendIcon icon={appendIcon} onClick={onAppendIconClick} /> : null}
        </div>
        {children}
    </div>;

    if (outerLabelAbove) {
        return <div className={'flex flex-col' + (className ? ` ${className}` : '')}>
            {label && outerLabelAbove && <label className="w-max" htmlFor={id}><b>{label}</b></label>}
            {textFieldInner}
        </div>;
    } else {
        return textFieldInner;
    }
};

interface Props {
    /**
     * Type of input
     */
    type?: 'password' | 'number' | 'text' | 'email'
    /**
     * Additional classes to set on the top level dom element.
     */
    className?: string
    /**
     * Icon to prepend inside the text field.
     */
    prependIcon?: string
    /**
     * Icon to append inside the text field.
     */
    appendIcon?: string
    /**
     * Set to true if the field should be shown as containing an invalid value.
     */
    invalid?: boolean
    /**
     * Set to true if the text field should be disabled
     */
    disabled?: boolean
    /**
     * Set to true to have the label shown above the field and inside the textfield border.
     */
    innerLabelAbove?: boolean
    /**
     * Set to true to have the label shown above the field and outside the textfield border.
     */
    outerLabelAbove?: boolean
    /**
     * Click handler for the prepended icon
     */
    onPrependIconClick?: () => void
    /**
     * Click handler for the appended icon
     */
    onAppendIconClick?: () => void
    /**
     * Label for the text field.
     */
    label?: React.ReactNode
    /**
     * Set the required field on the input element (only useful in a form)
     */
    required?: boolean
    /**
     * Input ref on which to manually perform input DOM operations
     */
    inputRef?: React.RefObject<HTMLInputElement> | ((instance: HTMLInputElement | null) => void)
    /**
     * Called when the focus on the input was lost
     */
    onFocusOut?: (ev: React.FocusEvent<HTMLInputElement>) => void
    /**
     * Browser autocomplete value
     */
    autoComplete?: string
    /**
     * Specifies the minimum value allowed (inputs with number type)
     */
    min?: number
    /**
     * Specifies the maximum value allowed (inputs with number type)
     */
    max?: number
}
type ControllableProps = ControllableArgs<string>;

// Created separate function to avoid creating new closures
// on every render.
const newId = newIdGenerator('input');


// tslint:disable-next-line: variable-name
export const PrependIcon: FC<{ icon: string, onClick?: () => void }> = ({ icon, onClick }) => (
    <div onClick={onClick} className="text-field--icon text-field--prepend-icon"><i className={icon} /></div>
);

// tslint:disable-next-line: variable-name
export const AppendIcon: FC<{ icon: string, onClick?: () => void }> = ({ icon, onClick }) => (
    <div onClick={onClick} className="text-field--icon text-field--append-icon"><i className={icon} /></div>
);