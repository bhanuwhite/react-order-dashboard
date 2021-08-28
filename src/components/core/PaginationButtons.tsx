import { FC } from 'react';


// tslint:disable-next-line: variable-name
export const PaginationButtons: FC<PaginationButtoProps> = ({
    className, prevPage, nextPage, children, hasNext, hasPrev,
}) => (
    <div className={`pagination-wrapper ${className ?? ''}`}>
        <button disabled={!hasPrev} onClick={prevPage}>
            <i className="fas fa-caret-left"/>{' '}Previous
        </button>
        <span className="page-number">{children}</span>
        <button disabled={!hasNext} onClick={nextPage}>
            Next <i className="fas fa-caret-right"/>
        </button>
    </div>
);

interface PaginationButtoProps {
    className?: string
    hasPrev: boolean
    hasNext: boolean
    nextPage: () => void
    prevPage: () => void
}