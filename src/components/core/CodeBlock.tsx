import * as React from 'react';
import { FC } from 'react';
import { highlightBlock } from '@/utils/highlight';


// tslint:disable-next-line: variable-name
export const CodeBlock: FC<Props> = ({ children, className }) => {

    const ref = React.useRef<HTMLDivElement | null>(null);

    className = className ?? '';

    React.useLayoutEffect(() => {
        if (ref.current) {
            highlightBlock(ref.current);
        }
    }, [ ref.current, children ]);

    function writeToClipboard() {
        if (children) {
            navigator.clipboard.writeText(typeof children === 'string' ? children : (children as string[]).join(''));
        }
    }

    return <div className={`relative font-mono whitespace-pre ${className}`}>
        <div title="Copy to clipboard" className="absolute top-10 right-10 cursor-pointer" onClick={writeToClipboard}>
            <i className="fas fa-copy opacity-60 hover:opacity-100"/>
        </div>
        <div ref={ref} className="p-0">
            {children}
        </div>
    </div>;
};

interface Props {
    className?: string
    children?: string | string[]
}
