import * as React from 'react';
import { FC } from 'react';
import { Modal, ModalProps } from './Modal';
import { Button } from './Button';
import { Spinner } from './Spinner';

// defaultRenderBtn has no onClick method
// tslint:disable-next-line: variable-name
export const DefaultRenderBtn: FC<BtnProps> = ({ text, type, onClick }) => (
    <Button large wide onClick={onClick}
        style={{ marginLeft: '15px', marginTop: '20px' }}
        success={type === 'success'}
        primary={type === 'primary'}
        error={type === 'error'}
    >{text}</Button>
);

// tslint:disable-next-line: variable-name
export const ActionModal: FC<Props> = ({
    classNameActions,
    actions,
    // tslint:disable-next-line: variable-name
    renderBtn: RenderBtn = DefaultRenderBtn,
    cancelBtnText = 'Cancel',
    onClose: onModalClose,
    className,
    children,
    extended,
    centered,
    style,
    ...rest
}) => {

    // State
    const [actionState, setActionState] = React.useState<ActionState>({ type: 'idle' });

    // Adjust props.
    className = className ? `action-modal ${className}` : 'action-modal';
    className = `${className} ${actionState.type}`;

    // Handlers
    function onActionClick(run: Action['run']) {
        return () => {

            const results: ActionResult[] = [];
            setActionState({ type: 'running' });
            run().then(result => {
                results.push({ result, type: 'done' });
                setActionState(results[0]);
            });
        };
    }

    function onClose() {
        setActionState({ type: 'idle' });
        onModalClose?.();
    }

    // Render
    return <Modal noClose={actionState.type === 'running'} onClose={onClose}
        className={className}
        centered={centered || actionState.type === 'done'}
        extended={(extended && actionState.type === 'idle') || actionState.type === 'done'}
        style={actionState.type !== 'running' ? style : undefined}
        {...rest}
    >
        {actionState.type === 'idle' ? <>
            {children}
            <div className={classNameActions}>
                <RenderBtn type="default" text={cancelBtnText} onClick={onClose} />
                {actions.map(({ run, type, text }, i) =>
                    <RenderBtn text={text} type={type} onClick={onActionClick(run)} key={i} />,
                )}
            </div>
        </> : actionState.type === 'done' ? <>
            {
                actionState.result.success ?
                <SuccessBody {...actionState.result} onClose={() => (onClose(), actionState.result.onClose?.())} /> :
                <ErrorBody {...actionState.result} onClose={() => (onClose(), actionState.result.onClose?.())} />
            }
        </> : actionState.type === 'running' ? <>
            <Spinner text="Please wait" />
        </> : null
        }
    </Modal>;
};

type ActionState =
    ActionIdle |
    ActionRunning |
    ActionResult;

interface ActionIdle {
    type: 'idle'
}

interface ActionRunning {
    type: 'running'
}

interface ActionResult {
    type: 'done'
    result: ErrorOrSuccessProps
}

type BtnType = 'primary' | 'success' | 'error' | 'default';

export interface ErrorOrSuccessProps {
    success: boolean
    description: React.ReactNode
    onClose?: () => void
    summary?: string
}

interface Action {
    /**
     * The action to execute.
     */
    run: () => Promise<ErrorOrSuccessProps>

    /**
     * Type of action button to render
     */
    type: BtnType

    /**
     * Text to forward to the renderBtn function.
     */
    text: string

}

interface BtnProps {
    text: string
    type: BtnType
    onClick?: () => void
}

interface Props extends ModalProps {
    /**
     * A class attached to the list of actions to customize the
     * way they are displayed.
     */
    classNameActions?: string

    /**
     * The list of action to performed. A cancel action is always added
     * and the default behaviour is to close the modal.
     * The cancel action appears first, but it can be put at the end
     * by reversing the layout order (e.g `flexbox-direction: reverse`).
     */
    actions: Action[]

    /**
     * Render an action button.
     */
    renderBtn?: (props: BtnProps) => React.ReactElement

    /**
     * Text to forward to the cancel button.
     */
     cancelBtnText?: string
}

// tslint:disable-next-line: variable-name max-line-length
export const ErrorBody: FC<Omit<ErrorOrSuccessProps, 'success'>> = ({ description, summary, onClose }) => (
    <>
        {/* <img src={`${ASSETS_IMAGES_FOLDER}/modal/icon-error.svg`} style={{ height: '64px', marginBottom: '10px' }} /> */}
        <h1>Error</h1>
        {summary ? <h2>{summary}</h2> : null}
        <hr />
        <h2 className="font-size-16 mb-15 text-black">{description}</h2>
        <Button wide primary className="action-btn" onClick={onClose} large>Close</Button>
    </>
);
// <a class="button package-upgrader-continue" style="width: auto; padding: 0 60px; margin-top: 20px;">OK</a>

// tslint:disable-next-line: variable-name max-line-length
export const SuccessBody: FC<Omit<ErrorOrSuccessProps, 'success'>> = ({ description, summary, onClose }) => (
    <>
        {/* <img src={`${ASSETS_IMAGES_FOLDER}/modal/icon-success.svg`} style={{ height: '64px', marginBottom: '10px' }} /> */}
        <h1>Success!</h1>
        {summary ? <h2>{summary}</h2> : null}
        <hr />
        <h2 className="font-size-16 mb-15 text-black">{description}</h2>
        <Button wide success className="action-btn" onClick={onClose} large>Close</Button>
    </>
);