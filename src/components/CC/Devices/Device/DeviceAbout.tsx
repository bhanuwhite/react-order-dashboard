import { FC, useEffect, useState, useRef } from 'react';
import { MeshDeviceErrorsHandler } from '@/components/core/Errors';
import { useNodeInfoFetcher, useIsWhitelistedFetcher } from '@/hooks/fetchers';
import { Button, Nothing, Spinner } from '@/components/core';
import { getDeviceCertificate } from '@/actions/device_certificate';
import { mergeFetchers } from '@/fetcher';
import { useStore } from '@/hooks/useStore';
import { useNode } from '@/hooks/useNode';
import { Padding } from '../Mesh/Padding';
import { acsError, acsStatus, prettyBoolean } from './helpers';
import * as style from './DeviceAbout.module.scss';
import { Store } from '@/store';


// tslint:disable-next-line: variable-name
export const DeviceAbout: FC<Props> = ({ unitSerial }) => {

    const { node, esNode } = useNode(unitSerial);
    const store = useStore();
    const { error } = mergeFetchers(
        useNodeInfoFetcher(node?.props.masId ?? '0'),
        useIsWhitelistedFetcher(unitSerial),
    );
    const whitelisted = store.domain.whitelisting.get(unitSerial);
    const health = store.derived.health.getNodeHealthStatus(node, esNode);
    const isMEN = node?.props.isManager;

    if (error && !node && !esNode) {
        return <Padding><MeshDeviceErrorsHandler error={error} /></Padding>;
    }

    return <div className="p-15 lg:p-30">
        <div className={style.applicationPopupListSection}>

            <div className={style.applicationPopupDetailsSeparator}>
                Status
            </div>
            <div className={`${style.applicationPopupDetailsItem} mb-15`}>
                <p className={style.name}>Health</p>
                <p className={style.value}>{health}</p>
            </div>
            <div className={style.applicationPopupDetailsItem}>
                <p className={style.name}>MAS: Healthy</p>
                <p className={style.value}>{prettyBoolean(node?.props.isHealthy)}</p>
            </div>
            <div className={style.applicationPopupDetailsItem}>
                <p className={style.name}>MAS: Operational</p>
                <p className={style.value}>{prettyBoolean(node?.props.isOperational)}</p>
            </div>
            <div className={`${style.applicationPopupDetailsItem} mb-15`}>
                <p className={style.name}>MAS: Connected</p>
                <p className={style.value}>{prettyBoolean(node?.props.isConnected)}</p>
            </div>
            <div className={style.applicationPopupDetailsItem}>
                <p className={style.name}>ACS Status</p>
                <p className={style.value}>{acsStatus(esNode)}</p>
            </div>
            <div className={`${style.applicationPopupDetailsItem} mb-15`}>
                <p className={style.name}>ACS Error</p>
                <p className={style.value}>{acsError(esNode)}</p>
            </div>
            <div className={style.applicationPopupDetailsItem}>
                <p className={style.name}>Role</p>
                <p className={style.value}>
                    {node?.props.isManager || esNode?.isMEN ? 'Gateway VeeaHub' : 'Mesh VeeaHub'}
                </p>
            </div>
            <div className={style.applicationPopupDetailsItem}>
                <p className={style.name}>Whitelisted</p>
                <p className={style.value}>{prettyBoolean(whitelisted)}</p>
            </div>
        </div>
        <div className={style.applicationPopupListSection}>
            <div className={style.applicationPopupDetailsSeparator}>
                Network
            </div>
            <div className={style.applicationPopupDetailsItem}>
                <p className={style.name}>Host Name</p>
                <p className={style.value}>{node?.props.hostname ?? 'Unknown'}</p>
            </div>
            {isMEN && <div className={style.applicationPopupDetailsItem}>
                <p className={style.name}>Address</p>
                <p className={style.value}>{node?.props.address ?? 'Unknown'}</p>
            </div>}
            <div className={style.applicationPopupDetailsItem}>
                <p className={style.name}>MAC Address</p>
                <p className={style.value}>{node?.nodeInfo?.node_mac.toUpperCase() ?? 'Unknown'}</p>
            </div>
        </div>
        <div className={style.applicationPopupListSection}>
            <div className={style.applicationPopupDetailsSeparator}>
                Software
            </div>
            <div className={style.applicationPopupDetailsItem}>
                <p className={style.name}>Software Version</p>
                <p className={style.value}>{node?.nodeInfo?.sw_version ?? 'Unknown'}</p>
            </div>
            <div className={style.applicationPopupDetailsItem}>
                <p className={style.name}>OS Version</p>
                <p className={style.value}>{node?.nodeInfo?.os_version ?? 'Unknown'}</p>
            </div>
        </div>
        <div className={style.applicationPopupListSection}>
            <div className={style.applicationPopupDetailsSeparator}>
                About VeeaHub
            </div>
            <div className={style.applicationPopupDetailsItem}>
                <p className={style.name}>Product Model</p>
                <p className={style.value}>{node?.nodeInfo?.product_model ?? 'Unknown'}</p>
            </div>
            <div className={style.applicationPopupDetailsItem}>
                <p className={style.name}>Version / Revision</p>
                <p className={style.value}>{node?.nodeInfo ?
                    `VeeaHub ${node?.nodeInfo?.unit_hardware_version} Rev ${node?.nodeInfo?.unit_hardware_revision}` :
                    'Unknown'
                }</p>
            </div>
            <div className={style.applicationPopupDetailsItem}>
                <p className={style.name}>Manufacturer</p>
                <p className={style.value}>Veea Inc.</p>
            </div>
            <div className={style.applicationPopupDetailsItem}>
                <p className={style.name}>MAS ID</p>
                <p className={style.value}>{node?.props.masId ?? 'Unknown'}</p>
            </div>
            <div className={style.applicationPopupDetailsItem}>
                <p className={style.name}>Serial Number</p>
                <p className={style.value}>{esNode?.id ?? 'Unknown'}</p>
            </div>
            <div className={style.applicationPopupDetailsItem}>
                <p className={style.name}>CPU Serial</p>
                <p className={style.value}>{node?.props.cpuSerial ?? 'Unknown'}</p>
            </div>
            <div className={style.applicationPopupDetailsItem}>
                <p className={style.name}>Docker Serial</p>
                <p className={style.value}>{node?.props.dockerId ?? 'Unknown'}</p>
            </div>
        </div>
        <div className={style.applicationPopupListSection}>
            <div className={style.applicationPopupDetailsSeparator}>
                VeeaHub Certificate
            </div>
            <DeviceCertificate unitSerial={unitSerial} store={store} />
        </div>
    </div>;
};

interface Props {
    unitSerial: string
}

// tslint:disable-next-line: variable-name
export const DeviceCertificate: FC<DeviceCertificateProps> = ({ unitSerial, store }) => {
    const [cert, setCert] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [errorOccured, setErrorOccured] = useState<boolean>(false);
    const [downloadObjectUrls, setDownloadObjectUrls] = useState<string[]>([]);
    const downloadObjectUrlsRef = useRef<string[]>([]);

    async function fetchCertificate() {
        try {
            const res = await getDeviceCertificate(store, unitSerial);
            setCert(res);
        } catch (err) {
            console.error(err);
            setErrorOccured(true);
        }
        setLoading(false);
    }

    function clearDocumentObjectUrlsOnUnmount() {
        for (const objectUrl of downloadObjectUrlsRef.current) {
            URL.revokeObjectURL(objectUrl);
        }
    }

    function storeDownloadObjectUrlsForUnmount() {
        downloadObjectUrlsRef.current = downloadObjectUrls;
    }

    function downloadCertificate() {
        const mimeType = 'application/x-pem-file';
        const blob = new Blob([cert], { type: mimeType });
        const tempAnchor = document.createElement('a');
        tempAnchor.download = 'azure.pem';
        const downloadObjectUrl = URL.createObjectURL(blob);
        tempAnchor.href = downloadObjectUrl;
        tempAnchor.dataset.downloadurl = [ mimeType, tempAnchor.download, tempAnchor.href ].join(':');
        tempAnchor.style.display = 'none';
        document.body.appendChild(tempAnchor);
        tempAnchor.click();
        document.body.removeChild(tempAnchor);
        setDownloadObjectUrls(urls => [ ...urls, downloadObjectUrl ]);
    }

    useEffect(() => {
        fetchCertificate();
        return clearDocumentObjectUrlsOnUnmount;
    }, []);

    useEffect(storeDownloadObjectUrlsForUnmount, [downloadObjectUrls]);

    return <>
        <p>
            Use this certificate to register your VeeaHub with Azure before{' '}
            subscribing to the Azure application on your mesh.
        </p>

        {errorOccured ? <NoCertFound/> : loading ? <Spinner /> : <>
            <div className={`bkg-grey-240 mt-25 mb-25 p-15 font-mono font-size-13 whitespace-pre w-max`}>
                {cert}
            </div>
            <Button large primary onClick={downloadCertificate}>
                <i className={`fas fa-file-download ${style.downloadIcon}`}></i>
                Download Certificate
            </Button>
        </>}
    </>;
};

// tslint:disable-next-line: variable-name
const NoCertFound: FC<{}> = () => {
    return <Nothing raw>
        <b>There was a problem obtaining your Azure certificate.</b><br />
        Please try again later or contact customer support.
    </Nothing>;
};

interface DeviceCertificateProps {
    unitSerial: string
    store: Store
}