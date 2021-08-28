import { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { useQuery } from '@/hooks/useQuery';
import { useChildrenOrSearchGroupsByPage } from '@/hooks/fetchers';
import { PaginationButtons, Select } from '@/components/core';
import { GroupsTable } from '../GroupsTable';
import { SearchGroup } from '../SearchGroup';
import { getGroupColumnFromQuery } from '../helpers';


const DEFAULT_LIMIT: 5 | 10 | 20 = 5;

// tslint:disable-next-line: variable-name
export const SubGroups: FC<Props> = observer(({ groupId }) => {

    const store = useStore();
    const query = useQuery();
    const limit = Math.min(query.getInt('limit') ?? DEFAULT_LIMIT, 20);
    const searchQueryUrlParam = query.get('search') ?? '';
    const column = getGroupColumnFromQuery(query);
    const history = useHistory();
    const {
        groups,
        next,
        prev,
        hasNext,
        hasPrev,
        loading,
        error,
        fetchNow,
    } = useChildrenOrSearchGroupsByPage(store, groupId, searchQueryUrlParam, limit, column);

    function setLimit(newLimit: number) {
        query.set('limit', `${newLimit}`);
        history.replace({
            ...history.location,
            search: `?${query}`,
        });
    }

    function clearSearch() {
        history.push({
            pathname: `/cc/admin/groups/${groupId}/`,
            search: limit !== DEFAULT_LIMIT ? `?limit=${limit}` : '',
        });
    }

    return <>
        <SearchGroup column={column} limit={limit} pathname={`/cc/admin/groups/${groupId}/`}
            searchQueryUrlParam={searchQueryUrlParam}
        />
        <GroupsTable refreshGroupList={fetchNow} className="mt-15" groups={groups} error={error} loading={loading}>
            {
                searchQueryUrlParam.length > 0 ?
                <div className="flex flex-col items-center">
                    <div className="font-bold mb-10">No subgroups match your search criteria</div>
                    <div onClick={clearSearch} className="cursor-pointer hover:underline">Clear your search</div>
                </div> :
                <b>
                    This group has no children
                </b>
            }
        </GroupsTable>
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
    </>;
});

interface Props {
    groupId: string
}