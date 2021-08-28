import { FC } from 'react';


// tslint:disable-next-line: variable-name
export const Checkbox: FC<Props> = ({ value, onChange, className, disabled, required, indeterminate }) => (
    <span className={computeClassName(className, disabled, value)}>
        <input checked={value} onChange={ev => onChange(ev.target.checked)}
            type="checkbox"
            required={required}
            disabled={disabled}
            className="absolute peer inset-0 opacity-0 z-10 w-full h-full cursor-pointer"
        />
        <div className="flex w-full peer-focus-visible:outline-black h-full items-center justify-center text-sm">
            {value && (
                indeterminate ?
                <i className={`fas fa-minus ${disabled ? 'text-gray-400' : 'text-primary'}`} /> :
                <i className={`fas fa-check ${disabled ? 'text-gray-400' : 'text-primary'}`} />
            )}
        </div>
    </span>
);

interface Props {
    /**
     * Whether or not this checkbox is checked
     */
    value: boolean
    /**
     * When the checkbox value is changed
     */
    onChange: (newValue: boolean) => void
    /**
     * True if the checkbox is disabled
     */
    disabled?: boolean
    /**
     * Set to true to represent partial selection
     * in a table
     */
    indeterminate?: boolean
    /**
     * Set to true if used in a form to express the value is required
     */
    required?: boolean
    /**
     * Additional CSS classes
     */
    className?: string
}

function computeClassName(className: string | undefined, disabled: boolean | undefined, value: boolean) {
    className = className ?? '';
    className += ' relative inline-block h-6 w-6 align-bottom rounded-md border border-solid';
    if (disabled) {
        className += ' bg-gray-100/75 border-gray-200';
    } else {
        className += ' bg-white hover:bg-primary-light/10 hover:border-primary';
        className += value ? ' border-primary' : ' border-gray-300';
    }
    return className;
}