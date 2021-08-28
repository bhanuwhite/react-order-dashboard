import * as React from 'react';
import { FC } from 'react';
import { useQuery } from '@/hooks/useQuery';
import { useStore } from '@/hooks/useStore';
import { useHistory, useParams } from 'react-router';
import { useNodesFetcher, useVmeshesFetcher, useOwnerEnrollDataFetcher } from '@/hooks/fetchers';
import { Dropdown, EmptyRow, HeaderCell, InfoBox, ItemCell, LinkCell, LoadingRow, Pagination, Row, Table, TextBox } from '../core';
import { observer } from 'mobx-react-lite';
import { mergeFetchers } from '@/fetcher/useFetcher';
import { HealthStatus } from '@/store/derived/health';
import { computeStatusColor, healthToShortnameForMesh } from '@/components/v3/utils/healthStatus';
import { Store } from '@/store';
import { EnrollmentMeshState } from '@/store/domain/enrollment';


// tslint:disable-next-line: variable-name
export const MeshList: FC<Props> = observer(({}) => {
    const store = useStore();
    const history = useHistory();
    const { selectedGroupId } = useParams<{ selectedGroupId: string }>();

    const { loading, error } = mergeFetchers(
        useNodesFetcher(selectedGroupId),
        useVmeshesFetcher(selectedGroupId),
        useOwnerEnrollDataFetcher(selectedGroupId),
    );
    const query = useQuery();
    const meshes = store.domain.enrollment.meshes.all;
    const meshesmap = store.domain.vmeshes.map;

    const status = getStatus(query.get('status'));
    const sortBy = getSortBy(query.get('sort'));
    const order = getOrderBy(query.get('order'));
    const pageIndex = query.getInt('page') ?? 0;

    const search = query.get('search') ?? '';
    const [ searchBuffer, setSearchBuffer ] = React.useState('');


    const filteredMeshes = meshes.filter(mesh =>
        (
            status === 'all' ||
            store.derived.health.getMeshHealthStatus(meshesmap.get(mesh.id), mesh) === status
        ) &&
        (
            mesh.name.toLowerCase().includes(search.toLowerCase())
        ),
    ).sort(getComparer(sortBy, order, store));

    function setSearch(newsearch: string) {
        if (newsearch !== search) {
            query.set('search', newsearch);
            history.push({ ...history.location, search: `?${query}` });
        }
    }

    function setSort(newRole: SortBy) {
        query.set('sort', newRole);
        history.replace({ ...history.location, search: `?${query}` });
    }

    function setOrder(newRole: OrderBy) {
        query.set('order', newRole);
        history.replace({ ...history.location, search: `?${query}` });
    }

    function setStatus(newstatus: DropdownStatus) {
        query.set('status', newstatus);
        history.replace({ ...history.location, search: `?${query}` });
    }

    function setPageIndex(newValue: number) {
        query.set('page', newValue.toString(10));
        history.push({ ...history.location, search: `?${query}` });
    }

    const itemsPerPage = 10;
    const pageCount = Math.floor((meshes.length - 1) / itemsPerPage) + (meshes.length === 0 ? 1 : 0);
    const visibleMeshes = filteredMeshes.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage);

    const hasNext = pageIndex < pageCount;
    const hasPrev = pageIndex > 0;
    const nextPage = () => setPageIndex(Math.min(pageIndex + 1, pageCount));
    const prevPage = () => setPageIndex(Math.max(pageIndex - 1, 0));

    const hasFilters = status !== 'all' || search !== '';

    return(
        <div className="mx-4 md:mx-0 mb-4">
            <h1 className="text-2xl font-medium mb-4">Meshes</h1>
            {error && <InfoBox className="mb-4" kind="error" >{error.message}</InfoBox>}
            <div className="rounded border dark:bg-gray-900 bg-white border-solid dark:border-gray-700 border-gray-300 py-4 px-4">
                <div className="flex mb-3">
                    <form onSubmit={e => e.preventDefault()} className="flex-grow flex">
                        <TextBox className="flex-grow" prependIcon="fa fa-search"
                            appendIcon="fas fa-arrow-right"
                            appendSubmit onAppendIconClick={() => setSearch(searchBuffer)}
                            placeholder="Search meshes by name"
                            value={searchBuffer} onChange={setSearchBuffer} />
                    </form>
                    <Dropdown className="hidden sm:flex w-40 ml-3" optionToNode={statusToHumanReadable}
                        value={status} onChange={setStatus} options={ALL_STATUS} />
                </div>
                <Table cols="grid-cols-3 sm:grid-cols-[2fr,1fr,1fr,1fr]">
                <Row>
                    <HeaderCell sortable order={order} setOrder={setOrder} setSort={setSort} current={sortBy} value="name">
                        Name
                    </HeaderCell>
                    <HeaderCell sortable order={order} setOrder={setOrder} setSort={setSort} current={sortBy} value="devices"
                        className="hidden sm:block text-center pr-3"
                    >
                        Veeahubs
                    </HeaderCell>
                    <HeaderCell sortable order={order} setOrder={setOrder} setSort={setSort} current={sortBy} value="subscriptions"
                        className="text-center pr-3"
                    >
                        Subscriptions
                    </HeaderCell>
                    <HeaderCell sortable order={order} setOrder={setOrder} setSort={setSort} current={sortBy} value="status">
                        Status
                    </HeaderCell>
                </Row>
                {loading && filteredMeshes.length === 0 && <LoadingRow />}
                {!loading && filteredMeshes.length === 0 && <EmptyResult hasFilters={hasFilters} />}
                    {visibleMeshes.map(mesh =>
                        <Row key={mesh.id}>
                            <LinkCell to={`/${selectedGroupId}/meshes/${mesh.id}`}>{mesh.name}</LinkCell>
                            <ItemCell className="hidden sm:block text-center pr-3">{mesh.devices.size}</ItemCell>
                            <ItemCell className="text-center pr-3">{mesh.men.packages.length}</ItemCell>
                            <ItemCell>
                                <Status
                                    status={store.derived.health.getMeshHealthStatus(meshesmap.get(mesh.id), mesh)}
                                 />
                            </ItemCell>
                        </Row>,
                    )}
                </Table>
                <Pagination className="mt-3"
                    hasNext={hasNext} hasPrev={hasPrev} nextPage={nextPage} prevPage={prevPage}
                >
                    Page {pageIndex + 1}/{pageCount + 1}
                </Pagination>
            </div>
        </div>
        );
});

interface Props {}

// tslint:disable-next-line: variable-name
const EmptyResult: FC<{ hasFilters: boolean }> = ({ hasFilters }) => (
    <EmptyRow>
        {
            hasFilters ?
            <>
                No Meshes matched your search criteria
            </> :
            'No Meshes found'
        }
    </EmptyRow>
);

////////////////////////////////////////////////////////////////

// tslint:disable-next-line: variable-name
const Status: FC<{ status: HealthStatus }> = ({ status }) => (
    <div className="flex items-center">
        <span className={`inline-block mr-2.5 h-4 w-1 ${computeStatusColor(status)}`} />
        <span className="text-gray-500">{statusToHumanReadable(status)}</span>
    </div>
);

////////////////////////////////////////////////////////////////

type SortBy = 'name' | 'devices' | 'subscriptions' | 'status';

function getSortBy(sortby: string | null): SortBy {
    switch (sortby) {
        case 'name':
        case 'devices':
        case 'subscriptions':
        case 'status':
            return sortby;
        default:
            return 'name';
    }
}

////////////////////////////////////////////////////////////////

type OrderBy = 'asc' | 'desc';

function getOrderBy(order: string | null): OrderBy {
    switch (order) {
        case 'asc':
        case 'desc':
            return order;
        default:
            return 'asc';
    }
}

////////////////////////////////////////////////////////////////

function getComparer(
    sortby: SortBy,
    order: OrderBy,
    store: Store,
): (a: EnrollmentMeshState, b: EnrollmentMeshState) => number {

    const meshesmap = store.domain.vmeshes.map;

    const c = order === 'asc' ? -1 : 1;
    switch (sortby) {
        case 'name': return (a, b) => {
            if (a.name.toLowerCase() < b.name.toLowerCase()) {
                return c;
            }
            if (a.name.toLowerCase() > b.name.toLowerCase()) {
                return -c;
            }
            return 0;
        };
        case 'devices': return (a, b) => {
            if (a.devices.size < b.devices.size) {
                return c;
            }
            if (a.devices.size > b.devices.size) {
                return -c;
            }
            return 0;
        };
        case 'subscriptions': return (a, b) => {
            if (a.men.packages.length < b.men.packages.length) {
                return c;
            }
            if (a.men.packages.length > b.men.packages.length) {
                return -c;
            }
            return 0;
        };
        case 'status': return (a, b) => {
            const am = store.derived.health.getMeshHealthStatus(meshesmap.get(a.id), a);
            const bm = store.derived.health.getMeshHealthStatus(meshesmap.get(b.id), b);
            if (am < bm) {
                return c;
            }
            if (am > bm) {
                return -c;
            }
            return 0;
        };
    }
}

////////////////////////////////////////////////////////////////

type DropdownStatus = HealthStatus | 'all';

function getStatus(status: string | null): DropdownStatus {
    switch (status) {
        case 'busy':
        case 'errors':
        case 'healthy':
        case 'offline':
        case 'need-reboot':
        case 'unknown':
        case 'installing':
            return status;
        default:
            return 'all';
    }
}

const ALL_STATUS: DropdownStatus[] = [
    'all',
    'busy',
    'errors',
    'healthy',
    'offline',
    'need-reboot',
    'unknown',
    'installing',
];

function statusToHumanReadable(status: DropdownStatus): string {
    switch (status) {
        case 'all': return 'All Statuses';
        default: return healthToShortnameForMesh(status);
    }
}
