import { SFC } from 'react';


// tslint:disable-next-line: variable-name
export const PageIntro: SFC<Props> = ({ icon, title, children, className }) => (
    <div className={'page-intro' + (className ? ` ${className}` : '')}>
        <div className="wrapper">
            <h1 className="with-icon">
                <i className={`${icon}`} />
                {title}
            </h1>
            <h2>{children}</h2>
        </div>
    </div>
);
interface Props {
    /**
     * Classname that represents the icon
     */
    icon: string

    /**
     * Title of the page
     */
    title: string

    /**
     * Additional classes to add to the element
     */
    className?: string
}