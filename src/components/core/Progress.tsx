import { SFC } from 'react';


// tslint:disable-next-line: variable-name
export const Progress: SFC<Props> = ({ value }) => (
    <div className="progress-container" title={`${value}% done`}>
        <div className="progress" style={{ width: `${value}%`}}>&nbsp;</div>
    </div>
);
interface Props {
    /** Percentage value (between 0 and 100). */
    value: number
}