import { FC } from 'react';


// tslint:disable-next-line: variable-name
export const InfoBox: FC<InfoBoxProps> = ({ children, onClose, ...rest }) => (
    <div className={computeClassName(rest)}>
        <i className={computeIconClassName(rest)} />
        <div>
            {children}
        </div>
        {onClose &&
        <button className="ml-4 flex-none relative top-0.5 w-4 h-4 focus-visible:outline-black" onClick={onClose}>
            <div className={`right-0 top-1/2 w-4 h-0.5 ${computeCloseClassName(rest)} transform -rotate-45 absolute`} />
            <div className={`right-0 top-1/2 w-4 h-0.5 ${computeCloseClassName(rest)} transform rotate-45 absolute`} />
        </button>}
    </div>
);

export interface InfoBoxProps {
    onClose?: () => void
    className?: string
    kind?: 'error' | 'warn' | 'success' | 'info'
}

function computeClassName({ className, kind }: InfoBoxProps): string {

    className = className ?? '';
    kind = kind ?? 'info';

    className += ' px-6 py-4 text-sm rounded-md flex items-start';

    switch (kind) {
        case 'error':
            className += ' bg-red-200 text-red-800';
            break;
        case 'info':
            className += ' bg-gray-100 text-gray-500';
            break;
        case 'success':
            className += ' bg-good/20 text-green-700';
            break;
        case 'warn':
            className += ' bg-yellow-100 text-yellow-800';
            break;
    }

    return className;
}

function computeCloseClassName({ kind }: InfoBoxProps): string {
    switch (kind) {
        case 'error': return 'bg-red-800';
        case 'success': return 'bg-green-700';
        case 'warn': return 'bg-yellow-800';
        case 'info':
        default: return 'bg-gray-500';
    }
}

function computeIconClassName({ kind }: InfoBoxProps): string {
    const common = 'mr-4 text-lg';
    switch (kind) {
        case 'success': return `fas fa-check ${common}`;
        case 'warn':
        case 'error': return `fas fa-exclamation-triangle ${common}`;
        case 'info':
        default: return `fas fa-info-circle ${common}`;
    }
}