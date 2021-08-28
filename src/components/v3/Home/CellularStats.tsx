import * as React from 'react';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Section } from '../core';


// tslint:disable-next-line: variable-name
export const CellularStats: FC<Props> = observer(({}) => {

    return <Section title="Cellular Stats" className="mx-4 md:mx-0 mb-6 text-sm"
        infoLink={{ kind: 'tooltip', text: 'TODO' }}
    >
        <Row name="Current Usage">
            <Link to="" className="text-primary hover:underline">5 meshes</Link> using Cellular
        </Row>
        <Row name="Most Usage">
            VMESH-1234 <span className="font-normal text-gray-400">(44.5%)</span>
        </Row>
        <Row name="Data Usage" last>
            128 KB today / 5.6 MB this month{' '}
            <Link to="" className="text-primary hover:underline">See more</Link>
        </Row>
    </Section>;
});

interface Props {}

// tslint:disable-next-line: variable-name
const Row: FC<{ name: React.ReactNode, last?: boolean }> = ({ name, last, children }) => (
    <div className={`flex justify-between ${last ? '' : 'pb-3 mb-3 border-b border-gray-300'}`}>
        <div className="text-gray-500">{name}</div>
        <div className="font-bold text-black">{children}</div>
    </div>
);