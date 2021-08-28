import * as React from 'react';
import { createPortal } from 'react-dom';
import { createDiv } from '@/utils/dom';


const modalRoot = document.getElementById('modal-root') || document.body;
let modalOpened = 0;

interface RawProps {
    wide?: boolean
    className?: string
    innerClassName?: string
    style?: React.CSSProperties
    extended?: boolean
    centered?: boolean
    compact?: boolean
    title?: string
    buttons?: React.ReactNode
    noClose?: boolean
    onClose?: () => void
}

/**
 * ## ModalRaw
 *
 * ModalRaw is different from Modal in that it is always
 * rendered. The reason for this, is to separate the open
 * logic from the rest of the modal logic.
 *
 * On top of ModalRaw, one can build a modal that has
 * open/close animation transitions and so on.
 */
// tslint:disable-next-line: variable-name
export const ModalRaw: React.FC<RawProps> = ({
    extended,
    wide,
    centered,
    compact,
    children,
    title,
    buttons,
    className,
    innerClassName,
    style,
    noClose,
    onClose,
}) => {

    const [ el ] = React.useState(createDiv);
    const [ modalDepth, setModalDepth ] = React.useState(-1);

    React.useEffect(() => {

        modalRoot.appendChild(el);
        setModalDepth(modalOpened++);

        return () => {
            modalRoot.removeChild(el);
            modalOpened--;
        };
    }, [ el ]);

    const zIndex = 1000000 + modalDepth * 2;
    const classes = [
        'modal',
        className ?? '',
        centered ? 'centered' : '',
        compact ? 'compact' : '',
        extended ? 'extended' : wide ? 'wide' : '',
    ];

    return createPortal(
        <div className="modal-background" style={{ zIndex }}>
            <div className={classes.filter(c => c).join(' ')}
                    style={{ ...style, zIndex: zIndex + 1 }}
            >
                {title ? <div className="modal-title">{title}</div> : null}
                {!noClose ? <div className="modal-close" onClick={onClose}>
                    <i className="fas fa-times" />
                </div> : null}
                <div className={'modal-content' + (innerClassName ? ` ${innerClassName}` : '')}>
                    {children}
                </div>
                {buttons ? <div className="modal-btns">{buttons}</div> : null}
            </div>
        </div>,
        el,
    );
};

export interface ModalProps extends RawProps {
    open: boolean
}
// tslint:disable-next-line: variable-name
export const Modal: React.FC<ModalProps> = ({ open, ...rest }) => (
    open ? <ModalRaw {...rest}></ModalRaw> : null
);