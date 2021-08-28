import * as React from 'react';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { useHistory, useParams } from 'react-router';
import { mergeFetchers } from '@/fetcher';
import { useStore } from '@/hooks/useStore';
import { useQuery } from '@/hooks/useQuery';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useNodesFetcher, useVmeshesFetcher, useOwnerEnrollDataFetcher } from '@/hooks/fetchers';
import { HealthStatus } from '@/store/derived/health';
import { EnrollmentDeviceState } from '@/store/domain/enrollment';
import { Store } from '@/store';
import { Table, Row, ItemCell, LinkCell, HeaderCell, LoadingRow, EmptyRow, InfoBox } from '../core';
import { Dropdown, Pagination, TextBox } from '../core';
import { computeStatusColor, healthToShortnameForNode } from '@/components/v3/utils/healthStatus';


// tslint:disable-next-line: variable-name
export const DeviceList: FC<Props> = observer(({}) => {

    // Make sure when this component is mounted that we scroll to the top.
    useScrollToTop();

    const store = useStore();
    const history = useHistory();
    const { selectedGroupId } = useParams<{ selectedGroupId: string }>();

    const { loading, error } = mergeFetchers(
        useNodesFetcher(selectedGroupId),
        useVmeshesFetcher(selectedGroupId),
        useOwnerEnrollDataFetcher(selectedGroupId),
    );
    const query = useQuery();
    const nodes = store.domain.enrollment.nodes.all;
    const masNodes = store.domain.nodes.map;
    const meshes = store.domain.enrollment.meshes.map;

    const search = query.get('search') ?? '';
    const [ searchBuffer, setSearchBuffer ] = React.useState('');

    function setSearch(newsearch: string) {
        if (newsearch !== search) {
            query.set('search', newsearch);
            history.push({ ...history.location, search: `?${query}` });
        }
    }

    const status = getStatus(query.get('status'));
    const role = getRole(query.get('role'));
    const sortBy = getSortBy(query.get('sort'));
    const order = getOrderBy(query.get('order'));
    const pageIndex = query.getInt('page') ?? 0;

    function setStatus(newstatus: DropdownStatus) {
        query.set('status', newstatus);
        history.replace({ ...history.location, search: `?${query}` });
    }

    function setRole(newRole: DropdownRole) {
        query.set('role', newRole);
        history.replace({ ...history.location, search: `?${query}` });
    }

    function setSort(newRole: SortBy) {
        query.set('sort', newRole);
        history.replace({ ...history.location, search: `?${query}` });
    }

    function setOrder(newRole: OrderBy) {
        query.set('order', newRole);
        history.replace({ ...history.location, search: `?${query}` });
    }

    function setPageIndex(newValue: number) {
        query.set('page', newValue.toString(10));
        history.push({ ...history.location, search: `?${query}` });
    }

    const filteredNodes = nodes.filter(node =>
            (
                status === 'all' ||
                store.derived.health.getNodeHealthStatus(masNodes.get(node.id), node) === status
            ) &&
            (
                role === 'all' ||
                (role === 'men' && node.isMEN) ||
                (role === 'mn' && !node.isMEN)
            ) &&
            (
                node.name.toLowerCase().includes(search.toLowerCase()) ||
                node.id.toLowerCase().includes(search.toLowerCase())
            ),
        ).sort(getComparer(sortBy, order, store));

    const itemsPerPage = 10;
    const pageCount = Math.floor((filteredNodes.length - 1) / itemsPerPage) + (filteredNodes.length === 0 ? 1 : 0);
    const visibleNodes = filteredNodes.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage);

    const hasNext = pageIndex < pageCount;
    const hasPrev = pageIndex > 0;
    const nextPage = () => setPageIndex(Math.min(pageIndex + 1, pageCount));
    const prevPage = () => setPageIndex(Math.max(pageIndex - 1, 0));

    const hasFilters = status !== 'all' || role !== 'all' || search !== '';

    return <div className="mx-4 md:mx-0 mb-4">
        <h1 className="text-2xl font-medium mb-4">VeeaHubs</h1>
        {error && <InfoBox className="mb-4" kind="error" >{error.message}</InfoBox>}
        <div className="rounded border dark:bg-gray-900 bg-white border-solid dark:border-gray-700 border-gray-300 py-4 px-4">
            <div className="flex mb-3">
                <form onSubmit={e => e.preventDefault()} className="flex-grow flex">
                    <TextBox className="flex-grow" prependIcon="fa fa-search"
                        appendIcon="fas fa-arrow-right" appendSubmit onAppendIconClick={() => setSearch(searchBuffer)}
                        placeholder="Search devices by name or serial number"
                        value={searchBuffer} onChange={setSearchBuffer} />
                </form>
                <Dropdown className="hidden sm:flex w-40 ml-3" optionToNode={statusToHumanReadable}
                    value={status} onChange={setStatus} options={ALL_STATUS} />
                <Dropdown className="hidden lg:flex w-44 ml-3" optionToNode={roleToHumanReadable}
                    value={role} onChange={setRole} options={ALL_ROLES} />
            </div>
            <Table cols="grid-cols-3 sm:grid-cols-5">
                <Row>
                    <HeaderCell sortable order={order} setOrder={setOrder} setSort={setSort} current={sortBy} value="name">
                        Name
                    </HeaderCell>
                    <HeaderCell sortable order={order} setOrder={setOrder} setSort={setSort} current={sortBy} value="role"
                        className="hidden sm:block"
                    >
                        Role
                    </HeaderCell>
                    <HeaderCell sortable order={order} setOrder={setOrder} setSort={setSort} current={sortBy} value="mesh">
                        Mesh
                    </HeaderCell>
                    <HeaderCell sortable order={order} setOrder={setOrder} setSort={setSort} current={sortBy} value="model"
                        className="hidden sm:block"
                    >
                        Model
                    </HeaderCell>
                    <HeaderCell sortable order={order} setOrder={setOrder} setSort={setSort} current={sortBy} value="status">
                        Status
                    </HeaderCell>
                </Row>
                {loading && filteredNodes.length === 0 && <LoadingRow />}
                {!loading && filteredNodes.length === 0 && <EmptyResult hasFilters={hasFilters} />}
                {visibleNodes.map(node =>
                    <Row key={node.id}>
                        <LinkCell to={`/${selectedGroupId}/devices/${node.id}`}>{node.name}</LinkCell>
                        <ItemCell className="hidden sm:block">{node.isMEN ? 'Gateway' : 'Mesh'} VeeaHub</ItemCell>
                        <ItemCell>{meshes.get(node.meshId)?.name ?? 'Unknown'}</ItemCell>
                        <ItemCell className="hidden sm:block">VH{node.id.slice(0, 3)}</ItemCell>
                        <ItemCell>
                            <Status status={store.derived.health.getNodeHealthStatus(masNodes.get(node.id), node)} />
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
    </div>;
});

interface Props {}

// tslint:disable-next-line: variable-name
const EmptyResult: FC<{ hasFilters: boolean }> = ({ hasFilters }) => (
    <EmptyRow>
        {
            hasFilters ?
            <>
                No VeeaHubs matched your search criteria
            </> :
            'No VeeaHubs found'
        }
    </EmptyRow>
);

// tslint:disable-next-line: variable-name
const Status: FC<{ status: HealthStatus }> = ({ status }) => (
    <div className="flex items-center">
        <span className={`inline-block mr-2.5 h-4 w-1 ${computeStatusColor(status)}`} />
        <span className="text-gray-500">{statusToHumanReadable(status)}</span>
    </div>
);

////////////////////////////////////////////////////////////////

type SortBy = 'name' | 'role' | 'mesh' | 'model' | 'status';

function getSortBy(sortby: string | null): SortBy {
    switch (sortby) {
        case 'name':
        case 'role':
        case 'mesh':
        case 'model':
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
): (a: EnrollmentDeviceState, b: EnrollmentDeviceState) => number {

    const masNodes = store.domain.nodes.map;
    const meshes = store.domain.enrollment.meshes.map;

    const c = order === 'asc' ? -1 : 1;
    switch (sortby) {
        case 'name': return (a, b) => {
            const aname = a.name.toLowerCase();
            const bname = b.name.toLowerCase();
            if (aname < bname) {
                return c;
            }
            if (aname > bname) {
                return -c;
            }
            return 0;
        };
        case 'role': return (a, b) => {
            const am = a.isMEN ? 1 : 0;
            const bm = b.isMEN ? 1 : 0;
            if (am < bm) {
                return c;
            }
            if (am > bm) {
                return -c;
            }
            return 0;
        };
        case 'mesh': return (a, b) => {
            const am = meshes.get(a.meshId)?.name ?? 'Unknown';
            const bm = meshes.get(b.meshId)?.name ?? 'Unknown';
            if (am < bm) {
                return c;
            }
            if (am > bm) {
                return -c;
            }
            return 0;
        };
        case 'model': return (a, b) => {
            const am = a.id.slice(0, 3);
            const bm = b.id.slice(0, 3);
            if (am < bm) {
                return c;
            }
            if (am > bm) {
                return -c;
            }
            return 0;
        };
        case 'status': return (a, b) => {
            const am = store.derived.health.getNodeHealthStatus(masNodes.get(a.id), a);
            const bm = store.derived.health.getNodeHealthStatus(masNodes.get(b.id), b);
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

type DropdownRole =  'all' | 'men' | 'mn';

function getRole(role: string | null): DropdownRole {
    switch (role) {
        case 'men':
        case 'mn':
            return role;
        default:
            return 'all';
    }
}

const ALL_ROLES: DropdownRole[] = [
    'all',
    'men',
    'mn',
];

function roleToHumanReadable(role: DropdownRole): string {
    switch (role) {
        case 'all': return 'All roles';
        case 'men': return 'Gateway VeeaHub';
        case 'mn': return 'Mesh VeeaHub';
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
        default: return healthToShortnameForNode(status);
    }
}
