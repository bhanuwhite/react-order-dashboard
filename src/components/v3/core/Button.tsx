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
    red?: boolean
    orange?: boolean
    disabled?: boolean
    className?: string
    secondary?: boolean
}

interface CommonProps extends ClassProps {
    style?: React.CSSProperties
    type?: 'button' | 'submit' | 'reset'
    title?: string
}

function computeClassName(state: ClassProps): string {
    const colorModifier =
        state.disabled ?
        'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed' :
        state.secondary ?
        'bg-white text-primary border-primary ring-primary hover:bg-primary-light/10' :
        state.red ?
        'bg-bad border-bad text-white ring-bad hover:bg-bad-light hover:border-bad-light hover:active:bg-bad-dark hover:active:border-bad-dark' :
        state.orange ?
        'bg-yellow-600 border-yellow-600 text-white ring-yellow-600 hover:bg-yellow-500 hover:border-yellow-500 hover:active:bg-yellow-700 hover:active:border-yellow-700' :
        // default
        'bg-primary border-primary text-white ring-primary hover:bg-primary-light hover:border-primary-light hover:active:bg-primary-dark hover:active:border-primary-dark';
    let classModifier = state.className ?? '';

    if (!classModifier.includes('px-')) {
        classModifier += ' px-5';
    }

    return `text-sm text-center transition-all rounded-md p-2 border border-solid focus:ring ring-opacity-[28%] focus:outline-none ${colorModifier} ${classModifier}`;
}