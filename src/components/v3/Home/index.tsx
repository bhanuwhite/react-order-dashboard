import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { useStore } from '@/hooks/useStore';
import { GettingStarted } from './GettingStarted';
import { NoDevicesFound } from './NoDevicesFound';
import { OverallHealth } from './OverallHealth';
import { LoadingSection } from './LoadingSection';
import { useHasDevicesInGroup } from '@/hooks/fetchers';
import { Invitations } from './Invitations';
import { CellularStats } from './CellularStats';
import { Alerts } from './Alerts';
import { MeshesNeedAttention } from './MeshesNeedAttention';


// tslint:disable-next-line: variable-name
export const Home: FC<Props> = observer(({}) => {

    const store = useStore();
    const { selectedGroupId } = useParams<{ selectedGroupId: string }>();
    // FIXME: unhandled error
    useHasDevicesInGroup(selectedGroupId);
    const hasDevices = store.view.selectedGroup.hasDevices;

    return <div className="overflow-x-hidden mb-4">
        <h1 className="text-2xl font-medium mx-4 md:mx-0 mb-4">Home</h1>
        {
            hasDevices === null ? <LoadingSection /> :
            hasDevices ? <>
                <OverallHealth />
                <Invitations />
                <CellularStats />
                <Alerts />
                <MeshesNeedAttention />
            </> :
            <>
                <NoDevicesFound email={store.view.activeuser.email} />
                <Invitations />
            </>
        }
        <GettingStarted />
    </div>;
});

interface Props {}
