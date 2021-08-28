import { FC } from 'react';


/**
 * Show a spinner, typically to express that data
 * is being fetched.
 */
// tslint:disable-next-line: variable-name
export const Spinner: FC<Props> = ({ className }) => (
    <div className={`spinner ${className}`}>
        <div className="bounce1" />
        <div className="bounce2" />
        <div className="bounce3" />
    </div>
);

interface Props {
    /**
     * Extra class for the root element of spinner
     */
    className?: string
}
