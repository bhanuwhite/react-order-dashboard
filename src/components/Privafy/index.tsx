import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { Spinner, PageIntro, Container, Nothing, Button } from '@/components/core';
import { useOwnerEnrollDataFetcher } from '@/hooks/fetchers';
import * as style from './index.module.scss';
import { debounce } from '@/utils/debounce';
import { useStore } from '@/hooks/useStore';
import { MeshDeviceErrorsHandler } from '../core/Errors';
import { Padding } from '../CC/Devices/Mesh/Padding';


const privafyOrigin = (new URL(window.PRIVAFY_BASE_URL ?? window.origin)).origin;
const privafyContentHeight = 'calc(100vh - 60px)';

// tslint:disable-next-line: variable-name
export const Privafy: React.FC<{}> = observer(({}) => {

    const store = useStore();
    const privafyInstalled = store.domain.enrollment.meshes.haveAnyPrivafyPackages;
    const [ isIframeReady, setIsIframeReady ] = React.useState(false);
    const { selectedGroupId } = useParams<{ selectedGroupId: string }>();
    const { loading, error } = useOwnerEnrollDataFetcher(selectedGroupId);

    React.useEffect(() => {

        function handleMessage(ev: MessageEvent) {
            if (ev.origin !== privafyOrigin) {
                return;
            }

            if (!isIframeReady && ev.data === 'privafy-central-activity') {
                setIsIframeReady(true);
            }
        }

        // Add listener to any activity on privafy iFrame and refresh our login session to reflect that
        // debouncing it because privafy can trigger few of those with each user action
        window.addEventListener('message', debounce(handleMessage, 500), false);

        return () => {
            window.removeEventListener('message', debounce(handleMessage, 500), false);
        };
    }, []);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <Padding><MeshDeviceErrorsHandler error={error} /></Padding>;
    }

    if (!privafyInstalled) {
        return <PrivafyNotFoundContent />;
    } else {
        return <>
            {!isIframeReady && <Loading />}
            <iframe
                style={{
                    width: '100%',
                    height: privafyContentHeight,
                    display: isIframeReady ? 'block' : 'none',
                }}
                src={`${window.PRIVAFY_BASE_URL}/home?source=veea`}
            ></iframe>
        </>;
    }
});

// tslint:disable-next-line: variable-name
const Loading: React.FC<{}> = () => (
    <div style={{ height: privafyContentHeight }}>
        <Spinner />
    </div>
);

// tslint:disable-next-line: variable-name
const PrivafyNotFoundContent: React.FC<{}> = () => {
    const { selectedGroupId } = useParams<{ selectedGroupId: string }>();
    return <>
        <PageIntro title="vTPN Control Center" icon="icon-privafy" className={style.pageIntro} />
        <Container solid className="p-20">
            <Nothing raw className={style.privafyNotFound}>
                {/* <img src={`${ASSETS_IMAGES_FOLDER}/vh/black-privafy-icon.svg`} style={{ width: 58, height: 58 }} /> */}
                <br/>
                <p><b>vTPN Control Center subscription needed.</b></p>
                <p>The Veea vTPN Control Center Solution is intended to serve as a best-in-class full-stack
                security and remote connectivity solution delivering comprehensive, enterprise-class security that
                helps protect against data-in-motion threats, DoS attacks, data theft, malware, and ransomware.
                More than a VPN, The Veea vTPN Control Center Solution offers multi-layer security for
                every endpoint and user, no matter where they are.</p>
                <div>
                    To sign up for vTPN Control Center, visit your Mesh list
                    by clicking on the link below, select a Mesh and then click on <b>Subscriptions</b> tab.
                </div>
                <div>
                    <Link to={`/cc/${selectedGroupId}/devices`}>
                        <Button call2action>
                            View my Meshes &rarr;
                        </Button>
                    </Link>
                </div>
            </Nothing>
        </Container>
    </>;
};