import * as React from 'react';
import { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { SearchBar } from '@/components/core';
import { useQuery } from '@/hooks/useQuery';


// tslint:disable-next-line: variable-name
export const UsersSearch: FC<{ className?: string }> = ({ className }) => {

    const history = useHistory();
    const searchBarQuery = useQuery().get('search') ?? '';
    const [ searchQuery, setSearchQuery ] = React.useState(searchBarQuery);
    const doSearch = () => history.push({
        pathname: '/cc/admin/users',
        search: searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : '',
    });

    return <SearchBar className={className} placeholder="Search for users"
        doSearch={doSearch} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />;
};