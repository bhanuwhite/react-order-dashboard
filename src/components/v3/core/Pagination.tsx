import { FC } from 'react';


// tslint:disable-next-line: variable-name
export const Pagination: FC<PaginationProps> = ({
    className, prevPage, nextPage, children, hasNext, hasPrev,
}) => (
    <div className={`flex text-sm justify-between w-full ${className ?? ''}`}>
        <button disabled={!hasPrev} onClick={prevPage}
            className={`focus-visible:outline-black no-underline outline-none font-bold ${!hasPrev ? 'text-gray-400' : 'text-primary group'}`}
        >
            <i className="fas fa-caret-left"/>{' '}<span className="group-hover:underline">Previous</span>
        </button>
        <span className={`${hasPrev || hasNext ? 'text-primary' : 'text-gray-400'}`}>{children}</span>
        <button disabled={!hasNext} onClick={nextPage}
            className={`focus-visible:outline-black no-underline outline-none font-bold ${!hasNext ? 'text-gray-400' : 'text-primary group'}`}
        >
            <span className="group-hover:underline">Next</span> <i className="fas fa-caret-right"/>
        </button>
    </div>
);

interface PaginationProps {
    className?: string
    hasPrev: boolean
    hasNext: boolean
    nextPage: () => void
    prevPage: () => void
}