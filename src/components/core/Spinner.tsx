import { FC } from 'react';


/**
 * Show a spinner, typically to express that data
 * is being fetched.
 */
// tslint:disable-next-line: variable-name
export const Spinner: FC<Props> = ({ text, className }) => (
    <div className={`loading-view ${className ?? ''}`}>
        <div className="spinner">
            <div className="bounce1" />
            <div className="bounce2" />
            <div className="bounce3" />
        </div>
        { text ? <div className="spinner-text">{text}</div> : null}
    </div>
);

interface Props {
    /**
     * Text to show near the spinner
     */
    text?: string
    /**
     * Extra class for the root element of spinner
     */
    className?: string
}
