import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router';
import { useStore } from '@/hooks/useStore';
import { Nothing, HeadTitle, Spinner } from '@/components/core';
import { Separator } from '@/components/core';
import { useOwnerEnrollDataFetcher, useNodesFetcher, useVmeshesFetcher } from '@/hooks/fetchers';
import { MeshDeviceErrorsHandler } from '@/components/core/Errors';
import { mergeFetchers } from '@/fetcher';
import { MeshItem } from './Items/MeshItem';
import { MeshListFilters } from './ListFilters/MeshListFilters';
import { useQuery } from '@/hooks/useQuery';
import { HEALTH_FILTER } from './ListFilters/consts';


// tslint:disable-next-line: variable-name
export const MeshList: FC<Props> = observer(() => {

    const store = useStore();
    const { selectedGroupId } = useParams<{ selectedGroupId: string }>();
    const { loading, error } = mergeFetchers(
        useNodesFetcher(selectedGroupId),
        useVmeshesFetcher(selectedGroupId),
        useOwnerEnrollDataFetcher(selectedGroupId),
    );
    const query = useQuery();
    const listFilters = store.view.featurePreview.listFilters;
    const vmeshes = store.domain.vmeshes.map;
    const acsData = store.domain.enrollment.meshes.all;
    const withMASDataMeshes = acsData.filter(m => vmeshes.has(m.id));
    const unavailableMeshes = acsData.filter(m => !vmeshes.has(m.id));
    const healthFilter = query.get(HEALTH_FILTER);
    const filteredMeshes = healthFilter ?
        withMASDataMeshes.filter(mesh =>
            healthFilter.includes(store.derived.health.getMeshHealthStatus(vmeshes.get(mesh.id), mesh)),
        ) :
        withMASDataMeshes;

    return <>
        <HeadTitle>Veea Control Center - Meshes</HeadTitle>
        {loading && (vmeshes.size === 0 || acsData.length === 0) ?
            <Spinner />
        : error ? <MeshDeviceErrorsHandler error={error}
            customMessage={<>
                <b>No meshes found.</b><br />
                You can create new meshes and add VeeaHubs using the VeeaHub Manager app.
            </>}
        /> : <>
            {listFilters && <MeshListFilters />}
            <div>
                {filteredMeshes.map(mesh => <MeshItem mesh={vmeshes.get(mesh.id)} acsData={mesh} key={mesh.id} />)}
                {filteredMeshes.length === 0 && <Nothing raw>
                    <b>No meshes found.</b><br />
                    {healthFilter ?
                        'Your current filters have matched no meshes.' :
                        'You can create new meshes and add VeeaHubs using the VeeaHub Manager app.'
                    }
                </Nothing>}
            </div>
            {unavailableMeshes.length !== 0 && <>
                <Separator description="The meshes below are still installing and are not currently available.">
                    Unavailable Meshes
                </Separator>
                {unavailableMeshes.map(mesh => <MeshItem acsData={mesh} key={mesh.id} />)}
            </>}
        </>}
    </>;
});

interface Props {
}