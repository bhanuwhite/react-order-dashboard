import * as React from 'react';
import { FC } from 'react';
import { createPortal } from 'react-dom';
import { createDiv } from '@/utils/dom';
import { InfoBox, InfoBoxProps } from './InfoBox';


// tslint:disable-next-line: variable-name
export const ToastRaw: FC<RawProps> = ({ willBeRemoved, position, ...rest }) => {

    const [ el ] = React.useState(createDiv);

    React.useEffect(() => {
        toastRoot.appendChild(el);
        return () => {
            toastRoot.removeChild(el);
        };
    }, [ el ]);

    const pos = position === 'top-middle' ? 'top-0 left-0 right-0' :
        position === 'top-left' ? 'top-0 left-0' :
        position === 'top-right' ? 'top-0 right-0' :
        position === 'bottom-left' ? 'bottom-0 left-0' :
        position === 'bottom-right' ? 'bottom-0 right-0' :
        'bottom-0 left-0 right-0';

    return createPortal(
        <div className={`fixed flex items-center justify-center ${pos} p-2`}>
            <InfoBox {...rest} className={`${willBeRemoved ? 'animate-fadeOut' : 'animate-zoomIn'} shadow ${rest.className}`} />
        </div>,
        el,
    );
};

interface RawProps extends InfoBoxProps {
    willBeRemoved: boolean
    onClose: () => void
    position?: ToastPosition
}

type ToastPosition = 'top-middle' | 'top-right' | 'top-left' | 'bottom-left' | 'bottom-middle' | 'bottom-right';

// tslint:disable-next-line: variable-name
export const Toast: React.FC<Props> = ({ open, ...rest }) => {

    const [ renderRaw, setRenderRaw ] = React.useState(false);

    React.useEffect(() => {

        if (!open && renderRaw) {
            const timeoutId = setTimeout(() => {
                setRenderRaw(false);
            }, 400);

            return () => clearTimeout(timeoutId);
        } else {
            setRenderRaw(open);
        }

    }, [ open ]);

    return renderRaw ? <ToastRaw willBeRemoved={!open} {...rest} /> : null;
};

interface Props extends InfoBoxProps {
    open: boolean
    onClose: () => void
    position?: ToastPosition
}

const toastRoot = document.getElementById('toast-root') || document.body;