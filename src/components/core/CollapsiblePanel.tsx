import * as React from 'react';
import { FC } from 'react';
import AnimateHeight from 'react-animate-height';
import { ControllableArgs, useControllableProp } from '@/hooks/useControllable';


// tslint:disable-next-line: variable-name
export const CollapsiblePanel: FC<Props & ControllableProps> = (
    { className, children, title, ...args },
) => {

    const [value, updater] = useControllableProp(args);

    className = className ?? '';

    return <div className={`${className} collapsible-panel${value ? ' expanded' : ''}`}>
        <div className="collapsible-panel--header">
            <div className="collapsible-panel--header--handle"
                onClick={() => updater(!value)}>
                {title}
            </div>
        </div>
        <AnimateHeight height={value ? 'auto' : 0}>
            {children}
        </AnimateHeight>
    </div>;
};
interface Props {
    className?: string
    title?: React.ReactNode
}
type ControllableProps = ControllableArgs<boolean>;