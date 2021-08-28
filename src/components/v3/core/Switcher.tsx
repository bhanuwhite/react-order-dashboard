import * as React from 'react';
import { FC } from 'react';


/**
 * `Switcher` is like Tabs but looks different =)
 *
 * ```tsx
 * <Switcher>
 *      <SwitchButton>Overview</SwitchButton>
 *      <SwitchButton>List</SwitchButton>
 * </Switcher>
 * ```
 */
// tslint:disable-next-line: variable-name
export const Switcher: FC<Props> = ({ children, value, onChange, btnClassName, className }) => {

    let childIndex = 0;
    const childrenTransformed = React.Children.map(children, child => {
        if (!React.isValidElement(child)) {
            return null;
        }

        const childValue = childIndex;

        childIndex += 1;
        return React.cloneElement(child, {
            _active: value === childValue,
            _onClick: () => onChange(childValue),
            _childClassName: btnClassName,
        });
    });

    return <div className={`w-max text-sm ${className ?? ''}`}>
        {childrenTransformed}
    </div>;
};

interface Props {
    /** A class applied to the container */
    className?: string
    /** A class applied to all child. In particular the designs wants the button to all have the same width. */
    btnClassName?: string
    /** Called when the selection changed */
    onChange: (newValue: number) => void
    /** The default value */
    value: number
}


// tslint:disable-next-line: variable-name
export const SwitchButton: FC<SwitchButtonProps> = (
    { children, disabled, className, _childClassName, _onClick, _active },
) => (
    <button type="button" onClick={_onClick} disabled={disabled}
        className={computeBtnClassName(disabled, className, _active, _childClassName)}
    >
        {children}
    </button>
);

interface SwitchButtonProps {
    /** Additional classes to set on the button */
    className?: string
    /** Set to true if the option is disabled */
    disabled?: boolean
    /** DO NOT USE */
    _active?: boolean
    /** DO NOT USE */
    _onClick?: () => void
    /** DO NOT USE */
    _childClassName?: string
}

function computeBtnClassName(
    disabled: boolean | undefined,
    className: string | undefined,
    active: boolean | undefined,
    childClassName: string | undefined,
): string {

    className = className ?? '';

    if (childClassName) {
        className += ` ${childClassName}`;
    }

    className += ' py-2 font-bold px-4 first:rounded-l-md last:rounded-r-md first:border-l border-t border-b border-r border-solid transition-all';
    className += ' outline-none focus:ring focus:ring-primary focus:ring-opacity-[28%]';

    if (disabled) {
        className += ' border-gray-300';

        if (active) {
            className += ' bg-gray-300 text-white';
        } else {
            className += ' text-gray-300';
        }
    } else {

        className += ' border-primary';

        if (active) {
            className += ' bg-primary text-white';
        } else {
            className += ' text-primary hover:bg-primary-light/10';
        }
    }

    return className;
}