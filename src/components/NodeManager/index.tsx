import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FC } from 'react';
import { Enum, IGNORE, newValidator, NUMBER, Obj, Str, STRING } from 'typesafe-schema';
import { NodeState } from '@/store/domain/nodes';
import { sendRequestForNodeManager } from '@/actions';
import { useStore } from '@/hooks/useStore';


const nodeManagerContainer = document.getElementById('node-manager-iframe') ?? document.body;
const nodeManagerOrigin = 'null';

// tslint:disable-next-line: variable-name
export const NodeManager: FC<Props> = ({ open, node, onClose }) => {

    const store = useStore();
    const iframeRef = React.useRef<HTMLIFrameElement>(null);
    const [isIframeReady, setIsIframeReady] = React.useState(false);

    React.useEffect(() => {

        function handleMessage(ev: MessageEvent) {
            if (ev.origin !== nodeManagerOrigin || ev.source !== iframeRef.current?.contentWindow) {
                return;
            }

            if (ev.data === 'ready') {
                setIsIframeReady(true);
                return;
            }
            if (ev.data === 'close') {
                onClose();
                return;
            }
            if (typeof ev.data !== 'object' || typeof ev.data.type !== 'string') {
                return;
            }

            const result = requestAPI.validate(ev.data);
            if (result.type === 'error') {
                console.error(`Failed to parse node-manager request at ${result.path}: ${result.reason}`);
                return;
            }

            sendRequestForNodeManager(store, result.value).then(response =>
                iframeRef.current?.contentWindow?.postMessage(response, '*'),
            );
        }

        window.addEventListener('message', handleMessage, false);

        return () => {
            window.removeEventListener('message', handleMessage, false);
        };
    }, []);

    React.useEffect(() => {

        const contentWindow = iframeRef.current?.contentWindow;

        if (open && isIframeReady) {
            if (contentWindow && window.NODE_MANAGER_URL) {
                contentWindow.postMessage({
                    type: 'open',
                    // for NM i-frame opened from CCv2, use the apiKey to pass a prefix
                    // indicating that the API call is via the CCv2 backend rather than
                    // direct to the MAS API
                    apiKey: '/mas',
                    nodeId: node.props.masId,
                }, '*');
            } else {
                onClose();
            }
        }
    }, [open, isIframeReady, iframeRef]);

    return ReactDOM.createPortal(<iframe ref={iframeRef} width="100%" height="100%"
        style={{
            position: 'fixed',
            border: 'none',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            backgroundColor: 'rgba(20, 20, 20, 0.5)',
            display: open ? 'block' : 'none',
            zIndex: 1000,
        }}
        sandbox="allow-scripts"
        src={window.NODE_MANAGER_URL?.slice(7)}
    ></iframe>, nodeManagerContainer);
};

interface Props {
    node: NodeState
    open: boolean
    onClose(): void
}

const requestAPI = newValidator(Obj({
    type: Str('request'),
    requestId: NUMBER,
    data: IGNORE,
    contentType: STRING,
    method: Enum('POST', 'GET', 'PATCH', 'DELETE'),
    url: STRING,
}));