import * as React from "react";
import { createPortal } from "react-dom";
import { createDiv } from "../utils/dom";

const modalRoot = document.getElementById("modal-root") || document.body;
let modalOpened = 0;

export interface ModalProps extends RawProps {
  open: boolean;
  sidebar?: boolean;
  sidebarHtml?: any
}
interface RawProps {
  header?: React.ReactNode;
  className?: string;
  small?: boolean;
  noClose?: boolean;
  onClose?: () => void;
  sidebar?: boolean;
  sidebarHtml?: any;
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
export const ModalRaw: React.FC<RawProps & { willBeRemoved: boolean }> = ({
  header,
  children,
  small,
  className,
  noClose,
  onClose,
  willBeRemoved,
  sidebar,                
  sidebarHtml, 
}) => {
  const [el] = React.useState(createDiv);
  const [modalDepth, setModalDepth] = React.useState(-1);

  React.useEffect(() => {
    modalRoot.appendChild(el);
    setModalDepth(modalOpened++);

    return () => {
      modalRoot.removeChild(el);
      modalOpened--;
    };
  }, [el]);

  const zIndex = 10000 + modalDepth * 2;

  return createPortal(
    <div
      className={`fixed flex items-center justify-center inset-0 transition-colors ${
        willBeRemoved ? "bg-transparent" : "bg-black/50"
      }`}
      style={{ zIndex }}
    >
      <div className={computeModalClassName(small, willBeRemoved)}>
      {
        sidebar ?
        <div style={{ display: "flex", width: "100%", height: "100%" }}>
          <div style={{ width: "25%", background: "#ddd" }}>
            {sidebarHtml}
          </div>
          <div style={{ width: "75%" }}>
            <div className={`w-full cstm-modal flex px-4 pt-4 ${header ? "justify-between" : "justify-end"}`}>
              {header}
              {!noClose && (
                <button className="outline-none focus-visible:outline-black" onClick={onClose}>
                  <i className="fas fa-times" />
                </button>
              )}
            </div>
            <div className={className}>{children}</div>
          </div>
        </div>
        :
        <div>
     
            <div className={`w-full cstm-modal flex px-4 pt-4 ${header ? "justify-between" : "justify-end"}`}>
              {header}
              {!noClose && (
                <button className="outline-none focus-visible:outline-black" onClick={onClose}>
                  <i className="fas fa-times" />
                </button>
              )}
            </div>
            <div className={className}>{children}</div>
        </div>
}
   
   
      </div>
 
 
    </div>,
    el
  );
};

export interface ModalProps extends RawProps {
  open: boolean;
}
// tslint:disable-next-line: variable-name
export const Modal: React.FC<ModalProps> = ({ open, ...rest }) => {
  const [renderRaw, setRenderRaw] = React.useState(false);

  React.useEffect(() => {
    if (!open && renderRaw) {
      const timeoutId = setTimeout(() => {
        setRenderRaw(false);
      }, 400);

      return () => clearTimeout(timeoutId);
    } else {
      setRenderRaw(open);
    }
  }, [open]);

  return renderRaw ? <ModalRaw willBeRemoved={!open} {...rest} /> : null;
};

function computeModalClassName(
  small: boolean | undefined,
  willBeRemoved: boolean
): string {
  let className =
    "w-full rounded-md shadow-2xl flex flex-col dark:bg-gray-900 dark:text-white bg-white";

  if (willBeRemoved) {
    className += " animate-fadeOut";
  } else {
    className += " animate-fadeInDown";
  }

  if (small) {
    className += " md:w-[400px]";
  } else {
    className += " lg:w-[800px]";
  }

  return className;
}
