import { FC } from 'react';


// tslint:disable-next-line: variable-name
export const GrayContainer: FC<Props> = ({ children, className }) => (
    <div className={`rounded dark:bg-gray-700 bg-gray-100 ${className ?? ''}`}>
        {children}
    </div>
);

interface Props {
    className?: string
}
