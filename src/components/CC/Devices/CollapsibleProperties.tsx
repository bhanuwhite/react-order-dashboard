import { SFC } from 'react';
import { CollapsiblePanel } from '@/components/core';
import * as style from './CollapsibleProperties.module.scss';


// tslint:disable-next-line: variable-name
export const CollapsibleProperties: SFC<Props> = ({ properties }) => (
<CollapsiblePanel defaultValue={false} title="Additional Information">
    {/* <div style="overflow: auto;"> */}
    <div>
    {properties.map(({ name, value }) =>
        /* <div className="application-popup-details-item flat half" style="margin-bottom: 0;"> */
        <div className={style.property} key={name}>
            <p className={style.name}>{name}</p>
            <p className={style.value}>{value}</p>
        </div>,
    )}
    </div>
</CollapsiblePanel>
);

interface Props {
    properties: { name: string, value: string }[]
}