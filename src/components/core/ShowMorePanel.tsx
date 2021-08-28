import { ControllableArgs, useControllableProp } from '@/hooks/useControllable';
import { FC } from 'react';
import AnimateHeight from 'react-animate-height';

// tslint:disable-next-line: variable-name
export const ShowMorePanel: FC<Props & ControllableProps> = ({
    children,
    startingHeight,
    className,
    qtyRemainingItems,
    textClassName,
    ...args
}) => {
    const [value, updater] = useControllableProp(args);

    className = className ?? '';

    const qtyRemainingItemsString = typeof qtyRemainingItems !== 'undefined'
        ? ` (${qtyRemainingItems})`
        : '';

    return <div className={className}>
        <AnimateHeight height={value ? 'auto' : startingHeight}>
            {children}
        </AnimateHeight>
        <div className={'inline-block hover:underline cursor-pointer text-info p-20' + (textClassName ? ` ${textClassName}` : '')}
            onClick={() => updater(!value)}>
            {value ? 'Show less' : `Show more${qtyRemainingItemsString}`}
        </div>
    </div>;
};

interface Props {
    /**
     * The initial height of the collapsable window
     */
    startingHeight: number
    /**
     * Additional classes to add to the ShowMorePanel element.
     */
    className?: string
    /**
     * Additional classes to add to the "Show more" text element.
     */
     textClassName?: string
    /**
     * Optional number to append to the Show more button. Ex: Show More (12)
     */
    qtyRemainingItems?: number
}
type ControllableProps = ControllableArgs<boolean>;