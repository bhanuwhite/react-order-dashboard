import * as React from 'react';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Section } from '../core';


// tslint:disable-next-line: variable-name
export const Alerts: FC<Props> = observer(({}) => {

    return <Section title="Cellular Stats" className="mx-4 md:mx-0 mb-6 text-sm"
        infoLink={{ kind: 'tooltip', text: 'TODO' }}
    >
    <Row name="All Good">
        <Link to="" className="text-primary hover:underline">75% of the devices</Link>
    </Row>
    <Row name="High CPU">
        <Link to="" className="text-primary hover:underline">25% of the devices</Link>
    </Row>
    <Row name="Failover" last>
        <span className="text-gray-500 hover:underline">25% of the devices</span>
    </Row>
</Section>;
});

interface Props {}

// tslint:disable-next-line: variable-name
const Row: FC<{ name: React.ReactNode, last?: boolean }> = ({ name, last, children }) => (
    <div className={`flex justify-between ${last ? '' : 'pb-3 mb-3 border-b border-gray-300'}`}>
        <div className="text-gray-500">{name}</div>
        <div className="font-bold">{children}</div>
    </div>
);