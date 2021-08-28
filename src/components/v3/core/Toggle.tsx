import { FC } from 'react';


// tslint:disable-next-line: variable-name
export const Toggle: FC<Props> = ({ disabled, value, onChange, className }) => {

    className = className ? `${className}` : '';

    const sliderClass =
        'absolute duration-300 peer-focus:ring ring-opacity-[28%] inset-0 transition-all rounded-full ' +
        (disabled ? 'cursor-not-allowed opacity-50 ' : 'cursor-pointer ') +
        (value ? 'bg-primary ring-primary hover:bg-primary-light' : 'bg-neutral ring-neutral hover:bg-neutral-light');

    const toggle = `absolute left-0.5 bottom-0.5 w-6 h-6 rounded-full bg-white transition-transform ${value ? 'translate-x-5' : ''}`;

    return <div className={className}>
        <label className="block w-12 h-7 relative">
            <input type="checkbox" checked={value} className="peer absolute opacity-0"
                disabled={disabled}
                onChange={() => onChange(!value)}
            />
            <span className={sliderClass}>
                <span className={toggle}/>
            </span>
        </label>
    </div>;
};

interface Props {
    className?: string
    disabled?: boolean
    value: boolean
    onChange(newState: boolean): void
}