import { SFC } from 'react';


// tslint:disable-next-line: variable-name
export const Separator: SFC<Props> = ({ children, className, bkgClassName, description, sticky }) => {
    className = className ?? '';
    bkgClassName = bkgClassName ?? '';
    return <>
        <div className={`separator before-grey-line${sticky ? ' sticky' : ''} ${className} ${bkgClassName}`}>
            <b className={bkgClassName}>{children}</b>
        </div>
        {description ? <div className="separator-description">{description}</div> : '' }
    </>;
};
interface Props {
    className?: string
    bkgClassName?: string
    description?: string
    sticky?: boolean
}