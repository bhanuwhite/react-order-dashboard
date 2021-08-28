import { SFC } from 'react';


// tslint:disable-next-line: variable-name
export const ErrorBox: SFC<Props> = ({ children, className }) => (
    <div className={`error-box ${className ? className : ''}`}>
        <b>Error: </b>
        <span dangerouslySetInnerHTML={{ __html: children }}></span>
    </div>
);
interface Props {
    children: string
    className?: string
}