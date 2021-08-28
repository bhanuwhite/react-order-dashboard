import * as React from 'react';
import { FC } from 'react';
import { HeadTitle, Spinner, Nothing, Separator } from '@/components/core';
import { useOwnerEnrollDataFetcher, useNodesFetcher, useVmeshesFetcher } from '@/hooks/fetchers';
import { useStore } from '@/hooks/useStore';
import { MeshDeviceErrorsHandler } from '@/components/core/Errors';
import { mergeFetchers } from '@/fetcher';
import { DeviceItem } from './Items/DeviceItem';
import { DeviceListFilters } from './ListFilters/DeviceListFilters';
import { useQuery } from '@/hooks/useQuery';
import { HEALTH_FILTER } from './ListFilters/consts';
import { NodeState } from '@/store/domain/nodes';
import { EnrollmentDeviceState } from '@/store/domain/enrollment';
import { useParams } from 'react-router';


// tslint:disable-next-line: variable-name
export const DeviceList: FC<Props> = ({}) => {

    const store = useStore();
    const { selectedGroupId } = useParams<{ selectedGroupId: string }>();
    const { loading, error } = mergeFetchers(
        useNodesFetcher(selectedGroupId),
        useVmeshesFetcher(selectedGroupId),
        useOwnerEnrollDataFetcher(selectedGroupId),
    );
    const query = useQuery();
    const nodes = store.domain.nodes.all;
    const vmeshes = store.domain.vmeshes.all;
    const healthFilter = query.get(HEALTH_FILTER);
    const acsData = store.domain.enrollment.meshes.all;
    const listFilters = store.view.featurePreview.listFilters;

    const filteredNodes = healthFilter ?
        nodes.filter(node => healthFilter.includes(store.derived.health.getNodeHealthStatus(node))) :
        nodes;

    // organize nodes by parent vmesh IDs
    const nodesMappedToVmeshes: {[vmeshId: string]: NodeState[]} = {};
    filteredNodes.forEach(node => {
        const meshName = vmeshes.find(({ props: { meshId } }) => meshId === node.props.vmeshId)?.props.ssid
            ?? `VMESH-${node.props.vmeshId}`;
        if (nodesMappedToVmeshes[meshName]) {
            nodesMappedToVmeshes[meshName].push(node);
        } else {
            nodesMappedToVmeshes[meshName] = [node];
        }
    });

    // if devices are found in the ACS data but not in MAS data, display them as status "installing"
    const unavailableDevices = acsData.reduce((res, acsMesh) => {
        return res.concat([ ...acsMesh.devices.values() ].filter(({ id }) => !store.domain.nodes.map.has(id)));
    }, [] as EnrollmentDeviceState[]);

    return <div>
        <HeadTitle>Veea Control Center - VeeaHubs</HeadTitle>
        {loading && nodes.length === 0 ?
            <Spinner />
        : error ? <MeshDeviceErrorsHandler error={error}
            customMessage={<>
                <b>No VeeaHubs found.</b><br />
                You can create new meshes and add VeeaHubs using the VeeaHub Manager app.
            </>}
        /> : <>
            {listFilters && <DeviceListFilters />}
            {Object.keys(nodesMappedToVmeshes).map(meshName => <React.Fragment key={meshName}>
                <Separator className="mt-0" sticky>{meshName}</Separator>
                <div>
                    {nodesMappedToVmeshes[meshName].map(node => <DeviceItem node={node} key={node.id} />)}
                </div>
            </React.Fragment>)}
            {filteredNodes.length === 0 && <Nothing raw>
                <b>No VeeaHubs found.</b><br />
                {healthFilter ?
                    'Your current filters have matched no VeeaHubs.' :
                    'You can add VeeaHubs using the VeeaHub Manager app.'
                }
            </Nothing>}
            {unavailableDevices.length !== 0 && <>
                <Separator description="The VeeaHubs below are still installing and are not currently available.">
                    Unavailable VeeaHubs
                </Separator>
                {unavailableDevices.map(device => <DeviceItem acsData={device} key={device.id} />)}
            </>}
        </>}
    </div>;
};

interface Props {
}
