import * as React from 'react';
import { FC } from 'react';


// tslint:disable-next-line: variable-name
export const Checkbox: FC<Props> = ({
    checked,
    disabled,
    indeterminate,
    required,
    withBackground,
    className,
    onClick,
    children,
}) => {

    const [hasFocus, setFocus] = React.useState(false);

    const focusModifier = hasFocus ? ' focus' : '';
    const backgroundModifier = withBackground ? ' with-background' : '';
    const checkedModifier = checked ? ' checked' : '';
    const indeterminateModifier = indeterminate ? ' indeterminate' : '';
    const disabledModifier = disabled ? ' disabled' : '';
    const classModifier = className ? ` ${className}` : '';

    return <div className={`checkbox${backgroundModifier}${checkedModifier}${indeterminateModifier}${disabledModifier}${classModifier}${focusModifier}`}
         onClick={() => !disabled && onClick?.(!checked)}
    >
        <input type="checkbox" style={{ position: 'absolute', opacity: 0 }}
            onChange={() => {} /* silences the React controlled component console errors */}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            required={required}
            checked={checked}
        />
        {children}
    </div>;
};
interface Props {
    checked?: boolean
    disabled?: boolean
    indeterminate?: boolean
    required?: boolean
    className?: string
    withBackground?: boolean
    onClick?: (newState: boolean) => void
}