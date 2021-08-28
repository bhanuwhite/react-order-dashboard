import { SFC } from 'react';


// tslint:disable-next-line: variable-name
export const Nothing: SFC<Props> = ({ children, raw, className }) => (
    <div className={'nothing-found' + (className ? ` ${className}` : '')}>
        {raw ? children : <b>{children}</b>}
    </div>
);
interface Props {
    /**
     * If set to true, then the children are not wrapped in a <b> element.
     */
    raw?: boolean

    /**
     * Additional classes to add to the Nothing element.
     */
    className?: string
}