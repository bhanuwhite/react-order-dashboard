import { FC } from 'react';


// tslint:disable-next-line: variable-name
export const Padding: FC<Props> = ({ className, children }) => (
    <div className={`p-15 lg:p-35 pt-10 lg:pt-20 pb-20 lg:pb-25 ${className ?? ''}`}>
        {children}
    </div>
);

interface Props {
    className?: string
}
