import * as React from 'react';
import { FC } from 'react';
import { Container, HeadTitle, PageIntro, PaginationButtons, Select } from '@/components/core';
import { useGroupsByIdFetcher, useSearchGroupsByIdPage } from '@/hooks/fetchers';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { GroupsTable } from './GroupsTable';
import { useQuery } from '@/hooks/useQuery';
import { useHistory } from 'react-router';
import { getGroupColumnFromQuery } from './helpers';
import { SearchGroup } from './SearchGroup';


const DEFAULT_LIMIT: 5 | 10 | 20 = 10;

// tslint:disable-next-line: variable-name
export const GroupsHome: FC<Props> = observer(({}) => {

    const store = useStore();
    const query = useQuery();
    const limit = Math.min(query.getInt('limit') ?? DEFAULT_LIMIT, 20);
    const searchQueryUrlParam = query.get('search') ?? '';
    const column = getGroupColumnFromQuery(query);
    const history = useHistory();
    const groupIds = store.view.activeuser.groups;
    const {
        loading: groupsLoading,
        error: groupsError,
        fetchNow: groupsFetchNow,
    } = useGroupsByIdFetcher(store.view.activeuser.groups);

    const showSearch = searchQueryUrlParam.length > 0;
    const {
        page,
        next,
        prev,
        hasNext,
        hasPrev,
        loading: searchLoading,
        error: searchError,
        fetchNow: searchFetchNow,
    } = useSearchGroupsByIdPage(groupIds, searchQueryUrlParam, limit, column, { isInvalid: !showSearch });
    const loading = groupsLoading || searchLoading;
    const error = groupsError || searchError;
    const groups = showSearch ?
        store.domain.groups.getGroupsForPage(page) :
        groupIds.map(gid => store.domain.groups.map.get(gid)).filterNullable();
    const fetchNow = React.useCallback(() => {
        return Promise.all([
            groupsFetchNow(),
            searchFetchNow(),
        ]);
    }, [ searchFetchNow, searchFetchNow ]);

    function setLimit(newLimit: number) {
        query.set('limit', `${newLimit}`);
        history.replace({
            ...history.location,
            search: `?${query}`,
        });
    }

    function clearSearch() {
        history.push({
            pathname: `/cc/admin/groups`,
        });
    }

    return <>
        <HeadTitle>Veea Control Center - Groups</HeadTitle>
        <PageIntro title="Groups" icon="icon-166_Hierarchy">
            Manage Groups you belong to
        </PageIntro>
        <Container solid className="p-10 lg:p-30">
            <SearchGroup limit={limit} column={column} searchQueryUrlParam={searchQueryUrlParam}
                pathname={'/cc/admin/groups'}
            />
            <GroupsTable refreshGroupList={fetchNow} className="mt-15" loading={loading} error={error} groups={groups}>
                {
                    searchQueryUrlParam.length > 0 ?
                    <div className="flex flex-col items-center">
                        <div className="font-bold mb-10">No subgroups match your search criteria</div>
                        <div onClick={clearSearch} className="cursor-pointer hover:underline">Clear your search</div>
                    </div> :
                    null // A users can't have no groups, so this path should be unreachable
                }
            </GroupsTable>
            {
                (hasNext || hasPrev) &&
                <PaginationButtons className="mt-15"
                    prevPage={prev}
                    nextPage={next}
                    hasNext={hasNext}
                    hasPrev={hasPrev}
                >
                    Groups per page:
                    <Select value={limit} className="ml-10" onChange={setLimit}>
                        {[5, 10, 20].map(v => <option key={v} value={v}>{v}</option>)}
                    </Select>
                </PaginationButtons>
            }
        </Container>
    </>;
});

interface Props {}