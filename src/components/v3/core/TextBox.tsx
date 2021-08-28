import * as React from 'react';
import { FC } from 'react';
import { newIdGenerator } from '@/utils/uniqueId';
import { useControllableProp, ControllableArgs } from '@/hooks/useControllable';


// tslint:disable-next-line: variable-name
export const TextBox: FC<Props & ControllableProps> = ({
    type,
    placeholder,
    invalid,
    disabled,
    innerLabel,
    labelClassName,
    children,
    className,
    autoComplete,
    prependIcon,
    appendIcon,
    appendSubmit,
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

    const [ id ] = React.useState(newId);
    const [ value, updater ] = useControllableProp(arg);
    const [ hasFocus, setFocus ] = React.useState(false);

    label = label ?? '';
    // label = !innerLabelAbove && !outerLabelAbove && (hasFocus || value !== '') ? '' : label;

    const classes = [
        'inline-block border border-solid rounded-md transition-all',
    ];
    if (className && innerLabel) {
        classes.push(className);
    }
    if (invalid) {
        classes.push(
            'border-bad focus-within:ring focus-within:ring-bad focus-within:ring-opacity-[28%]',
        );
    } else if (!disabled) {
        // Default
        // Focus
        classes.push(
            'hover:border-primary focus-within:ring focus-within:ring-primary focus-within:ring-opacity-[28%] focus-within:bg-white',
        );
        if (!className?.includes('border-')) {
            classes.push('dark:border-gray-700 border-gray-300');
        }
        if (!className?.includes('bg-')) {
            classes.push('dark:bg-gray-800 bg-white');
        }
    }

    if (!labelClassName) {
        labelClassName = 'w-max text-xs mb-1.5';
    }
    if (hasFocus) {
        labelClassName += invalid ? ' text-bad' : ' text-primary';
    } else {
        labelClassName += ' text-gray-500';
    }

    const textFieldInner = <div className={classes.join(' ')}>
        <div className="relative flex items-center w-full h-full cursor-text">
            {label && innerLabel && <label htmlFor={id}>{label}</label>}
            <input disabled={disabled} type={type ?? 'text'} id={id} required={required}
                className="peer text-sm rounded-md focus:outline-none py-2 px-4 w-full flex-auto disabled:bg-gray-100/75 disabled:text-gray-400 disabled:placeholder-gray-300 placeholder-gray-400 bg-transparent"
                onFocus={() => setFocus(true)}
                onBlur={(ev) => (setFocus(false), onFocusOut?.(ev))}
                value={value} onChange={e => updater(e.target.value)}
                ref={inputRef}
                autoComplete={autoComplete}
                placeholder={placeholder}
                min={min}
                max={max}
            />
            {prependIcon ? <PrependIcon icon={prependIcon} onClick={onPrependIconClick} /> : null}
            {appendIcon ? <AppendIcon submit={appendSubmit} icon={appendIcon} onClick={onAppendIconClick} /> : null}
        </div>
        {children}
    </div>;

    if (!innerLabel) {
        return <div className={'flex flex-col' + (className ? ` ${className}` : '')}>
            {label && <label className={labelClassName} htmlFor={id}>{label}</label>}
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
     * Placeholder for the input
     */
    placeholder?: string
    /**
     * Additional classes to set on the top level dom element.
     */
    className?: string
    /**
     * Background class name. This is applied wherever necessary so that it looks correct.
     */
    bgClassName?: string
    /**
     * Class name for the label
     */
    labelClassName?: string
    /**
     * Icon to prepend inside the text field.
     */
    prependIcon?: string
    /**
     * Icon to append inside the text field.
     */
    appendIcon?: string
    /**
     * Should the append icon be a submit button
     */
    appendSubmit?: boolean
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
    innerLabel?: boolean
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
    <div onClick={onClick} className="peer-focus:text-primary text-gray-300 pl-3 order-first">
        <i className={icon} />
    </div>
);

// tslint:disable-next-line: variable-name
export const AppendIcon: FC<{ icon: string, submit?: boolean, onClick?: () => void }> = ({ icon, submit, onClick }) => (
    submit ?
    <button type="submit" onClick={onClick} className="peer-focus:text-gray-500 text-gray-300 px-1 mr-2 outline-none focus-visible:outline-black">
        <i className={icon} />
    </button> :
    <div onClick={onClick} className="peer-focus:text-gray-500 text-gray-300 pr-3">
        <i className={icon} />
    </div>
);