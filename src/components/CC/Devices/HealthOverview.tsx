import { FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { HealthStatus } from '@/store/derived/health';
import * as style from './HealthOverview.module.scss';
import { Progress } from '@/components/core';
import { healthToTitle } from '@/utils/healthStatus';
import { MeshDeviceErrorsHandler } from '@/components/core/Errors';


// tslint:disable-next-line: variable-name
export const HealthOverview: FC<Props> = ({ health, mesh, unitSerial, progress, error }) => {

    const { selectedGroupId } = useParams<{ selectedGroupId: string }>();

    if (health === 'errors') {
        return error ?
            <MeshDeviceErrorsHandler error={{ status: 1003, message: error.message ? error.message.toString() : '' }} />
            : <div className={style.deviceStatusPane}>
                <b className={`${style.icon} ${health}`}>&nbsp;</b>
                <p className={`${style.status} ${health}`}>{healthToTitle(health)}</p>
                <div className={style.description}>
                    {mesh ? <div>There are some errors with one or more VeeaHubs on this mesh. Check out the
                    <b> VeeaHubs </b>
                    tab for more information.</div>
                    : <>
                        <div>
                            Your VeeaHub is reporting problems and might not be reachable.{' '}
                            You might need to restart your VeeaHub.{' '}
                        </div>
                        <div>
                            Please try restarting your VeeaHub or contact customer support if the problem persists.
                        </div>
                    </>}
                </div>
            </div>;
    }

    return <div className={style.deviceStatusPane}>
        <b className={`${style.icon} ${health}`}>&nbsp;</b>
        <p className={`${style.status} ${health}`}>{healthToTitle(health)}</p>
        <div className={style.description}>
            {health === 'offline' && <>
                {mesh ? <div>
                    <b>Check that your VeeaHubs are powered on and their internet connection is working.</b></div> :
                    <div><b>Check that your VeeaHub is powered on and its internet connection is working.</b></div>
                }
                <div>For more information, please check the documentation that came with your VeeaHub.</div>
            </>}
            {health === 'installing' && <>
                <div>
                    Your VeeaHub is currently installing system software.
                    This might take up to 20 minutes depending on your internet connection.
                </div>
                {progress ? <Progress value={progress}/> : null }
                <div>Please do not unplug your VeeaHub.</div>
            </>}
            {health === 'healthy' && <>
                <div>
                    This VeeaHub {mesh ? 'mesh' : ''} is working properly - no actions are required at this moment.
                </div>
            </>}
            {health === 'busy' && <>
                <div>Your VeeaHub {mesh ? 'mesh' : ''} is busy with one or more tasks. Check out the
                <b>{mesh ? ' VeeaHubs' : ' About'}</b> tab for more information.</div>
            </>}
            {health === 'need-reboot' && (mesh ?
                <div>
                    Some of your VeeaHubs needs to be rebooted. Visit the VeeaHubs tab for more information.
                </div> :
                <div>
                    Your VeeaHub{' '}
                    <Link to={`/cc/${selectedGroupId}/devices/device/${unitSerial}/overview/reboot`}>
                        needs to be rebooted
                    </Link>.
                </div>
            )}
        </div>
    </div>;
};

interface Props {
    health: HealthStatus
    mesh?: boolean
    unitSerial?: string
    progress?: number | null
    error?: { code: number | null, message: string | null, logs: string | null } | null
}