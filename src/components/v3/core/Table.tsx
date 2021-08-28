import * as React from 'react';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Spinner } from './Spinner';


/**
 * `Table` helps builds custom table but will
 * rely on you to provide the CSS grid template
 * via TailwindCSS.
 *
 * ## Examples:
 *
 * ```tsx
 * // Three columns template
 * <Table cols="grid-cols-[1fr,2fr,700px]">
 *    ...
 * </Table>
 * ```
 *
 * ```tsx
 * // Six columns template with equal width
 * <Table cols="grid-cols-6">
 *    ...
 * </Table>
 * ```
 *
 */
// tslint:disable-next-line: variable-name
export const Table: FC<Props> = ({ children, className , cols }) => (
    <div className={`grid text-sm ${cols} ${className ?? ''}`}>
        {children}
    </div>
);

interface Props {
    /** TailwindCSS grid template */
    cols: string
    /** Additional CSS classes */
    className?: string
}

// tslint:disable-next-line: variable-name
export const Row: FC<{}> = ({ children }) => (
    <div className="contents group ">{children}</div>
);

// tslint:disable-next-line: variable-name
export const LoadingRow: FC<CellProps> = ({ className }) => (
    <div className={`col-span-full h-40 flex items-center justify-center ${className ?? ''}`}>
        <Spinner />
    </div>
);

// tslint:disable-next-line: variable-name
export const EmptyRow: FC<CellProps> = ({ className, children }) => (
    <div className={`col-span-full h-40 rounded-b dark:bg-gray-700 bg-gray-100 flex items-center justify-center ${className ?? ''}`}>
        <div className="dark:text-gray-300 text-gray-500 text-sm">
            {children}
        </div>
    </div>
);

// tslint:disable-next-line: variable-name
export function HeaderCell<T>({ className, children, ...rest }: React.PropsWithChildren<HeaderProps<T>>) {

    if (rest.sortable) {
        const isActive = rest.value === rest.current;

        const onClick = () => {
            if (isActive) {
                rest.setOrder(rest.order === 'asc' ? 'desc' : 'asc');
            } else {
                rest.setOrder('asc');
                rest.setSort(rest.value);
            }
        };

        return <button className={`${HEADER_CELL_CLASS} outline-none focus-visible:outline-black ${className ?? ''}`}
            onClick={onClick}
        >
            {children}
            <i className={
                `ml-2 ${isActive ? 'fa' : 'hidden'} ${rest.order === 'asc' ? 'fa-caret-up' : 'fa-caret-down'}`
            } />
        </button>;
    }
    return <div className={`${HEADER_CELL_CLASS} ${className ?? ''}`}>
        {children}
    </div>;
}

// tslint:disable-next-line: variable-name
export const ItemCell: FC<CellProps> = ({ className, children }) => (
    <div className={`${CELL_CLASS} ${className ?? ''}`}>{children}</div>
);

// tslint:disable-next-line: variable-name
export const LinkCell: FC<LinkProps> = ({ className, to, children }) => (
    <Link to={to} className={`${CELL_CLASS} hover:underline text-primary outline-none focus-visible:outline-black ${className ?? ''}`}>
        {children}
    </Link>
);

interface CellProps {
    className?: string
}

type HeaderProps<T> = SimpleHeaderProps | SortableProps<T>;

interface SimpleHeaderProps extends CellProps {
    sortable?: false
}

interface SortableProps<T> extends CellProps {
    sortable: true
    value: T
    current: T
    setSort: (newValue: T) => void
    order: 'asc' | 'desc'
    setOrder: (orderBy: 'asc' | 'desc') => void
}

interface LinkProps extends CellProps {
    to: string
}

// item-cell and header-cell are used by table.scss not Tailwind
const CELL_CLASS = 'py-3 group-hover:bg-primary-light/10 truncate item-cell';
const HEADER_CELL_CLASS = 'text-left py-3 font-bold border-b dark:first:text-gray-100 first:text-black text-gray-400 border-solid border-black dark:hover:bg-gray-800 hover:bg-gray-100 header-cell';