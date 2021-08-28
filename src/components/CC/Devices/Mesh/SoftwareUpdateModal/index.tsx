import * as React from 'react';
import { FC } from 'react';
import { ActionModal, Button } from '@/components/core';
import { updateSoftware, PackageUpdate } from '@/actions/packages';
import { flushAvailableUpdates } from '@/actions/available_updates';
import { useStore } from '@/hooks/useStore';
import { MeshDeviceErrorsHandler } from '@/components/core/Errors';


// tslint:disable-next-line: variable-name
export const SoftwareUpdateModal: FC<Props> = ({
    open,
    onClose,
    meshUUID,
    menUnitSerial,
    meshId,
    packages,
}) => {

    const store = useStore();
    const [softwareUpdated, setSoftwareUpdated] = React.useState(false);

    /**
     * Empty the state that contains available mesh software updates,
     * This is so all other screens reflect that the update has been initiated
     * and no further updates are required for now.
     */
    function resetAndClose() {
        if (softwareUpdated) {
            flushAvailableUpdates(store, meshUUID);
        }
        onClose();
    }

    return <ActionModal
        extended centered open={open}
        onClose={resetAndClose}
        actions={[
            {
                type: 'success' as const,
                text: 'Update Software',
                run: async () => {
                    setSoftwareUpdated(true);
                    const res = await updateSoftware(store, meshUUID, menUnitSerial, meshId, packages);
                    if (res.success) {
                        return {
                            success: true,
                            summary: 'Thank you for updating your software.',
                            description: <>
                                Your VeeaHubs will now restart to download the new software packages.<br />
                                This operation might take up to 20 minutes.
                            </>,
                        };
                    }
                    let errorDescription: string | React.ReactNode = res.message;
                    // Ajax error may arise: 'Internal server error (Error 0)'
                    if (res.message.match(/Error 0/gi)) {
                        errorDescription = <MeshDeviceErrorsHandler error={{status: 0, message: res.message}} />;
                    }
                    return {
                        success: false,
                        summary: 'There was an error while updating your software',
                        description: errorDescription,
                    };
                },
            },
        ]}
        renderBtn={({ onClick, text, type }) =>
            <Button wide large onClick={onClick}
                style={{ marginLeft: '15px', marginTop: '20px' }}
                success={type === 'success'}
                primary={type === 'primary' || type === 'default'}
                error={type === 'error'}
            >{text}</Button>
        }
    >
        <h1>Update Software</h1>
        <h2>Are you sure you want to update the system software to the latest version ?</h2>
        <hr />
        <h2 style={{ fontSize: '16px', color: 'black' }}>
        This process might take up to 20 minutes. Your VeeaHubs will restart during the update.
        </h2>
    </ActionModal>;
};

interface Props {
    open: boolean
    onClose(): void
    meshUUID: string,
    menUnitSerial: string,
    meshId: number | null, // TODO: we should update stripe subscription to use the meshUUID instead
    packages: PackageUpdate[],
}
