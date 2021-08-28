import * as React from 'react';
import { FC } from 'react';
import styles from './Search.module.scss';
import { Autocomplete } from '@/components/core/Inputs';
import { useOwnerEnrollDataFetcher } from '@/hooks/fetchers';
import { useStore } from '@/hooks/useStore';
import { observer } from 'mobx-react-lite';
import { Link, useHistory } from 'react-router-dom';


// tslint:disable-next-line: variable-name
export const Search: FC<Props> = observer(({ selectedGroupId }) => {
    const store = useStore();
    const history = useHistory();
    const [timeoutId] = React.useState(0);
    const [optionSelected, setOptionSelected] = React.useState<MeshDevice | undefined>(undefined);
    const [inputValue, setInputValue] = React.useState('');
    const options = store.domain.enrollment.meshes.all.reduce((res, m) => {
        res.push({ name: m.name, id: m.acsId, type: 'mesh', link: `/cc/${selectedGroupId}/devices/mesh/${m.id}` });
        m.devices.forEach(dev => {
            const deviceName = store.domain.nodes.map.get(dev.id)?.props.name ?? dev.name;
            res.push({
                name: deviceName,
                id: dev.id,
                type: 'node',
                link: `/cc/${selectedGroupId}/devices/device/${dev.id}`,
            });
        });
        return res;
    }, [] as MeshDevice[]);
    const { loading, fetchNow } = useOwnerEnrollDataFetcher(selectedGroupId);
    const skipNextHandleSearchEvent = React.useRef(false);

    const handleSearch = (_e: React.ChangeEvent<{}>, value: string): void => {
        if (skipNextHandleSearchEvent.current) {
            skipNextHandleSearchEvent.current = false;
            return;
        }
        setInputValue(value);
        if (value.length >= 2) {
            clearTimeout(timeoutId);
            // setTimeoutId(setTimeout(() => {
                fetchNow();
            // }, 1000));
        }
    };

    const redirect = (_e: React.ChangeEvent<{}>, opt: MeshDevice | null | string): void => {
        if (opt && typeof opt !== 'string') {
            skipNextHandleSearchEvent.current = true;
            setOptionSelected(undefined);
            setInputValue('');
            history.push(opt.link);
        }
    };

    return <Autocomplete className={styles.globalSearch}
        freeSolo
        autoHighlight
        prependIcon="fas fa-search"
        loading={loading}
        options={options}
        onChange={redirect}
        value={optionSelected}
        inputValue={inputValue}
        onInputChange={handleSearch}
        renderOption={({ id, name, type }) => <Link to={optionLink(type, id, selectedGroupId)} className={'device-mesh-link'}>
            <i className={type === 'mesh' ? 'icon-70_Mesh' : 'icon-78_VeeaHub'} />
            {name}
        </Link>}
        getOptionLabel={option => {
            // referencing default usage of `getOptionLabel` here:
            // https://bit.ly/32My8rg
            if (typeof option !== 'string') {
                return option.name;
            }
            return option;
        }}
        label="Search VeeaHubs, meshes and more.."
    />;
});
interface Props {
    selectedGroupId: string
}

interface MeshDevice {
    name: string
    id: string
    type: OptionType
    link: string
}

type OptionType = 'node' | 'mesh';

function optionLink(type: OptionType, id: string, groupId: string): string {
    return `/cc/${groupId}/devices/${type === 'node' ? 'device' : 'mesh'}/${id}`;
}