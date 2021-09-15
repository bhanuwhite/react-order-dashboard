import * as React from 'react';
import { FC } from 'react';
import { Link } from 'react-router-dom';


// tslint:disable-next-line: variable-name
export const Section: FC<Props> = ({ className, title, noPadding, infoLink, children }) => (
    <div className={`rounded border dark:bg-gray-900 dark:text-white bg-white border-solid dark:border-gray-700 border-gray-300 ${className ?? ''}`}>
        <div className="flex justify-between px-4 py-3 section-heading text-sm border-b border-solid dark:border-gray-700 border-gray-300">
            <div className="dark:text-gray-400 text-gray-500 uppercase font-medium">{title}</div>
            {infoLink && <InfoIcon info={infoLink} />}
        </div>
        <div className={noPadding ? '' : 'p-4'}>
            {children}
        </div>
    </div>
);

interface Props {
    title: React.ReactNode
    className?: string
    infoLink?: InfoKind
    noPadding?: boolean
}

type InfoKind = InfoToolTip | InfoExternalLink | InfoInternalLink;

interface InfoToolTip {
    kind: 'tooltip'
    text: React.ReactNode
}

interface InfoExternalLink {
    kind: 'ext-link'
    title?: string
    link: string
}

interface InfoInternalLink {
    kind: 'int-link'
    title?: string
    link: string
}

// tslint:disable-next-line: variable-name
const InfoIcon: FC<{ info: InfoKind }> = ({ info }) => {

    const className = 'text-primary no-underline group outline-none focus-visible:outline-black';
    const icon = 'fas fa-question-circle group-hover:ring group-hover:ring-primary group-hover:ring-opacity-[28%] rounded-full transition-all';

    switch (info.kind) {
        case 'tooltip': return <div className={`${className} cursor-help relative`}>
            <i className={icon} />
            <div className="absolute z-10 hidden group-hover:block bottom-5 right-0 bg-gray-900 text-white p-2 rounded min-w-max">
                {info.text}
            </div>
            <div className="absolute z-10 hidden group-hover:block bottom-3 right-0.5 border-solid border-4 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900" />
        </div>;
        case 'ext-link': return <a href={info.link} title={info.title} className={className} rel="noopener" target="_blank">
            <i className={icon} />
        </a>;
        case 'int-link': return <Link to={info.link} title={info.title} className={className}>
            <i className={icon} />
        </Link>;
    }
};