import * as React from 'react';
import { FC } from 'react';
import { Link } from 'react-router-dom';


interface ButtonProps extends CommonProps {
    onClick?: (event: React.MouseEvent<any>) => void
    forwardedRef?: React.RefObject<HTMLButtonElement>
    /** Set to true if the click event should only be fired when the target is the button element */
    clickLimited?: boolean
}

// tslint:disable-next-line: variable-name
export const Button: FC<ButtonProps> = ({
    onClick,
    children,
    style,
    type,
    forwardedRef,
    clickLimited,
    title,
    ...state
}) => {
    const ref = forwardedRef ?? React.useRef<HTMLButtonElement>(null);
    return <button ref={ref} type={type} disabled={state.disabled} style={style} className={computeClassName(state)}
        onClick={(e) => (!clickLimited || e.target === ref.current) && onClick?.(e)} title={title}>
        {children}
    </button>;
};


interface LinkProps extends CommonProps {
    to: string
}

// tslint:disable-next-line: variable-name
export const LinkButton: FC<LinkProps> = ({ to, children, style, title, ...state }) => (
    <Link style={style} className={computeClassName(state)} to={to} title={title}>
        {children}
    </Link>
);


interface ExternalLinkProps extends CommonProps {
    href: string
}

// tslint:disable-next-line: variable-name
export const ExternalLinkButton: FC<ExternalLinkProps> = ({ href, children, style, title, ...state }) => (
    <a style={style} className={computeClassName(state)} href={href} title={title}>
        {children}
    </a>
);


////////////////////////////////////////////////////////////////
// Utilities

interface ClassProps {
    large?: boolean
    small?: boolean
    wide?: boolean
    primary?: boolean
    info?: boolean
    success?: boolean
    error?: boolean
    className?: string
    call2action?: boolean
    disabled?: boolean
    inversed?: boolean
}

interface CommonProps extends ClassProps {
    style?: React.CSSProperties
    type?: 'button' | 'submit' | 'reset'
    title?: string
}

function computeClassName(state: ClassProps): string {
    const sizeModifier = state.call2action ? ' btn-call-to-action' : state.large ? ' btn-large' : state.small ? ' btn-small' : '';
    const stateModifier = state.success ? ' btn-success' : state.error ? ' btn-error' : '';
    const colorModifier = state.primary ? ' btn-primary' : state.info ? ' btn-info' : '';
    const defaultModifier = stateModifier === '' && colorModifier === '' && !state.call2action ? ' btn-default' : '';
    const disabledModifier = state.disabled ? ' btn-disabled' : '';
    const wideModifier = state.wide ? ' btn-wide' : '';
    const inversedModifier = state.inversed ? ' btn-inversed' : '';
    const classModifier = state.className ?? '';

    return `btn${disabledModifier}${sizeModifier}${colorModifier}${stateModifier}${defaultModifier}${wideModifier}${inversedModifier} ${classModifier}`;
}