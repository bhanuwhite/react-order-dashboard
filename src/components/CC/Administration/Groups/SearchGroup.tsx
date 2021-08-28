import * as React from 'react';
import { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { SearchBar, Button } from '@/components/core';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';


// tslint:disable-next-line: variable-name
export const SearchGroup: FC<Props> = ({ column, searchQueryUrlParam, limit, pathname }) => {

    const history = useHistory();
    const [ searchQuery, setSearchQuery ] = React.useState('');
    const [ dropdownOpen, setDropdownOpen ] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);
    const closeDropDown = React.useCallback(() => setDropdownOpen(false), [ setDropdownOpen ]);

    useOnClickOutside(ref, closeDropDown);

    React.useEffect(() => {
        if (searchQueryUrlParam !== searchQuery) {
            setSearchQuery(searchQueryUrlParam);
        }
    }, [ searchQueryUrlParam ]);

    function doSearch() {
        history.push({
            pathname,
            search: searchQuery ? `?search=${encodeURIComponent(searchQuery)}&limit=${limit}&kind=${column}` :
                column !== 'name' ? `?limit=${limit}&kind=${column}` : `?limit=${limit}`,
        });
    }

    function searchBy(kind: 'contact' | 'name' | 'veeahub') {
        return () => {
            if (column !== kind) {
                history.push({
                    pathname,
                    search: searchQuery ? `?search=${encodeURIComponent(searchQuery)}&limit=${limit}&kind=${kind}` :
                        kind !== 'name' ? `?limit=${limit}&kind=${kind}` : `?limit=${limit}`,
                });
            }
            setDropdownOpen(false);
        };
    }

    return <SearchBar className="max-width-700" buttonClassName="pl-20 pr-20" placeholder="Search for subgroups"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        doSearch={doSearch}
        button={(props) =>
            <div className="relative" ref={ref}>
                <Button {...props} className={`${props.className} ml-0 mr-0 rounded-none`}>
                    Search by {
                        column === 'veeahub' ? 'Serial Number' :
                        column === 'contact' ? 'Contact Email' :
                        'Group name'
                    }
                </Button>
                <Button primary className="m-0 border-l-primary-light" style={{
                    borderTopLeftRadius: '0',
                    borderBottomLeftRadius: '0',
                }} onClick={() => setDropdownOpen(!dropdownOpen)}>
                    <i className={`fas ${!dropdownOpen ? 'fa-chevron-down' : 'fa-chevron-up'}`}/>
                </Button>
                {dropdownOpen &&
                    <div className="absolute w-full right-0 bkg-white pt-10 pb-10 box-sdw-errors font-size-12 font-bold cursor-pointer">
                        <div className={`hover:text-white pl-20 p-10 bkg-hover-primary ${column === 'name' ? 'bkg-primary text-white' : ''}`} onClick={searchBy('name')}>Search by Group name</div>
                        <div className={`hover:text-white pl-20 p-10 bkg-hover-primary ${column === 'contact' ? 'bkg-primary text-white' : ''}`} onClick={searchBy('contact')}>Search by Contact Email</div>
                        <div className={`hover:text-white pl-20 p-10 bkg-hover-primary ${column === 'veeahub' ? 'bkg-primary text-white' : ''}`} onClick={searchBy('veeahub')}>Search by Serial Number</div>
                    </div>
                }
            </div>
        }
    />;
};

interface Props {
    column: 'contact' | 'name' | 'veeahub'
    pathname: string
    searchQueryUrlParam: string
    limit: number
}
