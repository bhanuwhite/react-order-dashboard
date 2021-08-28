import { FC } from 'react';
import { Section } from '../core';


// tslint:disable-next-line: variable-name
export const LoadingSection: FC<Props> = ({}) => (
    <Section className="animate-pulse mx-4 md:mx-0 mb-6" title={
        <div className="h-4 bg-gray-400 rounded-md w-32" />
    }>
        <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-400 w-4/6 rounded-md" />
            <div className="h-4 bg-gray-400 w-5/6 rounded-md" />
            <div className="h-4 bg-gray-400 w-3/6 rounded-md" />
        </div>
    </Section>
);

interface Props {}
