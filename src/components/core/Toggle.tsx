import { FC } from 'react';


// tslint:disable-next-line: variable-name
export const Toggle: FC<Props> = ({ disabled, value, onChange, children, className }) => {

    className = className ? `${className}` : '';
    className = disabled ? `${className} disabled` : className;
    className = `${className} toggle`;

    return <div className={className}>
        <label className="switch">
            <input type="checkbox" checked={value} style={{ position: 'absolute', opacity: 0 }}
                disabled={disabled}
                onChange={() => onChange(!value)}
            />
            <span className="slider round"></span>
        </label>
        <div className="toggle-title">
            {children}
        </div>
    </div>;
};

interface Props {
    className?: string
    disabled?: boolean
    value: boolean
    onChange(newState: boolean): void
}
