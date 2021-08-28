import * as React from 'react';
import { FC } from 'react';
import { newIdGenerator } from '@/utils/uniqueId';


// tslint:disable-next-line: variable-name
export const Logo: FC<React.SVGProps<SVGSVGElement>> = (props) => {

    const [ id ] = React.useState(newId);

    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="187 9 70 62" {...props}>
        <linearGradient
            id={id}
            gradientUnits="userSpaceOnUse"
            x1={222.173}
            y1={226.619}
            x2={222.173}
            y2={165.181}
            gradientTransform="translate(0 -156)"
        >
            <stop offset={0.078} stopColor="#e71e25" />
            <stop offset={0.29} stopColor="#b6161c" />
            <stop offset={0.509} stopColor="#8d0a0d" />
            <stop offset={0.674} stopColor="#750000" />
            <stop offset={0.765} stopColor="#6d0000" />
        </linearGradient>
        <path
            d="M207.3 43.6c0 1.5.1 3 .2 4.4l-19.3-34c-.7-1.3-.8-2.5-.3-3.4s1.6-1.4 3.1-1.4h40.2c-4.9 1.7-9.3 4.6-13.2 8.5-7.1 7.2-10.7 15.8-10.7 25.9zm48.3-33.8c-.7-.4-1.3-.6-2.3-.6H246c-9.1.5-16.9 4.1-23.4 10.6-7.1 7.1-10.7 15.8-10.7 25.8 0 5.8 1.2 11.2 3.5 16 .1.2 4 7 4 7 .6 1.1 1.3 1.7 2.2 1.9h.7c1 0 1.9-.7 2.6-2L256.1 14c.7-1.1.8-2.1.5-3 0 0-.3-.8-1-1.2z"
            fill={`url(#${id})`}
        />
    </svg>;
};

// Created separate function to avoid creating new closures
// on every render.
const newId = newIdGenerator('logo');