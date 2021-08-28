import * as React from 'react';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { useAzureDeviceCertificate } from '@/hooks/fetchers';
import { useStore } from '@/hooks/useStore';
import { Button, InfoBox, Modal, Section, Spinner } from '../../core';
import { downloadUTF8Text } from '@/utils/download';


// tslint:disable-next-line: variable-name
export const Certificate: FC<Props> = observer(({ deviceId }) => {

    const store = useStore();
    const [ open, setOpen ] = React.useState(false);
    const cert = store.domain.enrollment.nodes.map.get(deviceId)?.azureCert;

    const { loading, error } = useAzureDeviceCertificate(deviceId);

    return <Section title="Certificate" className="mb-6">
        <Modal open={open} onClose={() => setOpen(false)} className="p-8 flex flex-col" header={
            <h1 className="text-lg font-bold">View Certificate</h1>
        }>
            {error && <InfoBox kind="error" className="mb-4">{error.message}</InfoBox>}
            {cert && <div className="dark:bg-gray-700 dark:text-gray-200 bg-gray-200 p-6 font-mono whitespace-pre rounded">
                {cert}
            </div>}
            {!cert && loading && <Spinner className="m-auto h-60" />}
            <Button className="mt-4" onClick={() => setOpen(false)}>
                Close
            </Button>
        </Modal>
        <div className="text-sm flex items-center">
            <div className="relative w-10 h-0">
                <i className="absolute left-0 -top-7 text-3xl text-gray-500 icon-138_Certificate" />
            </div>
            <div className="flex-grow text-gray-500">
                Register your VeeaHub with Azure before subscribing to the Azure application on your mesh.
            </div>
            <Button className="py-1 mx-3" onClick={() => setOpen(true)}>View</Button>
            <Button className="py-1" orange
                onClick={() => cert && downloadUTF8Text(cert, `azure-${deviceId}.pem`)}
            >
                Download
            </Button>
        </div>
    </Section>;
});

interface Props {
    deviceId: string
}
