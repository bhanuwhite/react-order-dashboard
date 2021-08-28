import * as React from 'react';
import { FC } from 'react';
import { ErrorBox } from './index';
import * as style from './Errors.module.scss';
import { Nothing } from '../Nothing';


// tslint:disable-next-line: variable-name
export const MeshDeviceErrorsHandler: FC<Props> = ({ error, customMessage }) => {
    switch (error.status) {
        case 401: return <Error401Box customMessage={customMessage} />;
        case 404: return <Error404Box customMessage={customMessage} />;
        case 500: return <Error500Box customMessage={customMessage} />;
        case 1003: return <Error1003Box />;
        case 504:
        case 0:
            return <CheckConnectionErrorBox />;
        default: return <ErrorBox>{error.message}</ErrorBox>;
    }
};

export interface Error {
    status: number
    message: string
}

interface Props {
    error: Error
    customMessage?: React.ReactNode
}

// tslint:disable-next-line: variable-name
const Error401Box: FC<{customMessage?: React.ReactNode}> = ({ customMessage }) => <Nothing raw>
    {customMessage ? customMessage :
    (<>
        <b>OFFLINE</b><br />
        <b>Check that your VeeaHub is powered on and its internet connection is working.</b><br />
        For more information, please check the documentation that came with your VeeaHub.
    </>)}
</Nothing>;

// tslint:disable-next-line: variable-name
const Error404Box: FC<{customMessage?: React.ReactNode}> = ({ customMessage }) => <Nothing raw>
    {customMessage ? customMessage :
    (<>
        <b>No mesh or VeeaHub information found.</b><br />
        <b>Check that your VeeaHub is powered on and its internet connection is working.</b><br />
        For more information, please check the documentation that came with your VeeaHub.
    </>)}
</Nothing>;

// tslint:disable-next-line: variable-name
const Error500Box: FC<{customMessage?: React.ReactNode}> = ({ customMessage }) => <Nothing raw>
    {customMessage ? customMessage :
    (<>
        <b>No mesh information found.</b><br />
        You can create new meshes and add VeeaHubs using the VeeaHub Manager app.
    </>)}
</Nothing>;

// tslint:disable-next-line: variable-name
const CheckConnectionErrorBox: FC<{}> = () => <div className={style.errorPane}>
    <b className={`${style.icon} errors`}>&nbsp;</b>
    <p className={`${style.status} errors`}>NETWORK ERROR</p>
    <div className={style.description}>
        <pre>
            Please check your internet connection and try again.
        </pre>
    </div>
</div>;

// tslint:disable-next-line: variable-name
const Error1003Box: FC<{}> = () => <div className={style.errorPane}>
    <b className={`${style.icon} errors`}>&nbsp;</b>
    <p className={`${style.status} errors`}>Error</p>
    <div className={style.description}>
        <pre>
            There was an error while reaching ACS server.
        </pre>
    </div>
</div>;
